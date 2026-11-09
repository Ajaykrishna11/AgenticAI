import mongoose from 'mongoose';

const agentLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    agentName: { type: String, required: true },
    action: { type: String, required: true },
    inputData: { type: mongoose.Schema.Types.Mixed, default: {} },
    outputData: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['SUCCESS', 'WARNING', 'FAILED'], default: 'SUCCESS' }
  },
  { timestamps: true }
);

export const AgentLog = mongoose.models.AgentLog || mongoose.model('AgentLog', agentLogSchema);
