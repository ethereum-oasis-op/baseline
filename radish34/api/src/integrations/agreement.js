import mongoose from 'mongoose';
import EdDSASignaturesSchema from './signature';

const AgreementMetadata = new mongoose.Schema({
  // is the Document 'open' or 'closed'?
  open: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const AgreementCommitmentSchema = new mongoose.Schema({
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
});

const AgreementSchema = new mongoose.Schema({
  metadata: {
    type: AgreementMetadata,
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
    name: {
      type: String,
      required: true,
    },
    description: {
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
    type: [AgreementCommitmentSchema],
  },
  linkedId: {
    type: String,
    required: true,
  }
});

const AgreementModel = mongoose.model('agreement', AgreementSchema);

export default AgreementModel;
