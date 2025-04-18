const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tip", tipSchema);