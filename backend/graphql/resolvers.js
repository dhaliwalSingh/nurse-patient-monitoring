const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();
const Vitals = require('../models/Vitals');

const resolvers = {
    Query: {
        getUsers: async (_, __, context) => {
            try {
                const user = authMiddleware(context);  // ✅ Verify Token
                if (user.role !== 'nurse') throw new Error('Access Denied');

                return await User.find({ role: "patient" });

            } catch (error) {
                console.error('❌ Error fetching users:', error);
                return [];
            }
        },

        getAllUsers: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== 'nurse') throw new Error('Access Denied');
            return await User.find(); // ✅ all users
        },
    },

    Mutation: {
        register: async (_, { username, email, password, role }) => {
            try {
                console.log('🟢 Registering:', { username, email, role });

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    console.log('❌ Email already exists');
                    throw new Error('Email already exists');
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ username, email, password: hashedPassword, role });

                const savedUser = await user.save();
                console.log('✅ User Registered:', savedUser);

                return savedUser;
            } catch (error) {
                console.error('❌ Registration Error:', error);
                return null;
            }
        },

        login: async (_, { email, password }) => {
            try {
                console.log(`🔵 Logging in user with email: ${email}`);

                const user = await User.findOne({ email });
                if (!user) throw new Error('User not found');

                const valid = await bcrypt.compare(password, user.password);
                if (!valid) throw new Error('Invalid password');

                const token = jwt.sign(
                    { userId: user._id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                console.log("✅ Login successful, Token generated:", token);
                return token;
            } catch (error) {
                console.error('❌ Login Error:', error);
                return null;
            }
        },

        addVitals: async (_, args, context) => {
            const nurse = authMiddleware(context); // Verify Token
            if (nurse.role !== 'nurse') throw new Error('Unauthorized');

            const vitals = new Vitals({...args});
            return await vitals.save();
        }
    }
};

module.exports = resolvers;
