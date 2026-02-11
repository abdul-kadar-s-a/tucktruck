# 🚛 TuckTruck - Commercial Vehicle Booking Platform

> **A complete, production-ready logistics booking platform built with Spring Boot, React, and Socket.IO**

TuckTruck is a full-stack real-time logistics booking platform similar to Porter or Uber Freight. It enables customers to book commercial vehicles, drivers to accept and manage trips, and administrators to oversee the entire operation with live tracking and analytics.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [How to Run](#-how-to-run)
- [How to Test](#-how-to-test)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles & Capabilities](#-user-roles--capabilities)
- [Database Schema](#-database-schema)
- [Real-Time Features](#-real-time-features)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎯 Core Features
- **Multi-Role Authentication**: Separate login/signup for Customers, Drivers, and Admins
- **Real-Time Tracking**: Live location updates using Socket.IO and OpenStreetMap
- **Booking Lifecycle Management**: Complete flow from booking to delivery
- **Interactive Maps**: Leaflet-based maps with Tamil Nadu routes
- **Responsive Design**: Mobile-first, modern UI with glassmorphism effects
- **Secure Authentication**: Spring Security with role-based access control
- **Persistent Storage**: MySQL database with JPA/Hibernate

### 👤 Customer Features
- Book commercial vehicles (Mini, Tata Ace, Pickup, Truck)
- Real-time price calculation based on distance
- Live tracking of assigned driver
- Booking history and status updates
- Profile management
- Cancel bookings

### 🚗 Driver Features
- Online/Offline status toggle
- Accept/Reject booking requests
- Multi-stage trip workflow (Reaching Pickup → At Pickup → Picked Up → In Transit → At Dropoff → Delivered)
- Earnings tracking
- Trip history
- Profile management with vehicle details

### 👨‍💼 Admin Features
- Real-time dashboard with analytics
- Monitor all active bookings
- View driver statuses (Online/Offline/Busy)
- Booking management (view, update, cancel)
- Driver management
- Revenue analytics
- System-wide statistics

---

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Styling**: Custom CSS with modern design patterns
- **Maps**: Leaflet + React Leaflet
- **Animations**: Framer Motion
- **State Management**: React Context API

### Real-Time Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **WebSocket**: Socket.IO 4.8.3
- **CORS**: Enabled for cross-origin requests

---

## 🏗 System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Socket.IO      │         │  Spring Boot    │
│  (Port 5173)    │         │  Server         │◄───────►│  Backend        │
│                 │         │  (Port 3001)    │         │  (Port 8080)    │
└─────────────────┘         └─────────────────┘         └────────┬────────┘
                                                                  │
                                                                  │
                                                         ┌────────▼────────┐
                                                         │                 │
                                                         │  MySQL Database │
                                                         │  (Port 3306)    │
                                                         │                 │
                                                         └─────────────────┘
```

### Communication Flow
1. **Frontend ↔ Backend**: REST API calls for authentication, CRUD operations
2. **Frontend ↔ Socket Server**: Real-time updates for location, status changes
3. **Backend ↔ Database**: Data persistence and retrieval

---

## 📦 Prerequisites

Before running TuckTruck, ensure you have the following installed:

### Required Software
- **Java Development Kit (JDK) 21** or higher
  - Download: https://www.oracle.com/java/technologies/downloads/
  - Verify: `java -version`

- **Maven 3.6+**
  - Download: https://maven.apache.org/download.cgi
  - Verify: `mvn -version`

- **Node.js 18+** and npm
  - Download: https://nodejs.org/
  - Verify: `node -v` and `npm -v`

- **MySQL 8.0+**
  - Download: https://dev.mysql.com/downloads/mysql/
  - Verify: `mysql --version`

### Optional Tools
- **Git**: For version control
- **Postman**: For API testing
- **MySQL Workbench**: For database management

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tucktruck
```

### 2. Database Setup

#### Create Database
```sql
CREATE DATABASE tucktruck;
```

#### Update Database Credentials
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tucktruck
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

> **Note**: The application will automatically create tables on first run using Hibernate DDL auto-update.

### 3. Backend Setup
```bash
cd backend
mvn clean install
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Socket Server Setup
```bash
cd socket-server
npm install
```

---

## ▶️ How to Run

You need to run **three separate services** in different terminals:

### Terminal 1: Start MySQL Database
```bash
# Ensure MySQL service is running
# Windows: Check Services or run:
net start MySQL80

# Linux/Mac:
sudo systemctl start mysql
```

### Terminal 2: Start Backend Server
```bash
cd backend
mvn spring-boot:run
```
✅ Backend will start on **http://localhost:8080**

### Terminal 3: Start Socket.IO Server
```bash
cd socket-server
npm start
```
✅ Socket server will start on **http://localhost:3001**

### Terminal 4: Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend will start on **http://localhost:5173**

### Access the Application
Open your browser and navigate to: **http://localhost:5173**

---

## 🧪 How to Test

### 1. Manual Testing Flow

#### Test Customer Flow
1. **Sign Up as Customer**
   - Go to http://localhost:5173
   - Click "Get Started" → "Sign Up"
   - Select "Customer" role
   - Fill in details and submit

2. **Book a Vehicle**
   - Login with customer credentials
   - Click "Book Vehicle"
   - Enter pickup and dropoff locations
   - Select vehicle type
   - Confirm booking

3. **Track Booking**
   - View real-time driver location on map
   - Monitor booking status updates

#### Test Driver Flow
1. **Sign Up as Driver**
   - Go to http://localhost:5173
   - Click "Get Started" → "Sign Up"
   - Select "Driver" role
   - Upload vehicle documents
   - Fill in vehicle details

2. **Accept Booking**
   - Login with driver credentials
   - Toggle status to "Online"
   - Wait for booking notification
   - Accept booking request

3. **Complete Trip**
   - Click "Reaching Pickup"
   - Click "At Pickup"
   - Click "Picked Up"
   - Click "In Transit"
   - Click "At Dropoff"
   - Click "Delivered"
   - Click "Complete Trip"

#### Test Admin Flow
1. **Login as Admin**
   - Use admin credentials (create via database or signup)
   - View dashboard with real-time statistics

2. **Monitor Operations**
   - View all active bookings
   - Monitor driver statuses
   - Check revenue analytics

### 2. API Testing with Postman

#### Authentication Endpoints
```
POST http://localhost:8080/api/auth/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "CUSTOMER"
}

POST http://localhost:8080/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

#### Booking Endpoints
```
POST http://localhost:8080/api/bookings
Headers: Authorization: Bearer <token>
Body: {
  "pickupLocation": "Chennai Central",
  "dropoffLocation": "Coimbatore",
  "vehicleType": "MINI",
  "distance": 500
}

GET http://localhost:8080/api/bookings/user/{userId}
Headers: Authorization: Bearer <token>
```

### 3. Database Testing

#### Verify Tables Created
```sql
USE tucktruck;
SHOW TABLES;
-- Should show: users, bookings, locations
```

#### Check User Registration
```sql
SELECT * FROM users;
```

#### Check Bookings
```sql
SELECT * FROM bookings;
```

### 4. Real-Time Testing

#### Test Socket.IO Connection
Open browser console on http://localhost:5173 and check for:
```
Socket connected: <socket-id>
```

#### Test Real-Time Updates
1. Open admin dashboard in one browser
2. Open driver dashboard in another browser
3. Toggle driver online/offline status
4. Verify admin dashboard updates in real-time

---

## 📁 Project Structure

```
tucktruck/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tucktruck/backend/
│   │   │   │   ├── BackendApplication.java
│   │   │   │   ├── config/           # Security, CORS configuration
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   │   ├── AdminController.java
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── BookingController.java
│   │   │   │   │   └── DriverController.java
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   │   ├── Booking.java
│   │   │   │   │   ├── BookingStatus.java
│   │   │   │   │   ├── Location.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── repository/       # JPA Repositories
│   │   │   │   └── service/          # Business Logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                     # Unit tests
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                # Admin dashboard components
│   │   │   ├── auth/                 # Login/Signup components
│   │   │   ├── customer/             # Customer booking components
│   │   │   ├── driver/               # Driver trip management
│   │   │   ├── shared/               # Shared components (Map, Navbar)
│   │   │   └── ui/                   # Reusable UI components
│   │   ├── contexts/                 # React Context (Auth, Socket)
│   │   ├── services/                 # API service layer
│   │   ├── utils/                    # Utility functions
│   │   ├── App.tsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   └── main.tsx                  # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── socket-server/                    # Socket.IO Server
│   ├── server.js                     # WebSocket server
│   └── package.json
│
├── render.yaml                       # Deployment configuration
└── TUCKTRUCK_DOCUMENTATION.md        # This file
```

---

## 🔌 API Documentation

### Authentication APIs

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

Request Body:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "role": "CUSTOMER | DRIVER | ADMIN",
  "vehicleType": "string (required for DRIVER)",
  "vehicleNumber": "string (required for DRIVER)"
}

Response: 200 OK
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",
  "password": "string"
}

Response: 200 OK
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

### Booking APIs

#### Create Booking
```
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "pickupLocation": "string",
  "dropoffLocation": "string",
  "vehicleType": "MINI | TATA_ACE | PICKUP | TRUCK",
  "distance": "number",
  "estimatedPrice": "number"
}

Response: 201 Created
{
  "id": "number",
  "status": "PENDING",
  "pickupLocation": "string",
  "dropoffLocation": "string",
  ...
}
```

#### Get User Bookings
```
GET /api/bookings/user/{userId}
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "number",
    "status": "string",
    "pickupLocation": "string",
    ...
  }
]
```

#### Update Booking Status
```
PUT /api/bookings/{bookingId}/status
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "status": "ASSIGNED | IN_TRANSIT | COMPLETED | CANCELLED"
}

Response: 200 OK
```

### Driver APIs

#### Get Available Drivers
```
GET /api/drivers/available
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "number",
    "name": "string",
    "vehicleType": "string",
    "isOnline": "boolean"
  }
]
```

#### Update Driver Status
```
PUT /api/drivers/{driverId}/status
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "isOnline": "boolean"
}

Response: 200 OK
```

### Admin APIs

#### Get All Bookings
```
GET /api/admin/bookings
Authorization: Bearer <token>

Response: 200 OK
[...]
```

#### Get Dashboard Stats
```
GET /api/admin/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "totalBookings": "number",
  "activeBookings": "number",
  "totalDrivers": "number",
  "onlineDrivers": "number",
  "totalRevenue": "number"
}
```

---

## 👥 User Roles & Capabilities

### 🛒 Customer
**What You Can Do:**
- Create account and login
- Book commercial vehicles for goods transportation
- View real-time pricing based on distance
- Track driver location in real-time
- View booking history
- Cancel bookings
- Update profile information
- View trip details and receipts

**Booking Flow:**
1. Enter pickup location
2. Enter dropoff location
3. Select vehicle type (Mini/Tata Ace/Pickup/Truck)
4. View calculated price
5. Confirm booking
6. Track driver in real-time
7. Receive delivery confirmation

### 🚗 Driver
**What You Can Do:**
- Create driver account with vehicle details
- Toggle online/offline status
- Receive booking notifications
- Accept or reject booking requests
- Navigate through trip stages:
  - Reaching Pickup
  - At Pickup
  - Picked Up (goods loaded)
  - In Transit
  - At Dropoff
  - Delivered
- View earnings and trip history
- Update vehicle and profile information
- View customer contact details

**Trip Workflow:**
1. Go online to receive bookings
2. Accept incoming booking
3. Navigate to pickup location
4. Update status at each stage
5. Complete delivery
6. Receive payment confirmation

### 👨‍💼 Admin
**What You Can Do:**
- Monitor entire platform in real-time
- View dashboard with key metrics:
  - Total bookings (today, this week, all-time)
  - Active bookings
  - Driver statistics (online/offline/busy)
  - Revenue analytics
- Manage all bookings:
  - View details
  - Update status
  - Cancel if needed
- Manage drivers:
  - View all drivers
  - Monitor online status
  - View trip history
- Generate reports
- System-wide oversight

**Dashboard Metrics:**
- Real-time booking count
- Active drivers count
- Today's revenue
- Booking status distribution
- Driver availability

---

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'DRIVER', 'ADMIN') NOT NULL,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    is_online BOOLEAN DEFAULT FALSE,
    license_image VARCHAR(500),
    rc_image VARCHAR(500),
    vehicle_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_location VARCHAR(500) NOT NULL,
    dropoff_location VARCHAR(500) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    distance DOUBLE,
    estimated_price DOUBLE,
    final_price DOUBLE,
    status ENUM('PENDING', 'ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (driver_id) REFERENCES users(id)
);
```

### Locations Table
```sql
CREATE TABLE locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

