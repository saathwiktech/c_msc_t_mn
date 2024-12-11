const mongoose = require('mongoose');

const ConstructionCostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  foundation: {
    type: Number,
    default: 0
  },
  painting: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model('ConstructionCost', ConstructionCostSchema);
