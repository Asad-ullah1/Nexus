# Nexus Frontend - Local Development

React + Vite frontend for the Nexus insights management platform, configured for localhost development.

## Features
- 🔐 User Authentication (Login/Signup)
- 📝 Create, Read, Update, Delete insights
- 🔍 Search functionality
- 👤 User profile management
- 📱 Responsive design with Bootstrap

## Prerequisites
- Node.js (v16 or higher)
- Backend server running on `http://localhost:3000`

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will run on `http://localhost:5173`

## API Configuration
The frontend is configured to connect to the local backend at `http://localhost:3000`.

## Project Structure
```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── InsightForm.jsx
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── ...
├── context/            # React context
│   └── AuthContext.jsx
├── services/           # API services
├── config/             # Configuration files
└── lib/                # Utility libraries
```
