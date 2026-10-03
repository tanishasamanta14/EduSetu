const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mentorStudentSchema = new Schema({
  mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
  assignmentDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure a student isn't assigned to the same mentor twice
mentorStudentSchema.index({ mentor: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('MentorStudent', mentorStudentSchema);
