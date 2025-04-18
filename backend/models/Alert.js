const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    resolved: {type: Boolean, default: false},
    notes: String,
});

module.exports = mongoose.model("Alert", AlertSchema);
