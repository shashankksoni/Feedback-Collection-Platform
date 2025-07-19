const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true, maxlength: 200 },
  questionType: { type: String, enum: ['text', 'multiple-choice'], required: true },
  options: [{ type: String, trim: true, maxlength: 80 }], // max 80 chars per option
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publicId: { type: String, required: true, unique: true }, // for public URL
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
