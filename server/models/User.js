import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['siswa', 'guru'],
    required: [true, 'Pilih peranmu: siswa atau guru?'],
  },
  stars: {
    type: Number,
    default: 0,
    required: function() { return this.role === 'siswa'; }
  },
  completedQuizzes: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    highestScore: {
      type: Number,
      required: true,
      default: 0
    }
  }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;

