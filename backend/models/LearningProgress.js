const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const learningProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  overallConfidence: { type: Number, min: 0, max: 100, default: 0 },
  subjectProgress: [{
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    completedTopics: { type: Number, default: 0 },
    totalTopics: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
