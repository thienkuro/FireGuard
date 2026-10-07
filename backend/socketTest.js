// const { io } = require("socket.io-client");

// const socket = io("http://localhost:3000");

// socket.on("connect", () => {

//     console.log("Connected:", socket.id);

//     socket.emit("joinDevice", 1);

// });

// socket.on("deviceStatus", (data) => {

//     console.log("========== DEVICE STATUS ==========");
//     console.log(data);

// });

// socket.on("newAlert", (alert) => {

//     console.log("========== NEW ALERT ==========");
//     console.log(alert);

// });

// socket.on("disconnect", () => {

//     console.log("Disconnected");

// });
//User...




const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {

    console.log("Connected:", socket.id);

    socket.emit("joinAllDevices");

});

socket.on("deviceStatus", (data) => {

    console.log("========== DEVICE STATUS ==========");
    console.log(data);

});

socket.on("newAlert", (alert) => {

    console.log("========== NEW ALERT ==========");
    console.log(alert);

});

socket.on("disconnect", () => {

    console.log("Disconnected");

});

//admin...