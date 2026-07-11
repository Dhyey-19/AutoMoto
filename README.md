# AutoMoto

AutoMoto is a production-ready boilerplate for a full-stack Car Dealership Inventory System. It demonstrates professional backend architecture, clean coding practices, REST API development, scalable folder organization, and modern frontend development.

## Architecture

This is a monorepo containing two independent projects:
- **Backend**: Node.js, Express.js, MS SQL Server (Azure SQL)
- **Frontend**: Next.js (App Router), React, Tailwind CSS

The backend follows Clean Architecture principles with separation of concerns:
- `controllers`: Handle HTTP requests and responses.
- `services`: Business logic (to be added as features grow).
- `models`: Database models/queries.
- `middlewares`: Request validation, error handling, security, etc.
- `database`: Database connection and pooling.
- `utils`: Reusable helper functions and classes.

## Folder Structure

```text
AutoMoto/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # Environment variables and config
│   │   ├── constants/        # System constants
│   │   ├── controllers/      # Route controllers
│   │   ├── database/         # MSSQL connection
│   │   ├── middlewares/      # Express middlewares
│   │   ├── models/           # Data models
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # API routing
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utilities (logger, errors)
│   │   └── validators/       # Zod schemas
│   ├── tests/                # Jest and Supertest test files
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
└── frontend/                 # Next.js Application
    ├── app/                  # Next.js App Router pages
    ├── components/           # Reusable UI components
    ├── hooks/                # Custom React hooks
    ├── lib/                  # Library configurations
    ├── providers/            # Context providers (e.g., React Query)
    ├── services/             # API services (Axios)
    └── styles/               # Global styles (Tailwind)
```

## Installation

1. **Clone the repository** (if not already done).
2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
DB_SERVER=your_db_server.database.windows.net
DB_DATABASE=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

### Frontend (`frontend/.env.local`)

Create a `.env.local` file in the `frontend` directory with the following variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

## Running the Application

### Backend

To start the backend in development mode (using nodemon):

```bash
cd backend
npm run dev
```

### Frontend

To start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Running Tests

### Backend

Tests are written using Jest and Supertest.

```bash
cd backend
npm test
```

## API Documentation

### Health Check

**GET /api/health**

Checks if the server is running and the database connection is established.

**Success Response:**
- **Code:** 200 OK
- **Content:**
  ```json
  {
    "success": true,
    "status": "UP",
    "database": "CONNECTED",
    "environment": "development",
    "uptime": 100,
    "timestamp": "2026-07-10T10:00:00Z"
  }
  ```

**Database Disconnected Response:**
- **Code:** 503 Service Unavailable
- **Content:**
  ```json
  {
    "success": false,
    "status": "DOWN",
    "database": "DISCONNECTED"
  }
  ```
