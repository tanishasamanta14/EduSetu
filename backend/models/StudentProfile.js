const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  name: { type: String, required: true },
  school: { type: String },
  grade: { type: Number, required: true, index: true },
  language: { type: String, default: 'en' },
  enrolledSubjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
