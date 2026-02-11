const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

/* ---------------- USERS STORAGE ---------------- */

let drivers = {};
let customers = {};
let admins = {};

io.on("connection", (socket) => {
    console.log("✅ Client Connected:", socket.id);

    /* ---------- USER REGISTER ---------- */

    socket.on("REGISTER_USER", (data) => {
        console.log("📝 REGISTER:", data);

        if (data.role === "driver") drivers[socket.id] = socket;
        if (data.role === "customer") customers[socket.id] = socket;
        if (data.role === "admin") admins[socket.id] = socket;
    });

    /* ---------- BOOKING CREATED ---------- */

    socket.on("createBooking", (booking) => {
        console.log("📦 New Booking:", booking);

        // notify all drivers
        Object.values(drivers).forEach(driverSocket => {
            driverSocket.emit("newBookingRequest", booking);
        });

        // notify admin
        Object.values(admins).forEach(adminSocket => {
            adminSocket.emit("newBookingAlert", booking);
        });
    });

    /* ---------- DRIVER ACCEPT ---------- */

    socket.on("bookingAccepted", (data) => {
        console.log("✅ Driver accepted booking:", data);

        // notify all customers
        Object.values(customers).forEach(cust => {
            cust.emit("bookingAccepted", data);
        });

        // notify admin
        Object.values(admins).forEach(admin => {
            admin.emit("bookingStatusUpdate", data);
        });
    });

    /* ---------- DRIVER LOCATION ---------- */

    socket.on("driverLocationUpdate", (location) => {
        console.log("📍 Driver location:", location.lat, location.lng);

        // send to customers
        Object.values(customers).forEach(cust => {
            cust.emit("driverLocationUpdate", location);
        });

        // send to admin
        Object.values(admins).forEach(admin => {
            admin.emit("driverLocationUpdate", location);
        });
    });

    /* ---------- DRIVER ONLINE/OFFLINE ---------- */

    socket.on("driverOnline", (data) => {
        console.log("🚗 Driver went ONLINE:", data.driverName);

        // notify admin
        Object.values(admins).forEach(admin => {
            admin.emit("driverStatusChanged", { ...data, status: 'online' });
        });
    });

    socket.on("driverOffline", (data) => {
        console.log("🚫 Driver went OFFLINE:", data.driverId);

        // notify admin
        Object.values(admins).forEach(admin => {
            admin.emit("driverStatusChanged", { ...data, status: 'offline' });
        });
    });

    /* ---------- BOOKING STATUS UPDATES ---------- */

    socket.on("bookingStatusUpdate", (data) => {
        console.log("🚀 Booking status update:", data.status);

        // broadcast to all
        Object.values(customers).forEach(cust => {
            cust.emit("bookingStatusUpdate", data);
        });

        Object.values(admins).forEach(admin => {
            admin.emit("bookingStatusUpdate", data);
        });
    });

    /* ---------- DISCONNECT ---------- */

    socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
        delete drivers[socket.id];
        delete customers[socket.id];
        delete admins[socket.id];
    });
});

server.listen(5000, () => {
    console.log("🚀 TuckTruck Socket.IO Server Running on port 5000");
    console.log("📡 Waiting for connections...");
});
