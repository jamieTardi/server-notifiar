export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Admin {
	id: string;
	username: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface RegisterUserRequest {
	username: string;
	email: string;
	password: string;
}

export interface AdminLoginRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user: Omit<User, 'password'> | Omit<Admin, 'password'>;
}
