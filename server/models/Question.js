const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false },
  misconceptionTag: { type: String } // e.g. "sign-error", "unit-confusion"
}, { _id: false });

const questionSchema = new Schema({
  topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  text: { type: String, required: true },
  options: [optionSchema],
  explanation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
