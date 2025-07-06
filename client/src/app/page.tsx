'use client';

import { useState } from 'react';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
	Link,
	AppBar,
	Toolbar,
} from '@mui/material';
import { Person, AdminPanelSettings } from '@mui/icons-material';
import axios from 'axios';

export default function Home() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
	});
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await axios.post(
				'http://localhost:3001/api/auth/register',
				formData,
			);
			setMessage({ type: 'success', text: 'Registration successful!' });
			setFormData({ username: '', email: '', password: '' });
		} catch (error: any) {
			setMessage({
				type: 'error',
				text: error.response?.data?.error || 'Registration failed',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						Notifiar
					</Typography>
					<Link href='/admin' color='inherit' sx={{ textDecoration: 'none' }}>
						<Button color='inherit' startIcon={<AdminPanelSettings />}>
							Admin Login
						</Button>
					</Link>
				</Toolbar>
			</AppBar>

			<Container maxWidth='sm' sx={{ mt: 4 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
						<Person sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
						<Typography variant='h4' component='h1'>
							User Registration
						</Typography>
					</Box>

					{message && (
						<Alert severity={message.type} sx={{ mb: 2 }}>
							{message.text}
						</Alert>
					)}

					<Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin='normal'
							required
							fullWidth
							id='username'
							label='Username'
							name='username'
							autoComplete='username'
							autoFocus
							value={formData.username}
							onChange={handleChange}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='new-password'
							value={formData.password}
							onChange={handleChange}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}>
							{loading ? 'Registering...' : 'Register'}
						</Button>
					</Box>
				</Paper>
			</Container>
		</>
	);
}