---

## ⚡ Real-Time Features

### Socket.IO Events

#### Client → Server Events
```javascript
// Driver goes online/offline
socket.emit('driver:statusChanged', {
  driverId: number,
  isOnline: boolean
});

// Location update
socket.emit('location:update', {
  bookingId: number,
  latitude: number,
  longitude: number
});

// Booking status change
socket.emit('booking:statusChanged', {
  bookingId: number,
  status: string
});
```

#### Server → Client Events
```javascript
// Listen for driver status changes (Admin)
socket.on('driver:statusChanged', (data) => {
  // Update UI with new driver status
});

// Listen for location updates (Customer)
socket.on('location:update', (data) => {
  // Update map with new driver location
});

// Listen for booking updates
socket.on('booking:statusChanged', (data) => {
  // Update booking status in UI
});
```

### Real-Time Use Cases
1. **Live Driver Tracking**: Customers see driver's real-time location on map
2. **Status Updates**: All parties notified when booking status changes
3. **Driver Availability**: Admin dashboard shows live driver online/offline status
4. **Instant Notifications**: Drivers receive booking requests immediately
5. **Dashboard Analytics**: Admin sees real-time booking and revenue updates

---

## 🚀 Deployment

### Deploying to Render.com

The project includes a `render.yaml` configuration for easy deployment.

