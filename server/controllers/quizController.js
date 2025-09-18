import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

export const createQuiz = async (req, res) => {
  const { title, questions } = req.body;
  const createdBy = req.user.id;
  if (req.user.role !== 'guru') {
    return res.status(403).json({ message: 'Hanya guru yang bisa membuat kuis' });
  }
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Judul dan pertanyaan wajib diisi' });
  }
  try {
    const quiz = await Quiz.create({ title, questions, createdBy });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kuis', error: error.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).select('title createdAt');
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'Belum ada kuis yang tersedia' });
    }
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar kuis', error: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Kuis tidak ditemukan' });
    }
    const questionsForStudent = quiz.questions.map(q => ({
      id: q._id,
      questionText: q.questionText,
    }));
    res.status(200).json({ quizId: quiz._id, title: quiz.title, questions: questionsForStudent });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil kuis', error: error.message });
  }
};

export const addQuestionToQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { questionText, answer } = req.body;
  const userId = req.user.id;

  if (!questionText || !answer) {
    return res.status(400).json({ message: 'Teks pertanyaan dan jawaban wajib diisi' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Kuis tidak ditemukan' });
    }

    if (quiz.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Anda tidak punya izin untuk mengubah kuis ini' });
    }

    quiz.questions.push({ questionText, answer });
    const updatedQuiz = await quiz.save();
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan pertanyaan', error: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Kuis tidak ditemukan' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    
    if (!answers) return res.status(400).json({ message: 'Jawaban tidak lengkap' });

    let score = 0;
    answers.forEach(studentAnswer => {
      const question = quiz.questions.find(q => q._id.toString() === studentAnswer.id);
      if (question && question.answer.toLowerCase() === studentAnswer.answer.toLowerCase()) {
        score++;
      }
    });

    const previousAttempt = user.completedQuizzes.find(q => q.quizId.toString() === quizId);
    const previousHighestScore = previousAttempt ? previousAttempt.highestScore : 0;

    if (score <= previousHighestScore) {
      return res.status(200).json({
        message: `Skormu ${score}. Belum melampaui rekor terbaikmu (${previousHighestScore}). Coba lagi!`,
        correctAnswers: score,
        totalQuestions: quiz.questions.length,
      });
    }

    const starsToAdd = score - previousHighestScore;
    user.stars += starsToAdd;

    if (previousAttempt) {
      previousAttempt.highestScore = score;
    } else {
      user.completedQuizzes.push({ quizId, highestScore: score });
    }

    await user.save();

    res.status(200).json({
      message: `Luar biasa! Rekor baru! Kamu dapat ${starsToAdd} bintang tambahan.`,
      correctAnswers: score,
      totalQuestions: quiz.questions.length,
      newTotalStars: user.stars,
    });

  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim jawaban', error: error.message });
  }
};

