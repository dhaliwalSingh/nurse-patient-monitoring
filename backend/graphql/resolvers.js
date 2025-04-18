const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vitals = require('../models/Vitals');
const Alert = require('../models/Alert');
const Tip = require('../models/Tip');
const Symptom = require('../models/Symptom');
const authMiddleware = require('../middleware/auth');
const { getGeminiSuggestion } = require('../utils/geminiHelper'); // ✅ Gemini function
require('dotenv').config();

const resolvers = {
    Query: {
        getUsers: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== 'nurse') throw new Error('Access Denied');
            return await User.find({ role: "patient" });
        },

        getAllUsers: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== 'nurse') throw new Error('Access Denied');
            return await User.find();
        },

        getVitalsByPatient: async (_, { patientId }, context) => {
            const nurse = authMiddleware(context);
            if (nurse.role !== 'nurse') throw new Error('Unauthorized');
            return await Vitals.find({ patientId }).sort({ createdAt: -1 });
        },

        getAllAlerts: async (_, __, context) => {
            const nurse = authMiddleware(context);
            if (nurse.role !== 'nurse') throw new Error("Access Denied");
            return await Alert.find().populate("patientId").sort({ createdAt: -1 });
        },

        getSymptomsByPatient: async (_, { patientId }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "nurse") throw new Error("Only nurses can view symptoms");
            return await Symptom.find({ patientId }).sort({ createdAt: -1 });
        },

        getAISuggestion: async (_, { patientId }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "nurse") throw new Error("Unauthorized");

            const vitals = await Vitals.find({ patientId }).sort({ createdAt: -1 }).limit(3);
            const symptoms = await Symptom.find({ patientId }).sort({ createdAt: -1 }).limit(3);

            const prompt = `
Patient has the following recent vitals:
${vitals.map(v => `- Temp: ${v.temperature}°C, HR: ${v.heartRate}bpm, BP: ${v.bloodPressure}, RR: ${v.respiratoryRate}`).join('\n')}

And reported symptoms:
${symptoms.map(s => `- ${s.description}`).join('\n')}

Based on this, provide a professional nurse-level health suggestion or possible next steps (avoid diagnosis).
`;

            return await getGeminiSuggestion(prompt);
        },

        getAIHealthAdvice: async (_, { patientId }, context) => {
            const nurse = authMiddleware(context);
            if (nurse.role !== 'nurse') throw new Error('Unauthorized');

            const symptoms = await Symptom.find({ patientId }).sort({ createdAt: -1 });
            const vitals = await Vitals.find({ patientId }).sort({ createdAt: -1 });

            const prompt = `
Given the following patient's recent vitals and symptoms:
Symptoms:
${symptoms.map((s) => `- ${s.description}`).join("\n")}

Vitals:
${vitals.map((v) => `- Temp: ${v.temperature}, HR: ${v.heartRate}, BP: ${v.bloodPressure}, RR: ${v.respiratoryRate}`).join("\n")}

Please provide a concise health suggestion.
`;

            return await getGeminiSuggestion(prompt);
        },

        getPatientSymptomInsight: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== "patient") throw new Error("Unauthorized");

            const symptoms = await Symptom.find({ patientId: user.userId }).sort({ createdAt: -1 }).limit(3);

            if (!symptoms.length) return "Please submit symptoms to receive suggestions.";

            const prompt = `
You are an AI health assistant. The patient has reported the following symptoms:
${symptoms.map(s => `- ${s.description}`).join("\n")}

Please provide a friendly, reassuring tip or next step the patient can take. Do not make any diagnosis.
`;

            return await getGeminiSuggestion(prompt);
        }
    },

    Mutation: {
        register: async (_, { username, email, password, role }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('Email already exists');
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword, role });
            return await user.save();
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid password');

            return jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        },

        addVitals: async (_, args, context) => {
            const nurse = authMiddleware(context);
            if (nurse.role !== 'nurse') throw new Error('Unauthorized');
            return await new Vitals({ ...args }).save();
        },

        createEmergencyAlert: async (_, { message }, context) => {
            const user = authMiddleware(context);
            if (user.role !== 'patient') throw new Error('Only patients can create alerts');
            return await new Alert({ patientId: user.userId, message }).save();
        },

        createTip: async (_, { message }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "nurse") throw new Error("Only nurses can create tips");
            return await new Tip({ message, createdBy: user.userId }).save();
        },

        markAlertResolved: async (_, { id, notes }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "nurse") throw new Error("Unauthorized");
            return await Alert.findByIdAndUpdate(id, { resolved: true, notes }, { new: true });
        },

        deleteAlert: async (_, { id }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "nurse") throw new Error("Unauthorized");
            await Alert.findByIdAndDelete(id);
            return true;
        },

        addSymptom: async (_, { description }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "patient") throw new Error("Only patients can submit symptoms");
            return await new Symptom({ patientId: user.userId, description }).save();
        },
    }
};

module.exports = resolvers;
