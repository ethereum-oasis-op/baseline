import mongoose from 'mongoose';
import EdDSASignaturesSchema from './signature';

const MSAMetadata = new mongoose.Schema({
  // is the MSA 'open' or 'closed'?
  open: {
    type: Boolean,
    default: true,
    required: false,
  },
  POs: [
    {
      poId: {
        type: String,
        required: false,
      },
    },
  ],
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

const MSACommitmentSchema = new mongoose.Schema({
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
    accumulatedVolumeOrdered: {
      type: Number,
      required: true,
    },
    accumulatedVolumeDelivered: {
      type: Number,
      required: true,
    },
  },
});

const MSASchema = new mongoose.Schema({
  metadata: {
    type: MSAMetadata,
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
    tierBounds: [
      {
        type: Number,
        required: true,
      },
    ],
    pricesByTier: [
      {
        type: Number,
        required: true,
      },
    ],
    hashOfTieredPricing: {
      type: String,
      required: true,
    },
    minVolume: {
      type: Number,
      required: true,
    },
    maxVolume: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    erc20ContractAddress: {
      type: String,
      required: true,
    },
    EdDSASignatures: {
      buyer: {
        type: EdDSASignaturesSchema,
        required: true,
      },
      supplier: {
        type: EdDSASignaturesSchema,
        required: false,
      },
    },
  },
  commitments: {
    type: [MSACommitmentSchema],
  },
  rfpId: {
    type: String,
    required: true,
  }
});

const MSAModel = mongoose.model('msa', MSASchema);

export default MSAModel;
