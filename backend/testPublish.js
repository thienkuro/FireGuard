const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://broker.emqx.io:1883");

client.on("connect", () => {

    console.log("Connected");

    const payload = {

        temperature: 33,
        humidity: 65,
        smoke: 80,
        flame: true,
        battery_level: 98,
        power_mode: "ADAPTER"

    };

    client.publish(
        "fireguard/device/1/status",
        JSON.stringify(payload)
    );

    console.log("Published");

    client.end();

});