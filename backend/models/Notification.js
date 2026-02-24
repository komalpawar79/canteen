import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['email', 'sms', 'push'], required: true },
  recipients: [String],
  subject: String,
  message: { type: String, required: true },
  template: String,
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sentAt: Date,
  errorMessage: String
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
