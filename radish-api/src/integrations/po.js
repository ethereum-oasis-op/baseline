import mongoose from 'mongoose';

const POMetadata = new mongoose.Schema({
  msaId: {
    type: String,
    required: true,
  },
  // is the PO 'open' or 'closed'?
  open: {
    type: Boolean,
    default: true,
    required: false,
  },
  deliveryDate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deliveries: [
    {
      deliveryId: {
        type: String,
        required: false,
      },
    },
  ],
  invoices: [
    {
      invoiceId: {
        type: String,
        required: false,
      },
    },
  ],
});

const POCommitmentSchema = new mongoose.Schema({
  commitment: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: false,
  },
  salt: {
    type: String,
    required: true,
  },
  nullifier: {
    type: String,
    required: true,
  },
  variables: {
    accumulatedVolumeDelivered: {
      type: Number,
      required: true,
    },
  },
});

const POSchema = new mongoose.Schema({
  metadata: {
    type: POMetadata,
    required: false,
  },
  constants: {
    zkpPublicKeyOfBuyer: {
      type: String,
      required: true,
    },
    zkpPublicKeyOfSupplier: {
      type: String,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
    sku: {
      type: String,
      required: true,
    },
    erc20ContractAddress: {
      type: String,
      required: true,
    },
  },
  commitments: {
    type: [POCommitmentSchema],
    required: true,
  },
});

export const POModel = mongoose.model('POs', POSchema);

export { POModel as default };
