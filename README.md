# Notifiar - User Management System

A full-stack web application for user registration and admin management, built with Next.js, Express, and Material-UI.

## Features

- **User Registration**: Secure user registration with username, email, and password
- **Admin Authentication**: Protected admin login with JWT tokens
- **User Management**: Admin dashboard to view all registered users
- **Modern UI**: Beautiful Material-UI interface with responsive design
- **TypeScript**: Full TypeScript support for both frontend and backend

## Tech Stack

### Frontend

- **Next.js 15** with TypeScript
- **Material-UI (MUI)** for components
- **Axios** for API calls
- **React Hook Form** for form handling

### Backend

- **Node.js** with TypeScript
- **Express.js** for API server
- **JWT** for authentication
- **CORS** enabled for cross-origin requests
- **In-memory storage** for demo purposes

## Prerequisites

- **Node.js 18+** (required for Next.js and modern dependencies)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server-notifiar
   ```

2. **Install frontend dependencies**

   ```bash
   cd web
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../api
   npm install
   ```

## Running the Application

### Development Mode

1. **Start the backend server** (Terminal 1)

   ```bash
   cd api
   npx ts-node src/index-simple.ts
   ```

   The backend will run on `http://localhost:3001`

2. **Start the frontend server** (Terminal 2)
   ```bash
   cd web
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the frontend**

   ```bash
   cd web
   npm run build
   npm start
   ```

2. **Start the backend**
   ```bash
   cd api
   npx ts-node src/index-simple.ts
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/admin/login` - Admin login

### Admin (Protected)

- `GET /api/admin/users` - Get all users (requires admin token)

### Health Check

- `GET /health` - Server health check

## Usage

### User Registration

1. Visit `http://localhost:3000`
2. Fill out the registration form with:
   - Username
   - Email address
   - Password (minimum 6 characters)
3. Click "Register" to create your account

### Admin Access

1. Click "Admin Login" button on the homepage
2. Use the default admin credentials:
   - **Username**: `admin`
   - **Password**: `password`
3. After successful login, you'll see the admin dashboard with all registered users

## Project Structure

```
server-notifiar/
├── api/                    # Backend server
│   ├── src/
│   │   ├── index-simple.ts # Main server file
│   │   └── routes/         # API routes
│   ├── package.json
│   └── tsconfig.json
├── web/                    # Frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   └── styles/        # CSS styles
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in the `api` directory:

```env
DATABASE_URL="postgresql://localhost:5432/notifiar_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Note**: The current implementation uses in-memory storage for demo purposes. The DATABASE_URL is not used but kept for future database integration.

## Development Notes

### Current Implementation

- **In-memory storage**: Users and admin data are stored in memory for demo purposes
- **Simple authentication**: Admin password is hardcoded as "password" for demo
- **No database**: PostgreSQL configuration is prepared but not currently used

### Future Enhancements

- Database integration with PostgreSQL and Prisma
- User password hashing with bcrypt
- Email verification
- Password reset functionality
- User roles and permissions
- API rate limiting
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Kill existing processes
   pkill -f "ts-node"
   pkill -f "next"
   ```

2. **Node.js version issues**

   ```bash
   # Use Node.js 18+ for Next.js
   nvm use 18
   # or
   nvm use 24
   ```

3. **Frontend not loading**

   - Check if backend is running on port 3001
   - Verify CORS is enabled
   - Check browser console for errors

4. **API calls failing**
   - Ensure backend server is running
   - Check API endpoint URLs in frontend code
   - Verify JWT token is being sent correctly

### Development Commands

```bash
# Start both servers (in separate terminals)
cd api && npx ts-node src/index-simple.ts
cd web && npm run dev

# Test API endpoints
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## Security Notes

⚠️ **Important**: This is a demo application with simplified security:

- Admin credentials are hardcoded
- Passwords are stored in plain text (in-memory)
- No rate limiting or input validation
- JWT secret should be changed in production
- Database integration recommended for production use

## License

This project is for demonstration purposes. Please implement proper security measures before using in production.
