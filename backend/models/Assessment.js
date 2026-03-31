const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  scores: {
    wordRecall: { score: Number, maxScore: Number, timeTaken: Number },
    pattern: { score: Number, maxScore: Number, timeTaken: Number },
    numberSequence: { score: Number, maxScore: Number, timeTaken: Number },
    mathReasoning: { score: Number, maxScore: Number, timeTaken: Number },
    reactionTime: { averageTimeMs: Number },
    videoComprehension: { score: Number, maxScore: Number, timeTaken: Number },
    voiceAnalysis: { hesitations: Number, clarityScore: Number, speechRate: Number },
  },
  completionStatus: {
    wordRecall: { type: Boolean, default: false },
    pattern: { type: Boolean, default: false },
    numberSequence: { type: Boolean, default: false },
    mathReasoning: { type: Boolean, default: false },
    reactionTime: { type: Boolean, default: false },
    videoComprehension: { type: Boolean, default: false },
    voiceAnalysis: { type: Boolean, default: false },
  },
  finalRiskScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  riskCategory: {
    type: String,
    enum: ['LOW', 'MODERATE', 'HIGH', 'PENDING'],
    default: 'PENDING',
  },
  smartExplanation: {
    type: [String],
  }
}, {
  timestamps: true,
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
