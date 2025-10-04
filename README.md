# 📌 Nexus – Full-Stack Insights Management Platform  

## 🚀 Project Overview  
**Nexus** is a full-stack web application that helps users **create, manage, and share insights** in a community-driven way.  
It features secure authentication, CRUD operations, and a modern frontend for a seamless user experience.  

**🏠 Local Development Project** - This is configured for localhost development only.

---

## 🛠️ Tech Stack  
### Backend  
- **NestJS** (TypeScript) – REST API  
- **PostgreSQL** – Database  
- **TypeORM** – ORM  
- **JWT + bcrypt** – Authentication & Security  

### Frontend  
- **React (Vite)** – User Interface  
- **Bootstrap** – Styling  
- **Axios / Fetch API** – API communication  

---

## ✨ Features  
✅ User Authentication (Sign up / Login with JWT)  
✅ Create, Read, Update, Delete (CRUD) insights  
✅ Search functionality  
✅ User Profile Management  
✅ Responsive UI with modern styling  

---

## 🔧 Local Development Setup  

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Clone the repo  
```bash
git clone https://github.com/Asad-ullah1/Nexus.git
cd Nexus
```

### Database Setup
1. **Install PostgreSQL** on your local machine
2. **Create a database** named `nexusdb`
3. **Update database credentials** in `backend/backend-app/Setup.env`:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_password_here
   DATABASE_NAME=nexusdb
   ```
4. **Run the database schema**:
   ```bash
   # Connect to your PostgreSQL database and run:
   psql -U postgres -d nexusdb -f backend/backend-app/schema.sql
   ```

### Backend Setup
```bash
cd backend/backend-app
npm install
npm run start:dev
```
The backend will run on `http://localhost:3000`

### Frontend Setup
```bash
cd frontend/nexus-frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

---

## 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000 (when running)

---

## 🗂️ Project Structure
```
Nexus/
├── backend/
│   └── backend-app/          # NestJS Backend
│       ├── src/
│       │   ├── auth/         # Authentication module
│       │   ├── users/        # User management
│       │   ├── insights/     # Insights CRUD
│       │   └── main.ts       # Application entry point
│       └── schema.sql        # Database schema
├── frontend/
│   └── nexus-frontend/       # React Frontend
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── pages/        # Page components
│       │   ├── context/      # React context
│       │   └── services/     # API services
│       └── public/           # Static assets
└── README.md
