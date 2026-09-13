const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  gradeLevel: { type: Number, required: true },
  prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  description: { type: String },
  keyPoints: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
