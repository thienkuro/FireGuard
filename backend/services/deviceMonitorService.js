const { Device } = require("../models");
const { sendPushNotification } = require("./notificationService");
const OFFLINE_TIMEOUT = 10000; // 10 giây

async function checkOfflineDevices() {

    try {

        const devices = await Device.findAll({
            attributes: [
                "device_id",
                "device_status",
                "last_seen"
            ]
        });

        const now = Date.now();

        for (const device of devices) {

            if (!device.last_seen) {
                continue;
            }

            const lastSeen = new Date(
                device.last_seen
            ).getTime();

            const difference = now - lastSeen;

            if (
                difference > OFFLINE_TIMEOUT &&
                device.device_status === "ONLINE"
            ) {

                await Device.update(
                    {
                        device_status: "OFFLINE"
                    },
                    {
                        where: {
                            device_id: device.device_id
                        }
                    }
                );

                console.log(
                    `Device ${device.device_id} -> OFFLINE`
                );
            }
        }

    } catch (error) {

        console.error(
            "Device Monitor Error:",
            error
        );

    }
}

setInterval(
    checkOfflineDevices,
    5000
);

module.exports = {
    checkOfflineDevices
};