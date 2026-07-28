const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./config/database");
const Area = require("./models/Area");
const Device = require("./models/Device");
const DeviceStatus = require("./models/DeviceStatus");
const SensorHistory = require("./models/SensorHistory");
const app = express();

app.use(cors());
app.use(express.json());
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
        const areas = await Area.findAll();

console.table(areas.map(area => area.toJSON()));

const devices = await Device.findAll();
console.table(devices.map(device => device.toJSON()));

const devicesStatus = await DeviceStatus.findAll();
console.table(devicesStatus.map(status => status.toJSON()));

const sensorHistory = await SensorHistory.findAll();
console.table(sensorHistory.map(history => history.toJSON()));

    })
    .catch((error) => {
        console.error("Database Connection Error:");
        console.error(error);
    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});