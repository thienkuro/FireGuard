const mqtt = require("mqtt");

console.log("MQTT_HOST =", process.env.MQTT_HOST);
console.log("MQTT_PORT =", process.env.MQTT_PORT);

const client = mqtt.connect(
    `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
);

client.on("connect", () => {

    console.log("MQTT Connected");

    client.subscribe("fireguard/device/+/status", (err) => {

        if (!err) {
            console.log("Subscribed: fireguard/device/+/status");
        } else {
            console.log(err);
        }

    });

});

function publishControl(deviceId, data) {

    const topic = `fireguard/device/${deviceId}/control`;

    client.publish(topic, JSON.stringify(data));

    console.log("Publish:", topic, data);

}

module.exports = {
    client,
    publishControl
};