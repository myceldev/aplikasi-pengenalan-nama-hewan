import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;