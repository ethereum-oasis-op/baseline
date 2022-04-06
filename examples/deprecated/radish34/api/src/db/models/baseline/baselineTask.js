import mongoose from 'mongoose';

export const BaselineTaskSchema = new mongoose.Schema({
  jobId: { type: String, default: null },
  description: { type: String },
  completed: { type: Boolean, default: false },
  requires: [String],
  provides: [String],
  error: { type: String },
  resolver: { type: String },
  resolverOptions: Map,
});

export const BaselineTask = mongoose.model('baselinetask', BaselineTaskSchema);
