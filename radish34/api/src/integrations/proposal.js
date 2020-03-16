import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    trim: true,
  },
  rfpId: {
    type: String,
    required: true,
  },
  rates: [
    {
      _id: false,
      startRange: {
        type: Number,
        required: true,
      },
      endRange: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      unitOfMeasure: {
        type: String,
        required: true,
      },
    },
  ],
  sender: {
    type: String, // Messenger Id of partner
    required: true,
  },
});

const Proposal = mongoose.model('proposals', ProposalSchema);
