const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOptionText: { type: String },
  isCorrect: { type: Boolean, required: true },
  misconceptionTag: { type: String }
}, { _id: false });

const quizAttemptSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  answers: [answerSchema]
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
