const {
    Area,
    Device,
    DeviceStatus,
    Alert,
    AlarmLevel
} = require("../models");

const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {

    try {

        //==========================
        // Area + Device + Status
        //==========================

        const areas = await Area.findAll({

            include: [

                {

                    model: Device,

                    include: [

                        {

                            model: DeviceStatus

                        }

                    ]

                }

            ],

            order: [["area_id", "ASC"]]

        });

        //==========================
        // Online Node
        //==========================

        let onlineNodes = 0;

        //==========================
        // Battery
        //==========================

        let batteryTotal = 0;
        let batteryCount = 0;

        //==========================
        // Convert sang Android
        //==========================

        const areaData = areas.map(area => {

            const device = area.Devices[0];

            const status = device?.DeviceStatus;

            if (device?.device_status === "ONLINE")
                onlineNodes++;

            if (status) {

                batteryTotal += status.battery_level;
                batteryCount++;

            }

            return {

                id: area.area_id,

                name: area.area_name,

                fireLevel: status?.fire_level ?? "NORMAL",

                temperature: Number(status?.temperature ?? 0),

                humidity: Number(status?.humidity ?? 0),

                smoke: status?.smoke ?? 0,

                online: device?.device_status === "ONLINE",

                updatedAt: status?.updated_at,

                battery: status?.battery_level ?? 0

            };

        });

        //==========================
        // Alert
        //==========================

        const activeAlerts = await Alert.count({

            where: {

                status: {

                    [Op.not]: "RESOLVED"

                }

            }

        });

        //==========================
        // Recent Alert
        //==========================

        const alerts = await Alert.findAll({

            limit: 5,

            order: [["created_at", "DESC"]],

            include: [

                AlarmLevel,

                {

                    model: Device,

                    include: [Area]

                }

            ]

        });

        const recentAlerts = alerts.map(alert => {

    const level = alert.AlarmLevel.level_name;

        let title = "";
        let color = "";
        let icon = "";

        switch (level) {

            case "EMERGENCY":

                title = "Phát hiện cháy";
                color = "#E53935";
                icon = "fire";

                break;

            case "WARNING":

                title = "Có dấu hiệu bất thường";
                color = "#FF9800";
                icon = "warning";

                break;

            default:

                title = "Hoạt động bình thường";
                color = "#4CAF50";
                icon = "normal";

        }

        return {

            id: alert.alert_id,

            areaName: alert.Device.Area.area_name,

            level,

            title,

            color,

            icon,

            time: new Intl.DateTimeFormat("vi-VN", {

                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                hour12: false

            }).format(new Date(alert.created_at))

        };

    });

        //==========================
        // Last Update
        //==========================

        let lastUpdate = null;

        areaData.forEach(a => {

            if (!lastUpdate || new Date(a.updatedAt) > new Date(lastUpdate))

                lastUpdate = a.updatedAt;

        });

        //==========================
        // Response
        //==========================
        const totalNodes = areaData.length;

        const powerMode =
            areas[0]?.Devices?.[0]?.DeviceStatus?.power_mode ?? "AC";

        res.json({

            onlineNodes,

            totalNodes,

            activeAlerts,

            battery: batteryCount === 0
                ? 0
                : Math.round(batteryTotal / batteryCount),

            powerMode,

            lastUpdate,

            message:
                activeAlerts > 0
                    ? "Có cảnh báo đang hoạt động"
                    : "Mọi thiết bị hoạt động bình thường",

            areas: areaData,

            recentAlerts

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Dashboard Error"

        });

    }

};