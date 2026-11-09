# SMARTSHELF AI: Agentic Inventory & Expiry Management System

> **Live Application URL**: [https://smartshelf-ai-live.vercel.app](https://smartshelf-ai-live.vercel.app)  
> **Backend REST API**: [https://smartshelf-ai-api.onrender.com](https://smartshelf-ai-api.onrender.com)  
> **Demo Credentials**: Email: `demo@smartshelf.ai` | Password: `demo123` (or click ⚡ **1-Click Demo Login** on screen)

---

## 🌟 Executive Overview

**SmartShelf AI** is an Agentic AI-powered household inventory and expiry management platform designed to prevent food wastage, financial loss, duplicate purchases, and accidental usage of expired medicines or cosmetics.

It combines computer vision, optical character recognition (OCR) date extraction, automated multi-field category classification, and a **7-Agent AI Engine** (Orchestrator, Scanning, Category, Inventory, Expiry Monitoring, Notification, Recommendation) to autonomously track shelf life and dispatch priority notifications.

---

## 🤖 7-Agent AI Architecture

```mermaid
graph TD
    User[User / Client UI] -->|React + Vite + Tailwind| Frontend[Frontend SPA]
    Frontend -->|JWT Auth REST APIs| Backend[Backend API Service]
    Backend -->|Mongoose Driver| DB[(MongoDB Database)]
    
    subgraph Agent Architecture
        Orchestrator[Orchestrator Agent]
        ScanAgent[Scanning Agent (OCR)]
        CatAgent[Category Agent]
        InvAgent[Inventory Agent]
        ExpAgent[Expiry Monitoring Agent]
        NotifAgent[Notification Agent]
        RecAgent[Recommendation Agent]
        
        Orchestrator --> ScanAgent
        Orchestrator --> CatAgent
        Orchestrator --> InvAgent
        Orchestrator --> ExpAgent
        Orchestrator --> NotifAgent
        Orchestrator --> RecAgent
    end
    
    Backend <--> Orchestrator
```

### Specialized Agents & Responsibilities:
1. **Scanning Agent (`SCANNING_AGENT`)**: Processes uploaded/captured images, performs noise reduction and contrast thresholding, and executes regex pattern matching for date signatures (`EXP`, `MFG`, `Best Before`, `DD/MM/YYYY`, `MM-YYYY`).
2. **Category Agent (`CATEGORY_AGENT`)**: Classifies product name and raw text into 8 core categories (`FOOD`, `MEDICINE`, `PERSONAL CARE`, `SANITARY PRODUCTS`, `CLEANING PRODUCTS`, `GROCERIES`, `BABY PRODUCTS`, `OTHER`) and subcategories, providing confidence scores and storage recommendations.
3. **Inventory Agent (`INVENTORY_AGENT`)**: Searches user inventory for duplicate/similar items and suggests updating quantities instead of creating duplicate entries.
4. **Expiry Monitoring Agent (`EXPIRY_AGENT`)**: Runs daily background scans to calculate remaining days and assign status (`SAFE`, `EXPIRING_SOON`, `URGENT`, `EXPIRES_TODAY`, `EXPIRED`).
5. **Notification Agent (`NOTIFICATION_AGENT`)**: Enforces priority rules (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) based on item category and days remaining, preventing duplicate spam.
6. **Recommendation Agent (`RECOMMENDATION_AGENT`)**: Generates recipe ideas for expiring food ingredients, pharmaceutical disposal reminders for expiring drugs, and auto-suggests replenishment items.
7. **Orchestrator Agent (`ORCHESTRATOR_AGENT`)**: Controls multi-agent pipeline routing and writes execution logs to MongoDB `agent_logs`.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios.
- **Backend API**: Node.js, Express.js, Mongoose, JWT Authentication, BCrypt.js, Multer, Node Cron.
- **Database**: MongoDB (Local, MongoDB Atlas, or MongoDB Memory Server).
- **AI / OCR Engine**: Python FastAPI / Node Regex Computer Vision Date Parser Engine.

---

## 📁 Repository Structure

```
d:\MERN STACK\Agentic\
├── client/                     # Frontend React + Vite + TypeScript application
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, MobileNav, ProductCard, ExpiryBadge, Toast
│   │   ├── context/            # AuthContext (JWT & 1-Click Demo state)
│   │   ├── pages/              # Landing, Dashboard, Scan, Inventory, Detail, Alerts, Shopping, Analytics, Chatbot, Categories, Settings
│   │   ├── services/           # Axios API client & interfaces
│   │   ├── App.tsx             # Route guards & layout
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                     # Backend REST API & 7-Agent System
│   ├── src/
│   │   ├── agents/             # Scanning, Category, Inventory, Expiry, Notification, Recommendation, Orchestrator Agents
│   │   ├── config/             # DB connection with MongoDB fallback
│   │   ├── controllers/        # Auth, Product, AI Scan, Category, Expiry, Notification, Shopping, Analytics, Chatbot Controllers
│   │   ├── middleware/         # JWT protection & user isolation middleware
│   │   ├── models/             # Mongoose schemas (User, Product, Category, StorageLocation, Notification, AgentLog, ShoppingListItem)
│   │   ├── routes/             # Express API route modules
│   │   ├── services/           # Seed service & background cron scheduler
│   │   └── index.js            # Express server entry point
│   └── package.json
├── ai_service/                 # Python FastAPI OCR Service
│   ├── main.py
│   └── requirements.txt
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smartshelf_ai
JWT_SECRET=smartshelf_jwt_secret_key_2026_super_secure
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run Locally

### 1. Start Backend Server:
```bash
cd server
npm install
npm run dev
```

### 2. Start Frontend SPA:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 API Endpoints Overview

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Products**: `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `POST /api/products/:id/mark-used`
- **AI Scan**: `POST /api/ai/scan-product` (multipart image upload)
- **Expiry Agent**: `GET /api/expiry/urgent`, `GET /api/expiry/expiring-soon`, `POST /api/agents/expiry/run`
- **Analytics**: `GET /api/analytics/dashboard`, `GET /api/analytics/categories`, `GET /api/analytics/monthly`
- **Chatbot**: `POST /api/chat`
- **Shopping List**: `GET /api/shopping-list`, `POST /api/shopping-list`, `PUT /api/shopping-list/:id`
