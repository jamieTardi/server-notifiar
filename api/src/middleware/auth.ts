import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
	user?: any;
}

export const authenticateToken: RequestHandler = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		res.status(401).json({ error: 'Access token required' });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		(req as AuthRequest).user = decoded;
		next();
	} catch (error) {
		res.status(403).json({ error: 'Invalid token' });
	}
};
