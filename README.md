# AutoMoto - Premium Car Dealership Inventory System

AutoMoto is a production-ready, full-stack Car Dealership Inventory System. It demonstrates professional backend architecture, clean coding practices, RESTful API development, scalable folder organization, and modern frontend Progressive Web App (PWA) development.

🚀 **Live Demo:** [https://automoto.azurewebsites.net/](https://automoto.azurewebsites.net/)

**Admin Login:** [Email: dhyeyshah009@gmail.com] [Password : 190426]

**User Login:** [Email: test@gmail.com] [Password : 190426]

## Project Explanation

The AutoMoto platform is designed to handle the core operations of a premium car dealership. It features a complete authentication system with Role-Based Access Control (RBAC), allowing standard users to browse the catalog and purchase vehicles, while granting Administrators exclusive access to inventory management, deep analytics, business insights, and system configuration. 

## Tech Stack & Highlights

This project was built to demonstrate enterprise-level full-stack capabilities, leveraging modern cloud infrastructure and advanced web technologies:

- **Cloud Infrastructure & Deployment:** 
  - Hosted on **Azure App Service** (Azure Web App) running a consolidated Node.js environment.
  - Relational Data powered by a live **Azure SQL Database Server**.
  - Automated **CI/CD Pipeline** directly integrated via GitHub Deployment Center for seamless updates.
- **Progressive Web App (PWA):** 
  - Fully configured with manifest and service workers for native-like installation across **Windows, iOS, and Android**.
  - Includes offline asset caching and custom brand theming for a premium mobile experience.
- **Backend Architecture:**
  - Robust **Node.js & Express.js** RESTful API utilizing strict Clean Architecture and Repository Patterns.
  - High-security token-based Authentication (JWT) and Role-Based Access Control (RBAC).
- **Frontend Mastery:**
  - Built with **Next.js (App Router)** and **React 19** for optimized Server-Side Rendering (SSR) and Client-Side dynamic states.
  - Immersive UX designed with **Tailwind CSS**, featuring custom micro-animations, layout persistence, and responsive glassmorphism.

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- SQL Server (or Azure SQL Database)

### 1. Database Setup
Create an MS SQL Database and execute the initial schema scripts (if any) or rely on manual table creations per the project DB design. 

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
DB_SERVER=your_db_server.database.windows.net
DB_DATABASE=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend server:
```bash
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Screenshots

<div align="center">
  <img src="./assets/image%20(1).png" width="48%" />
  <img src="./assets/image%20(2).png" width="48%" />
  <img src="./assets/image%20(3).png" width="48%" />
  <img src="./assets/image%20(4).png" width="48%" />
  <img src="./assets/image%20(5).png" width="48%" />
  <img src="./assets/image%20(6).png" width="48%" />
  <img src="./assets/image%20(7).png" width="48%" />
  <img src="./assets/image%20(8).png" width="48%" />
  <img src="./assets/image%20(9).png" width="48%" />
  <img src="./assets/image%20(10).png" width="48%" />
  <img src="./assets/image%20(11).png" width="48%" />
  <img src="./assets/image%20(12).png" width="48%" />
  <img src="./assets/image%20(13).png" width="48%" />
  <img src="./assets/image%20(14).png" width="48%" />
  <img src="./assets/image%20(15).png" width="48%" />
  <img src="./assets/image%20(16).png" width="48%" />
  <img src="./assets/image%20(17).png" width="48%" />
</div>

## My AI Usage

**Tools Used:** 
- **ChatGPT**
- **Gemini Pro 3.1**
- **Gemini IDE Assistant**

**How I Used Them:**
- **Database & Architecture:** I manually created the database design and verified the schema and relationships with ChatGPT before starting the actual coding phase.
- **Backend Setup & Boilerplate:** I provided the folder structure pattern I wanted, and used AI to generate the initial boilerplate code automatically.
- **Core API Development:** I wrote the routes, controllers, and service logic manually, while actively consulting ChatGPT for syntax references, best practices, and code structure. 
- **Refactoring & Debugging:** I utilized Gemini to refactor my backend code, ensuring there were no ambiguities, handling edge cases, and uncovering potential bugs before they occurred in runtime.
- **Frontend UI & Design:** The UI design and visual logic were entirely AI-generated and heavily referred from premium Dribbble designs. I manually conceptualized, thought through, and directed the design of each corner of the webapp to ensure it met high-quality, modern UX standards.

**Reflection:**
Using AI significantly accelerated my workflow, allowing me to focus on high-level architecture and custom business logic rather than getting bogged down in boilerplate setup and CSS syntax. It acted as an incredibly effective pair-programmer, especially for validating my database architecture early on and helping me achieve a stunning frontend design that would typically take days to build from scratch.

## Test Report

Tests are written using Jest and Supertest.

```text
> automoto-backend@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js

PASS tests/vehicle.test.js
GET /api/vehicles 200 13.307 ms - 60
GET /api/vehicles/search?make=Honda 200 1.150 ms - 26
POST /api/vehicles 201 2.026 ms - 42
POST /api/vehicles 403 0.860 ms - 58
PUT /api/vehicles/v1 200 1.097 ms - 42
DELETE /api/vehicles/v1 200 0.961 ms - 57
POST /api/vehicles/v1/purchase 201 0.884 ms - 90
POST /api/vehicles/v1/restock 201 0.940 ms - 90

PASS tests/auth.test.js
POST /api/auth/register 201 70.861 ms - 269
POST /api/auth/register 400 1.032 ms - 65
POST /api/auth/login 200 59.533 ms - 273

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        2.948 s, estimated 4 s
Ran all test suites.
```
