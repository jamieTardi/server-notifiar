import { Router, Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
	username: z.string().min(3).max(50),
	email: z.string().email(),
	password: z.string().min(6),
});

const adminLoginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

// Register new user
const registerHandler: RequestHandler = async (req, res) => {
	try {
		const { username, email, password } = registerSchema.parse(req.body);

		// Check if user already exists
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ username }, { email }],
			},
		});

		if (existingUser) {
			res.status(400).json({ error: 'Username or email already exists' });
			return;
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

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
		if (error instanceof z.ZodError) {
			res
				.status(400)
				.json({ error: 'Invalid input data', details: error.errors });
			return;
		}
		console.error('Registration error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Admin login
const adminLoginHandler: RequestHandler = async (req, res) => {
	try {
		const { username, password } = adminLoginSchema.parse(req.body);

		// Find admin
		const admin = await prisma.admin.findUnique({
			where: { username },
		});

		if (!admin) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}

		// Check password
		const isValidPassword = await bcrypt.compare(password, admin.password);
		if (!isValidPassword) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: admin.id, username: admin.username, role: 'admin' },
			process.env.JWT_SECRET!,
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
		if (error instanceof z.ZodError) {
			res
				.status(400)
				.json({ error: 'Invalid input data', details: error.errors });
			return;
		}
		console.error('Login error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

router.post('/register', registerHandler);
router.post('/admin/login', adminLoginHandler);

export default router;
