import express from 'express';
import { 
  createQuiz, 
  getAllQuizzes, 
  getQuizById, 
  submitQuiz,
  addQuestionToQuiz 
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createQuiz);
router.get('/', protect, getAllQuizzes);
router.get('/:quizId', protect, getQuizById);
router.post('/submit', protect, submitQuiz);
router.post('/:quizId/questions', protect, addQuestionToQuiz);

export default router;