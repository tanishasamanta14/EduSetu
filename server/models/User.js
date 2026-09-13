const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }, // Will be hashed
  role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student', index: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
