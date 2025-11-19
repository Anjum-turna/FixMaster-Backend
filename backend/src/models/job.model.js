import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
},
  service: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', 
    required: true 
},
  provider: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
}, // Assigned provider
  title: String,
  description: String,
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  basePrice: { type: Number, required: true },
  extraCharges: [{
    amount: Number,
    reason: String,
    damagePhoto: String, // URL
    approved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  providerOffers: [{
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    offeredPrice: Number,
    message: String,
    accepted: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
}, {timestamps: true}
);

module.exports = mongoose.model('Job', jobSchema);