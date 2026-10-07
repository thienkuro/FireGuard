const { client: mqttClient } = require("../config/mqtt");

const {
    Device,
    DeviceStatus,
    SensorHistory,
    Alert,
    AlarmLevel,
    User,
    Notification
} = require("../models");

const socket = require("../sockets/socket");

const {
    sendPushNotification
} = require("./notificationService");


// ======================================================
// MQTT MESSAGE HANDLER
// ======================================================

mqttClient.on("message", async (topic, message) => {

    try {

        // ==================================================
        // LẤY DEVICE ID
        // fireguard/device/1/status
        // ==================================================

        const parts = topic.split("/");
        const deviceId = Number(parts[2]);


        // ==================================================
        // PARSE JSON
        // ==================================================

        const data = JSON.parse(message.toString());


        console.log("\n==================================");
        console.log("MQTT Message Received");
        console.log("Device:", deviceId);
        console.log(data);


        // ==================================================
        // FIRE LEVEL
        // ==================================================

        const fireLevel = data.fire_level;

        console.log("Fire Level:", fireLevel);


        // ==================================================
        // LẤY TRẠNG THÁI CŨ
        // ==================================================

        const oldStatus = await DeviceStatus.findOne({

            where: {
                device_id: deviceId
            }

        });

        const oldLevel =
            oldStatus
                ? oldStatus.fire_level
                : "NORMAL";


        console.log("Old Level:", oldLevel);
        console.log("New Level:", fireLevel);


        // ==================================================
        // SOCKET.IO
        // ==================================================

        const io = socket.getIO();

        if (!io) {

            console.log(
                "Socket.IO chưa được khởi tạo!"
            );

        }


        // ==================================================
        // CẬP NHẬT DEVICE STATUS
        // ==================================================

        await DeviceStatus.update(

            {

                temperature: data.temperature,

                humidity: data.humidity,

                smoke: data.smoke,

                flame: data.flame,

                fire_level: fireLevel,

                battery_level: data.battery_level,

                power_mode: data.power_mode,

                fan: data.fan,

                pump: data.pump,

                buzzer: data.buzzer,

                updated_at: new Date()

            },

            {

                where: {
                    device_id: deviceId
                }

            }

        );


        // ==================================================
        // CẬP NHẬT DEVICE ONLINE
        // ==================================================

        await Device.update(

            {

                device_status: "ONLINE",

                last_seen: new Date()

            },

            {

                where: {
                    device_id: deviceId
                }

            }

        );


        console.log(
            "Device Status Updated"
        );


        // ==================================================
        // LƯU SENSOR HISTORY
        // ==================================================

        await SensorHistory.create({

            device_id: deviceId,

            temperature: data.temperature,

            humidity: data.humidity,

            smoke: data.smoke,

            flame: data.flame,

            battery_level: data.battery_level,

            power_mode: data.power_mode,

            created_at: new Date()

        });


        console.log(
            "Sensor History Saved"
        );


        // ==================================================
        // TẠO ALERT
        // Chỉ tạo khi mức cảnh báo thay đổi
        // ==================================================

        if (
            oldLevel !== fireLevel &&
            fireLevel !== "NORMAL"
        ) {


            // ==================================================
            // TÌM ALARM LEVEL
            // ==================================================

            const level =
                await AlarmLevel.findOne({

                    where: {
                        level_name: fireLevel
                    }

                });


            if (!level) {

                console.log(
                    `Không tìm thấy AlarmLevel: ${fireLevel}`
                );

            } else {


                // ==================================================
                // TẠO ALERT
                // ==================================================

                const alert =
                    await Alert.create({

                        device_id: deviceId,

                        level_id: level.level_id,

                        title:
                            `${fireLevel} Fire Alert`,

                        description:
                            `Temperature=${data.temperature}, ` +
                            `Smoke=${data.smoke}, ` +
                            `Flame=${data.flame}`,

                        status: "NEW",

                        created_at: new Date()

                    });


                console.log(
                    "Alert Created:",
                    alert.alert_id
                );


                // ==================================================
                // LẤY TẤT CẢ USER
                // ==================================================

                const users =
                    await User.findAll();


                // ==================================================
                // GỬI NOTIFICATION + FCM
                // ==================================================

                for (const user of users) {

                    try {


                        // ==========================================
                        // LƯU NOTIFICATION DATABASE
                        // ==========================================

                        await Notification.create({

                            alert_id:
                                alert.alert_id,

                            user_id:
                                user.user_id,

                            title:
                                alert.title,

                            body:
                                alert.description,

                            is_read: false,

                            sent_at:
                                new Date()

                        });


                        console.log(
                            `Notification created for user ${user.user_id}`
                        );


                        // ==========================================
                        // GỬI FCM PUSH
                        // ==========================================

                        const fcmResult =
                            await sendPushNotification({

                                user_id:
                                    user.user_id,

                                title:
                                    alert.title,

                                body:
                                    alert.description,

                                level:
                                    fireLevel,

                                data: {

                                    type:
                                        "fire_alert",

                                    alert_id:
                                        String(
                                            alert.alert_id
                                        ),

                                    device_id:
                                        String(
                                            deviceId
                                        ),

                                    level:
                                        fireLevel

                                }

                            });


                        console.log(
                            `FCM result for user ${user.user_id}:`,
                            fcmResult
                        );

                    } catch (error) {

                        console.error(
                            `Notification/FCM Error for user ${user.user_id}:`,
                            error
                        );

                    }

                }


                // ==================================================
                // SOCKET.IO - NEW ALERT
                // ==================================================

                if (io) {

                    io.emit(
                        "newAlert",
                        {

                            alert_id:
                                alert.alert_id,

                            device_id:
                                deviceId,

                            level:
                                fireLevel,

                            title:
                                alert.title,

                            description:
                                alert.description,

                            status:
                                alert.status,

                            created_at:
                                alert.created_at

                        }
                    );


                    console.log(
                        "Realtime Alert Sent"
                    );

                }

            }

        }


        // ==================================================
        // REALTIME DEVICE DATA
        // ==================================================

        const realtimeData = {

            device_id:
                deviceId,

            temperature:
                data.temperature,

            humidity:
                data.humidity,

            smoke:
                data.smoke,

            flame:
                data.flame,

            fire_level:
                fireLevel,

            battery_level:
                data.battery_level,

            power_mode:
                data.power_mode,

            updated_at:
                new Date()

        };


        // ==================================================
        // SOCKET.IO REALTIME
        // ==================================================

        if (io) {


            // Gửi cho User theo device

            io
                .to(`device_${deviceId}`)
                .emit(
                    "deviceStatus",
                    realtimeData
                );


            // Gửi cho Admin

            io
                .to("all_devices")
                .emit(
                    "deviceStatus",
                    realtimeData
                );


            console.log(
                "Realtime Sent"
            );

        }


        console.log(
            "==================================\n"
        );


    } catch (error) {

        console.error(
            "===== MQTT SERVICE ERROR ====="
        );

        console.error(error);

        console.error(
            "=============================="
        );

    }

});