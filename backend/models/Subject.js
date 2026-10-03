const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  icon: { type: String },
  gradeLevel: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
