import mongoose from 'mongoose';

const EdDSASignaturesSchema = new mongoose.Schema({
  R: {
    type: String,
    required: false,
  },
  S: {
    type: String,
    required: false,
  },
});

export default EdDSASignaturesSchema;
