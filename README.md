# 🚛 TuckTruck - Commercial Vehicle Booking Platform

> **A complete, production-ready logistics booking platform built with Spring Boot, React, and Socket.IO**

## 📚 Documentation

For complete documentation including setup instructions, API reference, testing guide, and deployment instructions, please see:

**[📖 TUCKTRUCK_DOCUMENTATION.md](./TUCKTRUCK_DOCUMENTATION.md)**

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.6+
- Node.js 18+
- MySQL 8.0+

### Installation
```bash
# 1. Setup database
CREATE DATABASE tucktruck;

# 2. Install backend dependencies
cd backend
mvn clean install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Install socket server dependencies
cd ../socket-server
npm install
```

### Running the Application
```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Socket Server
cd socket-server
npm start

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

Access the application at: **http://localhost:5173**

## ✨ Key Features

- 🔐 Multi-role authentication (Customer, Driver, Admin)
- 🗺️ Real-time tracking with OpenStreetMap
- 📱 Mobile-responsive modern UI
- ⚡ Live updates via Socket.IO
- 💳 Complete booking lifecycle management
- 📊 Admin dashboard with analytics

## 🛠 Tech Stack

- **Backend**: Spring Boot 3.3.0, MySQL, Spring Security
- **Frontend**: React 18, Vite, TypeScript, Leaflet
- **Real-time**: Socket.IO, Express.js

## 📖 Full Documentation

See [TUCKTRUCK_DOCUMENTATION.md](./TUCKTRUCK_DOCUMENTATION.md) for:
- Detailed setup instructions
- API documentation
- Testing guide
- Database schema
- Deployment guide
- Troubleshooting

---

**Built with ❤️ for efficient logistics management**
