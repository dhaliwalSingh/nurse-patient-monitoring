const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vitals = require('../models/Vitals');
const Alert = require('../models/Alert');
const Tip = require('../models/Tip');
const Symptom = require('../models/Symptom');
const authMiddleware = require('../middleware/auth');
const { getGeminiSuggestion } = require('../utils/geminiHelper');
require('dotenv').config();

const resolvers = {
    Query: {
        getUsers: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== 'nurse') throw new Error('Access Denied');
            return await User.find({ role: "patient" });
        },

        getTips: async (_, __, context) => {
            const user = authMiddleware(context);
            return await Tip.find().populate("createdBy").sort({ createdAt: -1 });
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

        getMySymptoms: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== "patient") throw new Error("Unauthorized");
            return await Symptom.find({ patientId: user.userId }).sort({ createdAt: -1 });
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
You are an experienced nurse assistant AI.

Here is the recent data for a patient:

🩺 Vitals:
${vitals.map(v => `- Temp: ${v.temperature}°C, HR: ${v.heartRate} bpm, BP: ${v.bloodPressure}, RR: ${v.respiratoryRate}`).join('\n')}

😷 Symptoms:
${symptoms.map(s => `- ${s.description}`).join('\n')}

Based on this data, provide a concise and professional nursing action plan or next steps. 
Avoid diagnosis, but include any necessary precautions or red flags. First briefly summarize the vitals and symptoms.
`;

            return await getGeminiSuggestion(prompt);
        },

        getAIHealthAdvice: async (_, { patientId }, context) => {
            const nurse = authMiddleware(context);
            if (nurse.role !== 'nurse') throw new Error('Unauthorized');

            const symptoms = await Symptom.find({ patientId }).sort({ createdAt: -1 });
            const vitals = await Vitals.find({ patientId }).sort({ createdAt: -1 });

            const prompt = `
Given the following patient's vitals and symptoms:
Symptoms:
${symptoms.map(s => `- ${s.description}`).join('\n')}

Vitals:
${vitals.map(v => `- Temp: ${v.temperature}, HR: ${v.heartRate}, BP: ${v.bloodPressure}, RR: ${v.respiratoryRate}`).join('\n')}

Provide a professional but concise health suggestion for a nurse.`;

            return await getGeminiSuggestion(prompt);
        },

        getPatientSymptomInsight: async (_, __, context) => {
            const user = authMiddleware(context);
            if (user.role !== "patient") throw new Error("Unauthorized");

            const symptoms = await Symptom.find({ patientId: user.userId }).sort({ createdAt: -1 }).limit(3);

            if (!symptoms.length) return "Please enter your symptoms to get feedback.";

            const prompt = `
The patient reports:
${symptoms.map(s => `- ${s.description}`).join('\n')}

Respond in a calm, friendly way with a tip or gentle next step. No diagnosis.`;

            return await getGeminiSuggestion(prompt);
        },

        chatWithAI: async (_, { message }, context) => {
            const user = authMiddleware(context);
            const prompt = `Patient says: "${message}". Respond helpfully, warmly, and without diagnosis.`;
            return await getGeminiSuggestion(prompt);
        },
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

            const tip = new Tip({ message, createdBy: user.userId });
            return await tip.save();
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

        addSymptom: async (_, { descriptions }, context) => {
            const user = authMiddleware(context);
            if (user.role !== "patient") throw new Error("Only patients can submit symptoms");

            const entries = descriptions.map(desc => ({
                patientId: user.userId,
                description: desc
            }));

            await Symptom.insertMany(entries);
            return true;
        },
    }
};

module.exports = resolvers;