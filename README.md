# 🚀 Nexus – Full Stack Insights Management Platform

![Nexus](https://img.shields.io/badge/Frontend-React-blue)
![Nexus](https://img.shields.io/badge/Backend-NestJS-red)
![Nexus](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Nexus](https://img.shields.io/badge/Hosted%20on-Vercel-black)
![Nexus](https://img.shields.io/badge/API%20Hosted%20on-Render-green)

> A modern, full-stack web app to create, manage, and share insights securely and efficiently.  
> Built with **NestJS**, **React (Vite)**, and **PostgreSQL**.

---

## 🧩 Tech Stack

**Frontend**
- React (Vite) ⚡  
- Bootstrap / Custom CSS 🎨  
- Axios for API Calls  

**Backend**
- NestJS (TypeScript) 🔥  
- PostgreSQL (Render Cloud) 🐘  
- TypeORM ORM  
- JWT + Bcrypt for Authentication 🔒  

**Hosting**
- Frontend → [Vercel](https://nexus-m766.vercel.app)  
- Backend → Render (NestJS + PostgreSQL)

---

## ✨ Features

✅ User Authentication (JWT)  
✅ CRUD Operations for Insights  
✅ Search & Filter Insights  
✅ Responsive & Modern UI (Bootstrap)  
✅ Secure Password Hashing  
✅ User Profile Management  

---

## 🗂️ Project Structure

Nexus/
├── backend/
│ └── backend-app/
│ ├── src/
│ │ ├── auth/ # JWT Authentication
│ │ ├── users/ # User module
│ │ ├── insights/ # CRUD for insights
│ │ └── main.ts # Entry point
│ └── schema.sql # DB Schema
├── frontend/
│ └── nexus-frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── services/
│ └── public/
└── README.md


---

## ⚙️ Local Setup Guide

### 🗃️ 1. Clone the Repository
```bash
git clone https://github.com/Asad-ullah1/Nexus.git
cd Nexus

🛠️ 2. Backend Setup
cd backend/backend-app
npm install
npm run start:dev

Backend runs at http://localhost:3000

💻 3. Frontend Setup
cd frontend/nexus-frontend
npm install
npm run dev
Frontend runs at http://localhost:5173

🌐 Live Demo
🖥️ Frontend: https://nexus-m766.vercel.app

⚙️ Backend API: (Render deployed)
https://nexus-backend.onrender.com

🧑‍💻 Developer Info
👤 Name: Asad Ullah
💼 Role: Full Stack Developer (React + NestJS + PostgreSQL)
🌐 GitHub: Asad-ullah1
📧 Email: ak659277@example.com 

💡 Future Improvements
🔹 Add Admin Dashboard
🔹 Dark / Light Theme Support
🔹 Deploy Backend with CI/CD on Render
🔹 Add Analytics Page

