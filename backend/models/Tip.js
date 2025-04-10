const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema({
    message: { type: String, required: true },
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tip", TipSchema);