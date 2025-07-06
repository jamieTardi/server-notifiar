'use client';

import { useState, useEffect } from 'react';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	AppBar,
	Toolbar,
	Link,
} from '@mui/material';
import { AdminPanelSettings, Login, Logout, Home } from '@mui/icons-material';
import axios from 'axios';

interface User {
	id: string;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export default function AdminPage() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [loginData, setLoginData] = useState({ username: '', password: '' });
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const savedToken = localStorage.getItem('adminToken');
		if (savedToken) {
			setToken(savedToken);
			setIsLoggedIn(true);
			fetchUsers(savedToken);
		}
	}, []);

	const fetchUsers = async (authToken: string) => {
		try {
			const response = await axios.get(
				'http://localhost:3001/api/admin/users',
				{
					headers: { Authorization: `Bearer ${authToken}` },
				},
			);
			setUsers(response.data.users);
		} catch (error) {
			console.error('Error fetching users:', error);
			setMessage({ type: 'error', text: 'Failed to fetch users' });
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await axios.post(
				'http://localhost:3001/api/auth/admin/login',
				loginData,
			);
			const { token: authToken } = response.data;

			localStorage.setItem('adminToken', authToken);
			setToken(authToken);
			setIsLoggedIn(true);
			setMessage({ type: 'success', text: 'Login successful!' });
			setLoginData({ username: '', password: '' });

			fetchUsers(authToken);
		} catch (error: any) {
			setMessage({
				type: 'error',
				text: error.response?.data?.error || 'Login failed',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('adminToken');
		setToken(null);
		setIsLoggedIn(false);
		setUsers([]);
		setMessage({ type: 'success', text: 'Logged out successfully' });
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginData({
			...loginData,
			[e.target.name]: e.target.value,
		});
	};

	if (isLoggedIn) {
		return (
			<>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
							Admin Dashboard
						</Typography>
						<Link
							href='/'
							color='inherit'
							sx={{ textDecoration: 'none', mr: 2 }}>
							<Button color='inherit' startIcon={<Home />}>
								Home
							</Button>
						</Link>
						<Button
							color='inherit'
							onClick={handleLogout}
							startIcon={<Logout />}>
							Logout
						</Button>
					</Toolbar>
				</AppBar>

				<Container maxWidth='lg' sx={{ mt: 4 }}>
					<Paper elevation={3} sx={{ p: 4 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
							<AdminPanelSettings
								sx={{ mr: 2, fontSize: 40, color: 'primary.main' }}
							/>
							<Typography variant='h4' component='h1'>
								User Management
							</Typography>
						</Box>

						{message && (
							<Alert severity={message.type} sx={{ mb: 2 }}>
								{message.text}
							</Alert>
						)}

						<Typography variant='h6' sx={{ mb: 2 }}>
							Registered Users ({users.length})
						</Typography>

						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Username</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Created At</TableCell>
										<TableCell>Updated At</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map((user) => (
										<TableRow key={user.id}>
											<TableCell>{user.username}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>
												{new Date(user.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												{new Date(user.updatedAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Container>
			</>
		);
	}

	return (
		<>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						Admin Login
					</Typography>
					<Link href='/' color='inherit' sx={{ textDecoration: 'none' }}>
						<Button color='inherit' startIcon={<Home />}>
							Home
						</Button>
					</Link>
				</Toolbar>
			</AppBar>

			<Container maxWidth='sm' sx={{ mt: 4 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
						<AdminPanelSettings
							sx={{ mr: 2, fontSize: 40, color: 'primary.main' }}
						/>
						<Typography variant='h4' component='h1'>
							Admin Login
						</Typography>
					</Box>

					{message && (
						<Alert severity={message.type} sx={{ mb: 2 }}>
							{message.text}
						</Alert>
					)}

					<Box component='form' onSubmit={handleLogin} sx={{ mt: 1 }}>
						<TextField
							margin='normal'
							required
							fullWidth
							id='username'
							label='Admin Username'
							name='username'
							autoComplete='username'
							autoFocus
							value={loginData.username}
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
							autoComplete='current-password'
							value={loginData.password}
							onChange={handleChange}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
							startIcon={<Login />}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</Box>
				</Paper>
			</Container>
		</>
	);
}
