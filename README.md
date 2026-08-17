# TaskFlow – Smart Task Management

A full-stack task management application built with React, Node.js, Express, and MongoDB. Features guest login, task CRUD operations, filtering/sorting, theme switching, and responsive design.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Design Notes](#design-notes)

## Features

- **Guest Login** – Continue without registration; optional display name
- **Task Management** – Create, read, update, delete tasks
- **Quick Status Updates** – Change task status inline from the dashboard
- **Filtering & Sorting** – Filter by status, sort by date/priority/title, search tasks
- **Statistics Dashboard** – Overview cards for total, todo, in-progress, and completed tasks
- **Theme Switching** – Light/dark mode with localStorage persistence
- **Responsive Design** – Optimized for desktop, tablet, and mobile
- **UI States** – Loading, error, empty, success, hover, active, and disabled states

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, TypeScript, Tailwind CSS  |
| Backend  | Node.js, Express.js, TypeScript     |
| Database | MongoDB with Mongoose               |
| Deploy   | Vercel (frontend), Render (backend) |

## Architecture

```
┌─────────────────┐     REST API      ┌─────────────────┐     Mongoose     ┌──────────┐
│  React Client   │ ◄──────────────► │  Express Server  │ ◄──────────────► │ MongoDB  │
│  (Vercel)       │   JWT Auth        │  (Render)        │                  │          │
└─────────────────┘                   └─────────────────┘                  └──────────┘
```

**Authentication Flow:**
1. User clicks "Continue as Guest" on the login page
2. Backend creates a guest user and returns a JWT token
3. Frontend stores the token in localStorage
4. All task API requests include the token in the Authorization header

**Theme Persistence:**
- Theme preference is stored in `localStorage` under `taskflow_theme`
- Applied via the `dark` class on the document root element

## Project Structure

```
TaskFlow/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Protected/Public routes
│   │   │   ├── layout/        # Header, Sidebar
│   │   │   ├── tasks/         # Task cards, filters, modals
│   │   │   └── ui/            # Reusable UI components
│   │   ├── context/           # Auth & Theme providers
│   │   ├── pages/             # Login, Dashboard
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   └── vercel.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Database connection
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   └── validators/        # Request validation
│   └── render.yaml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd "TaskFlow – Smart Task Management"
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env if your API URL differs
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. MongoDB setup

**Local:**
```bash
# Start MongoDB locally, then use:
MONGODB_URI=mongodb://localhost:27017/taskflow
```

**MongoDB Atlas:**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Set `MONGODB_URI` in `server/.env`

## Environment Variables

### Server (`server/.env`)

| Variable     | Description                          | Example                              |
|--------------|--------------------------------------|--------------------------------------|
| `PORT`       | Server port                          | `5000`                               |
| `MONGODB_URI`| MongoDB connection string            | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret for signing JWT tokens        | `your-secret-key`                    |
| `CLIENT_URL` | Frontend URL for CORS                | `http://localhost:5173`              |
| `NODE_ENV`   | Environment                          | `development`                        |

### Client (`client/.env`)

| Variable       | Description     | Example                      |
|----------------|-----------------|------------------------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api`  |

## API Endpoints

### Health Check

| Method | Endpoint       | Auth | Description        |
|--------|----------------|------|--------------------|
| GET    | `/api/health`  | No   | API health status  |

### Authentication

| Method | Endpoint          | Auth | Description              |
|--------|-------------------|------|--------------------------|
| POST   | `/api/auth/guest` | No   | Guest login              |
| GET    | `/api/auth/profile` | Yes | Get current user profile |

**Guest Login Request:**
```json
{
  "name": "John Doe"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "John Doe", "isGuest": true },
    "token": "eyJhbG..."
  }
}
```

### Tasks

All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/tasks`              | List tasks with filters  |
| GET    | `/api/tasks/:id`          | Get single task          |
| POST   | `/api/tasks`              | Create task              |
| PUT    | `/api/tasks/:id`          | Update task              |
| PATCH  | `/api/tasks/:id/status`   | Quick status update      |
| DELETE | `/api/tasks/:id`          | Delete task              |

**Query Parameters (GET /api/tasks):**

| Param       | Values                                          | Default     |
|-------------|-------------------------------------------------|-------------|
| `status`    | `todo`, `in_progress`, `completed`, `all`     | `all`       |
| `priority`  | `low`, `medium`, `high`                         | —           |
| `sortBy`    | `createdAt`, `dueDate`, `priority`, `title`     | `createdAt` |
| `sortOrder` | `asc`, `desc`                                   | `desc`      |
| `search`    | string                                          | —           |

**Create Task Request:**
```json
{
  "title": "Complete project",
  "description": "Finish the assessment task",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-08-20",
  "assignee": "John"
}
```

## Deployment

### Frontend – Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set **Root Directory** to `client`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`
5. Deploy

### Backend – Render

1. Push the repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `MONGODB_URI` – your MongoDB Atlas connection string
   - `JWT_SECRET` – a strong random secret
   - `CLIENT_URL` – your Vercel frontend URL
   - `NODE_ENV` – `production`
6. Deploy

Alternatively, use the included `render.yaml` for Blueprint deployment.

### Post-Deployment

1. Update `CLIENT_URL` on Render with your Vercel URL
2. Update `VITE_API_URL` on Vercel with your Render API URL
3. Redeploy both services

## Design Notes

> **Note:** The Figma design file was not directly accessible during development. The UI was built based on standard task management assessment requirements and modern design patterns.

### Implemented Screens

1. **Login Page** – Split layout with illustration panel and guest login form
2. **Dashboard** – Stats cards, task filters, task grid, sidebar navigation
3. **Task Modal** – Create/edit task form with all fields

### Design System

- **Primary Color:** Indigo (#6366F1)
- **Typography:** Inter (Google Fonts)
- **Border Radius:** 12–16px (rounded-xl/2xl)
- **Themes:** Light and dark with CSS custom properties
- **Breakpoints:** Mobile (<640px), Tablet (640–1024px), Desktop (>1024px)

### Intentional Deviations

- Used Lucide React icons instead of custom Figma icons (functionally equivalent)
- Guest login replaces email/password login (as specified in requirements)
- Task cards use a grid layout instead of a list/kanban board (adaptable based on Figma specifics)
- Illustration on login page is CSS/SVG-based rather than exported Figma assets

If you have access to the Figma file, compare and adjust colors, spacing, and component layouts to match exactly.

## License

MIT