#### Prerequisites
- Render.com account
- MySQL database (can use Render's managed database)

#### Steps
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Render Services**
   - Go to Render Dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Configure Environment Variables**
   Set these in Render dashboard:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://<host>:<port>/tucktruck
   SPRING_DATASOURCE_USERNAME=<username>
   SPRING_DATASOURCE_PASSWORD=<password>
   ```

4. **Deploy Frontend Separately**
   - Create new "Static Site"
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Deploy Socket Server**
   - Create new "Web Service"
   - Build command: `npm install`
   - Start command: `npm start`

### Environment-Specific Configuration

#### Production (`application-prod.properties`)
```properties
server.port=${SERVER_PORT:10000}
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Won't Start
**Error**: `Could not find goal 'ru' in plugin`
**Solution**: Use correct Maven command:
```bash
mvn spring-boot:run
# NOT: mvn spring-boot:ru
```

#### 2. Database Connection Failed
**Error**: `Communications link failure`
**Solutions**:
- Verify MySQL is running: `net start MySQL80` (Windows)
- Check credentials in `application.properties`
- Ensure database `tucktruck` exists
- Verify port 3306 is not blocked

#### 3. Frontend Can't Connect to Backend
**Error**: `Network Error` or `CORS Error`
**Solutions**:
- Ensure backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Verify API base URL in frontend config

#### 4. Socket.IO Not Connecting
**Error**: `Socket connection failed`
**Solutions**:
- Ensure socket server is running on port 3001
- Check CORS settings in `server.js`
- Verify frontend socket URL configuration

#### 5. Maps Not Loading
**Error**: Blank map or tiles not loading
**Solutions**:
- Check internet connection (OSM tiles load from internet)
- Verify Leaflet CSS is imported
- Check browser console for errors

#### 6. Port Already in Use
**Error**: `Port 8080 is already in use`
**Solutions**:
```bash
# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Debug Mode

#### Enable Backend Debug Logging
Add to `application.properties`:
```properties
logging.level.com.tucktruck=DEBUG
logging.level.org.springframework.web=DEBUG
```

#### Enable Frontend Debug
Open browser console (F12) to see:
- API requests/responses
- Socket.IO events
- React component errors

---

## 📞 Support & Contact

For issues, questions, or contributions:
- **Issues**: Create an issue on GitHub
- **Email**: [Your contact email]
- **Documentation**: This file

---

## 📄 License

[Specify your license here]

---

## 🙏 Acknowledgments

- **Spring Boot**: Backend framework
- **React**: Frontend library
- **Socket.IO**: Real-time communication
- **Leaflet**: Interactive maps
- **OpenStreetMap**: Map tiles
- **Radix UI**: UI components

---

## 📊 Project Statistics

- **Total Lines of Code**: ~15,000+
- **Backend Endpoints**: 20+
- **Frontend Components**: 50+
- **Database Tables**: 3
- **Real-Time Events**: 10+
- **Supported Vehicle Types**: 4
- **User Roles**: 3

---

**Built with ❤️ for efficient logistics management**

*Last Updated: February 2026*
