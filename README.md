# Project Manager

A full-stack web application for efficient project and task management. This application helps teams and individuals organize projects, track tasks, and collaborate effectively.

## 🚀 Tech Stack

### Frontend

- React.js with Vite
- Redux Toolkit for state management
- React Router for navigation
- TailwindCSS for styling
- Protected Routes for authentication

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing

### Deployment

- Frontend: [Deployed on Vercel](#)
- Backend: [Deployed on Railway/Render](#)
- Database: MongoDB Atlas

## ✨ Features

- **User Authentication**

  - Register new account
  - Login with existing account
  - JWT-based authentication

- **Project Management**

  - Create new projects
  - View all projects
  - Manage project details
  - Track project progress

- **Task Management**

  - Create tasks within projects
  - Update task status
  - Assign tasks
  - Track task progress
  - Filter and sort tasks

- **Dashboard**
  - Overview of all projects
  - Task statistics
  - Recent activities

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the server directory (see Environment Variables section)

4. Start the server:

   ```bash
   # Development mode
   npm run server

   # Production mode
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the client directory (see Environment Variables section)

4. Start the development server:

   ```bash
   npm run dev
   ```

5. For production build:
   ```bash
   npm run build
   ```

## 🔐 Environment Variables

### Backend (.env.example)

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/project-manager
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env.example)

```env
VITE_API_URL=http://localhost:8080/api
```

## 📊 Database Schema

[Insert Database Schema Image Here]

### Collections:

1. Users
2. Projects
3. Tasks

## 🎯 How to Use

1. **Register/Login**

   - Create a new account or login with existing credentials
   - Access the dashboard

2. **Create a Project**

   - Click on "New Project" button
   - Fill in project details
   - Submit to create project

3. **Manage Tasks**

   - Navigate to project details
   - Click "Add Task" to create new tasks
   - Update task status as needed
   - Track progress through dashboard

4. **View Dashboard**
   - Monitor overall progress
   - Check recent activities
   - View task statistics

## 🌐 API Endpoints

### Auth Routes

- POST /api/auth/register
- POST /api/auth/login

### Project Routes

- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Task Routes

- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

## 📱 Deployment

### Backend Deployment

- Deployed on [Railway/Render](#)
- Auto-deploys from main branch

### Frontend Deployment

- Deployed on [Vercel](#)
- Auto-deploys from main branch

## 👨‍💻 Author

- **Shivam Chaudhary**

## 📄 License

This project is licensed under the ISC License.
