const { messaging } = require("../config/firebase");

const { NotificationToken } = require("../models");

const sendPushNotification = async ({
    user_id,
    title,
    body,
    level = "WARNING",
    data = {}
}) => {

    try {

        const tokens = await NotificationToken.findAll({
            where: {
                user_id: user_id
            }
        });

        if (tokens.length === 0) {

            console.log(
                `Không tìm thấy FCM token của user ${user_id}`
            );

            return {
                success: false,
                message: "No FCM token found"
            };
        }

        const fcmTokens = tokens.map(
            item => item.fcm_token
        );

        // ==============================
        // FCM CONFIG THEO MỨC CẢNH BÁO
        // ==============================

        let notificationTitle;
        let notificationBody;

        if (level === "EMERGENCY") {

            notificationTitle = "🔥 FIRE EMERGENCY";

            notificationBody =
                body || "Phát hiện nguy cơ cháy khẩn cấp!";

        } else {

            notificationTitle = "⚠️ FireGuard Warning";

            notificationBody =
                body || "Phát hiện dấu hiệu bất thường.";
        }

        const message = {

            notification: {
                title: notificationTitle,
                body: notificationBody
            },

            data: {
                ...data,
                level: level
            },

            android: {

                priority:
                    level === "EMERGENCY"
                        ? "high"
                        : "high",

                notification: {

                    channelId:
                        level === "EMERGENCY"
                            ? "fire_emergency"
                            : "fire_warning",

                    priority:
                        level === "EMERGENCY"
                            ? "max"
                            : "high",

                    defaultSound: true,

                    defaultVibrateTimings: true
                }
            },

            tokens: fcmTokens
        };

        const response =
            await messaging.sendEachForMulticast(message);

        console.log(
            `FCM ${level}: ${response.successCount} thành công, ${response.failureCount} thất bại`
        );

        return {

            success: true,

            level: level,

            successCount:
                response.successCount,

            failureCount:
                response.failureCount
        };

    } catch (error) {

        console.error(
            "Send FCM Error:",
            error
        );

        throw error;
    }
};

module.exports = {
    sendPushNotification
};