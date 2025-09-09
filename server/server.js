import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';

const app = express();

// Connect DB if URI is valid
const uri = process.env.MONGODB_URI;
if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    await connectDB();
} else {
    console.warn('Skipping DB connect: invalid or missing MONGODB_URI');
}

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})

export default app;