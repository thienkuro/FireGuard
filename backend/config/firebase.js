const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require(
    "../fireguard-c1fdb-firebase-adminsdk-fbsvc-e6adcc95f1.json"
);

const app = initializeApp({
    credential: cert(serviceAccount)
});

const messaging = getMessaging(app);

module.exports = {
    app,
    messaging
};