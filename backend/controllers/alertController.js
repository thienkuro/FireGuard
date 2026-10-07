const {
    Alert,
    Device,
    Area,
    AlarmLevel
} = require("../models");

const getAlerts = async (req, res) => {

    try {

        const alerts = await Alert.findAll({

            include: [

                {
                    model: Device,
                    attributes: ["device_id", "area_id"],

                    include: [
                        {
                            model: Area,
                            attributes: ["area_id", "area_name"]
                        }
                    ]
                },

                {
                    model: AlarmLevel,
                    attributes: ["level_name"]
                }

            ],

            order: [
                ["created_at", "DESC"]
            ]

        });

        const data = alerts.map(alert => ({

            alert_id: alert.alert_id,

            device_id: alert.device_id,

            level: alert.AlarmLevel
                ? alert.AlarmLevel.level_name
                : "UNKNOWN",

            title: alert.title,

            description: alert.description,

            status: alert.status,

            area_name:
                alert.Device?.Area?.area_name ||
                `Thiết bị ${alert.device_id}`,

            created_at: alert.created_at

        }));

        res.json({

            success: true,

            total: data.length,

            data: data

        });

    } catch (error) {

        console.error("Get Alerts Error:", error);

        res.status(500).json({

            success: false,

            message: "Không thể lấy danh sách cảnh báo"

        });

    }

};

module.exports = {
    getAlerts
};