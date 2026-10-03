const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
  status: { type: String, enum: ['mastered', 'developing', 'shaky', 'weak', 'recommended', 'unattempted'], default: 'unattempted' },
  lastScore: { type: Number },
  confidenceLevel: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

// Compound index to ensure uniqueness per user-topic
masterySchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Mastery', masterySchema);
