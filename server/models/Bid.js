const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  proposal: { type: String, required: true },
  documents: [{ filename: String, originalname: String }],
  status: { type: String, enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected'], default: 'Submitted' },
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);