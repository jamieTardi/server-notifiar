import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage for demo purposes
const users: any[] = [];
const admins = [
	{
		id: 'admin-1',
		username: 'admin',
		password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
	},
];

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Validation
		if (!username || !email || !password) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: 'Password must be at least 6 characters' });
		}

		// Check if user already exists
		const existingUser = users.find(
			(u) => u.username === username || u.email === email,
		);
		if (existingUser) {
			return res
				.status(400)
				.json({ error: 'Username or email already exists' });
		}

		// Simple password hashing (for demo purposes)
		const hashedPassword = Buffer.from(password).toString('base64');

		// Create user
		const user = {
			id: `user-${Date.now()}`,
			username,
			email,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		users.push(user);

		res.status(201).json({
			message: 'User registered successfully',
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Admin login
app.post('/api/auth/admin/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		// Validation
		if (!username || !password) {
			return res
				.status(400)
				.json({ error: 'Username and password are required' });
		}

		// Find admin
		const admin = admins.find((a) => a.username === username);
		if (!admin) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Check password (simple comparison for demo)
		if (password !== 'password') {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: admin.id, username: admin.username, role: 'admin' },
			process.env.JWT_SECRET || 'fallback-secret',
			{ expiresIn: '24h' },
		);

		res.json({
			message: 'Login successful',
			token,
			user: {
				id: admin.id,
				username: admin.username,
				role: 'admin',
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: 'Access token required' });
		}

		try {
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || 'fallback-secret',
			);
			const userData = decoded as any;

			if (userData.role !== 'admin') {
				return res.status(403).json({ error: 'Admin access required' });
			}

			const usersWithoutPassword = users.map((user) => ({
				id: user.id,
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			}));

			res.json({
				users: usersWithoutPassword,
				count: usersWithoutPassword.length,
			});
		} catch (error) {
			return res.status(403).json({ error: 'Invalid token' });
		}
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
