const { Server } = require("socket.io");

let io;

function initialize(server) {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log("Client Connected:", socket.id);

        // User theo dõi 1 thiết bị
        socket.on("joinDevice", (deviceId) => {

            const room = `device_${deviceId}`;

            socket.join(room);

            console.log(`${socket.id} joined ${room}`);

        });

        // Admin theo dõi toàn bộ thiết bị
        socket.on("joinAllDevices", () => {

            socket.join("all_devices");

            console.log(`${socket.id} joined all_devices`);

        });

        socket.on("disconnect", () => {

            console.log("Client Disconnected:", socket.id);

        });

    });

}

function getIO() {
    return io;
}

module.exports = {
    initialize,
    getIO
};