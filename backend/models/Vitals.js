const mongoose = require("mongoose");

const VitalsSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    temperature: Number,
    heartRate: Number,
    bloodPressure: String,
    respiratoryRate: Number,
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Vitals", VitalsSchema);