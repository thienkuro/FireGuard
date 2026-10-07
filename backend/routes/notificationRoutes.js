const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllRead,
    registerToken,
    testNotification,
    testAlert
} = require("../controllers/notificationController");


router.get(
    "/",
    authenticate,
    getNotifications
);


router.get(
    "/unread-count",
    authenticate,
    getUnreadCount
);


router.post(
    "/token",
    authenticate,
    registerToken
);


router.patch(
    "/read-all",
    authenticate,
    markAllRead
);


router.patch(
    "/:id/read",
    authenticate,
    markAsRead
);

router.post(
    "/test",
    authenticate,
    testNotification
);

router.post(
    "/test-alert",
    authenticate,
    testAlert
);


module.exports = router;