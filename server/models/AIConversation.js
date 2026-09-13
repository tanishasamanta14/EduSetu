const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aiConversationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topicContext: { type: Schema.Types.ObjectId, ref: 'Topic' }, // Optional context
  messages: [{
    role: { type: String, enum: ['user', 'ai', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  sessionDate: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.model('AIConversation', aiConversationSchema);
