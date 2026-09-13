const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: { type: String, required: true },
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
