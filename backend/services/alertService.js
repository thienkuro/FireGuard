const {
    Alert,
    Notification,
    NotificationToken
} = require("../models");

const {
    sendPushNotification
} = require("./notificationService");


/**
 * Tạo Alert + Notification + gửi FCM
 */
const createAlertAndNotify = async ({
    device_id,
    level_id,
    title,
    description
}) => {

    try {

        // ==========================================
        // 1. TẠO ALERT
        // ==========================================

        const alert = await Alert.create({

            device_id: device_id,

            level_id: level_id,

            title: title,

            description: description,

            status: "NEW",

            created_at: new Date()

        });


        console.log(
            "Alert created:",
            alert.alert_id
        );


        // ==========================================
        // 2. LẤY DANH SÁCH USER CÓ FCM TOKEN
        // ==========================================

        const tokenRecords =
            await NotificationToken.findAll({

                attributes: [
                    "user_id"
                ],

                group: [
                    "user_id"
                ]

            });


        if (tokenRecords.length === 0) {

            console.log(
                "Không có user nào đăng ký FCM token"
            );

            return {

                success: true,

                alert_id: alert.alert_id,

                notifications: 0

            };

        }


        // ==========================================
        // 3. TẠO NOTIFICATION + GỬI FCM
        // ==========================================

        let notificationCount = 0;


        for (const tokenRecord of tokenRecords) {

            const user_id =
                tokenRecord.user_id;


            // --------------------------------------
            // Tạo notification trong database
            // --------------------------------------

            const notification =
                await Notification.create({

                    alert_id: alert.alert_id,

                    user_id: user_id,

                    title: title,

                    body: description,

                    is_read: false,

                    sent_at: new Date()

                });


            console.log(
                `Notification created: ${notification.notification_id} → user ${user_id}`
            );


            // --------------------------------------
            // Gửi FCM
            // --------------------------------------

            try {

                const result =
                    await sendPushNotification({

                        user_id: user_id,

                        title: title,

                        body: description,

                        data: {

                            alert_id:
                                String(alert.alert_id),

                            device_id:
                                String(device_id),

                            level_id:
                                String(level_id),

                            notification_id:
                                String(
                                    notification.notification_id
                                )

                        }

                    });


                console.log(
                    `FCM sent → user ${user_id}`,
                    result
                );


            } catch (error) {

                console.error(
                    `FCM failed → user ${user_id}:`,
                    error
                );

            }


            notificationCount++;

        }


        // ==========================================
        // 4. KẾT QUẢ
        // ==========================================

        return {

            success: true,

            alert_id: alert.alert_id,

            notifications: notificationCount

        };


    } catch (error) {

        console.error(
            "Create Alert Error:",
            error
        );

        throw error;

    }

};


module.exports = {

    createAlertAndNotify

};