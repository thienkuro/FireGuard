const { Device, Area, DeviceStatus } = require("../models");

const { client: mqttClient } = require("../config/mqtt");


const getAllDevices = async (req, res) => {
    try {

        const devices = await Device.findAll({
            include: [
                {
                    model: Area,
                    attributes: ["area_name"]
                },
                {
                    model: DeviceStatus,
                    attributes: [
                        "fire_level",
                        "battery_level"
                    ]
                }
            ],
            order: [["device_id", "ASC"]]
        });

        return res.status(200).json({
            success: true,
            data: devices
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};

const getDeviceById = async (req, res) => {
    try {

        const { id } = req.params;

        const device = await Device.findByPk(id, {
            include: [
                {
                    model: Area,
                    attributes: ["area_name", "location"]
                },
                {
                    model: DeviceStatus
                }
            ]
        });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: device
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};

const { SensorHistory } = require("../models");

const getDeviceHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const history = await SensorHistory.findAndCountAll({
            where: {
                device_id: id
            },
            order: [
                ["created_at", "DESC"]
            ],
            limit,
            offset
        });

        return res.status(200).json({
            success: true,
            total: history.count,
            page,
            totalPages: Math.ceil(history.count / limit),
            data: history.rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const { Command } = require("../models");

const sendCommand = async (req, res) => {

    try {
        const { id } = req.params;
        const { command, value } = req.body;
        if (!command) {
            return res.status(400).json({
                success: false,
                message: "Command is required"
            });
        }
        const validCommands = [
            "FAN",
            "PUMP",
            "BUZZER"
        ];
        if (!validCommands.includes(command.toUpperCase())) {

            return res.status(400).json({

                success: false,
                message: "Invalid command"

            });

        }
        const newCommand = await Command.create({
            device_id: id,
            command,
            value,
            sender: req.user.user_id,
            status: "SENT"
        });
        const updateData = {};

        switch (command.toUpperCase()) {

            case "FAN":
                updateData.fan = value;
                break;

            case "PUMP":
                updateData.pump = value;
                break;

            case "BUZZER":
                updateData.buzzer = value;
                break;

        }

        await DeviceStatus.update(
            updateData,
            {
                where: {
                    device_id: id
                }
            }
        );
                if (!mqttClient.connected) {
            return res.status(503).json({
                success: false,
                message: "MQTT broker is not connected"
            });
        }
        mqttClient.publish(
            `fireguard/device/${id}/command`,
            JSON.stringify({
                command,
                value
            }),
            (err) => {
                if (err) {
                    console.error("MQTT Publish Error:", err);
                } else {
                    console.log(`MQTT Publish -> fireguard/device/${id}/command`);
                    console.log({
                        command,
                        value
                    });
                }
            }
        );
        return res.json({
            success: true,
            message: "Command sent",
            data: newCommand
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

};

module.exports = {
    getAllDevices,
    getDeviceById,
    getDeviceHistory,
    sendCommand
};