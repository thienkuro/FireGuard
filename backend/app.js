require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("./services/mqttService");
require("./services/deviceMonitorService");

const sequelize = require("./config/database");
const models = require("./models");
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const alertRoutes = require("./routes/alertRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/alerts", alertRoutes);



console.log("Auth routes registered");
console.log("Running file:", __filename);
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        project: "FireGuard Backend",
        version: "1.0.0",
        status: "Running"
    });
});

sequelize.authenticate()
    .then(async () => {
        console.log("Connected to MySQL");



    })
    .catch((error) => {
        console.error("Database Connection Error:");
        console.error(error);
    });

const PORT = process.env.PORT || 3000;

app.post("/abc", (req, res) => {
    res.json({
        success: true,
        message: "ABC OK"
    });
});

const http = require("http");
const socket = require("./sockets/socket");

const server = http.createServer(app);

// Khởi tạo Socket.IO
socket.initialize(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});