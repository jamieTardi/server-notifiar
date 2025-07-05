import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
