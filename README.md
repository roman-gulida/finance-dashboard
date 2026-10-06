# Finance Dashboard

A full-stack web application designed for personal finance management. It allows users to track income and expenses, set monthly spending limits across various categories, and view overall budget statistics on an interactive dashboard.

The project is structured as an npm workspace monorepo, containing a React frontend and an Express backend.

## Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- React Query for data fetching
- React Router for navigation
- Recharts for data visualization

**Backend:**
- Node.js & Express (v5)
- TypeScript
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v22+) if running locally

### Running with Docker (Recommended)

1. Clone the repository.
2. Start the application stack:
   ```bash
   docker compose up --build -d
   ```
3. Run the seed script to populate the database with initial data (only required once):
   ```bash
   docker compose run --rm seed
   ```
4. Access the frontend at `http://localhost:5173`

### Default Credentials
- **Username:** `user`
- **Password:** `1!Qwerty`

### Running Locally (Without Docker)

1. Start a local MongoDB instance.
2. Install dependencies for both client and server from the root directory:
   ```bash
   npm install
   ```
3. Seed the database (only required once):
   ```bash
   npm run seed --workspace=server
   ```
4. Start both development servers concurrently:
   ```bash
   npm run dev
   ```

## API Overview

All routes except authentication require a valid JWT passed in the `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and receive token
- `GET /api/auth/me` - Validate session and get current user data

### Transactions
- `GET /api/transactions` - List all transactions for the user
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update an existing transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Category Budgets
- `GET /api/category-budgets` - List all category-specific budgets
- `POST /api/category-budgets` - Create a category budget
- `PUT /api/category-budgets/:id` - Update a category budget
- `DELETE /api/category-budgets/:id` - Delete a category budget

### General Budgets
- `GET /api/general-budgets?month=YYYY-MM` - Get overall budget configuration for a specific month
- `POST /api/general-budgets` - Create a general budget
- `PUT /api/general-budgets/:id` - Update a general budget
- `DELETE /api/general-budgets/:id` - Delete a general budget
