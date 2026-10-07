const {
    Notification,
    Alert,
    User,
    Device,
    AlarmLevel,
    NotificationToken
} = require("../models");

const { Op } = require("sequelize");


const registerToken = async (req, res) => {

    try {

        const { fcm_token, device_name } = req.body;

        if (!fcm_token) {

            return res.status(400).json({
                success: false,
                message: "FCM token is required"
            });

        }

        const user_id = req.user.user_id;

        const [notificationToken, created] =
            await NotificationToken.findOrCreate({

                where: {
                    fcm_token: fcm_token
                },

                defaults: {
                    user_id: user_id,
                    device_name: device_name || null
                }

            });

        // Token đã tồn tại → cập nhật user/device
        if (!created) {

            notificationToken.user_id = user_id;

            if (device_name) {
                notificationToken.device_name = device_name;
            }

            await notificationToken.save();

        }

        return res.status(200).json({

            success: true,
            message: "FCM token registered successfully"

        });

    } catch (error) {

        console.error("Register FCM Token Error:", error);

        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};

/**
 * GET /api/notifications
 */
const getNotifications = async (req, res) => {

    try {

        const notifications = await Notification.findAll({

            where: {
                user_id: req.user.user_id
            },

            include: [
                {
                    model: Alert,
                    include: [
                        {
                            model: Device,
                            attributes: [
                                "device_id",
                                "device_name"
                            ]
                        },
                        {
                            model: AlarmLevel,
                            attributes: [
                                "level_name",
                                "color"
                            ]
                        }
                    ]
                }
            ],

            order: [
                ["sent_at", "DESC"]
            ]

        });

        return res.status(200).json({

            success: true,
            total: notifications.length,
            data: notifications

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};

/**
 * GET /api/notifications/unread-count
 */
const getUnreadCount = async (req, res) => {

    try {

        const count = await Notification.count({

            where: {

                user_id: req.user.user_id,

                is_read: false

            }

        });

        return res.status(200).json({

            success: true,
            unread: count

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};

/**
 * PATCH /api/notifications/:id/read
 */
const markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const notification = await Notification.findOne({

            where: {

                notification_id: id,

                user_id: req.user.user_id

            }

        });

        if (!notification) {

            return res.status(404).json({

                success: false,
                message: "Notification not found"

            });

        }

        notification.is_read = true;

        await notification.save();

        return res.status(200).json({

            success: true,
            message: "Notification marked as read"

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};

/**
 * PATCH /api/notifications/read-all
 */
const markAllRead = async (req, res) => {

    try {

        const result = await Notification.update(

            {

                is_read: true

            },

            {

                where: {

                    user_id: req.user.user_id,

                    is_read: false

                }

            }

        );

        return res.status(200).json({

            success: true,
            message: "All notifications marked as read",
            updated: result[0]

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal server error"

        });

    }

};


const { sendPushNotification } = require("../services/notificationService");
const {
    createAlertAndNotify
} = require("../services/alertService");


const testNotification = async (req, res) => {

    try {

        const result = await sendPushNotification({
            user_id: req.user.user_id,

            title: "🔥 FireGuard Test",

            body: "Đây là thông báo kiểm tra hệ thống FCM.",

            data: {
                type: "test"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Test notification sent",
            result: result
        });

    } catch (error) {

        console.error(
            "Test Notification Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to send notification"
        });
    }
};

const testAlert = async (req, res) => {

    try {

        const result = await createAlertAndNotify({

            device_id: 1,

            level_id: 1,

            title: "🔥 CẢNH BÁO CHÁY",

            description:
                "Hệ thống phát hiện dấu hiệu cháy tại khu vực kiểm tra."

        });

        return res.status(200).json({

            success: true,

            message: "Alert and notification created",

            data: result

        });

    } catch (error) {

        console.error(
            "Test Alert Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to create alert",

            error: error.message

        });

    }

};



module.exports = {

    getNotifications,

    getUnreadCount,

    markAsRead,

    markAllRead,

    registerToken,

    testNotification,

    testAlert

};
