const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DeviceStatus = sequelize.define(
    "DeviceStatus",
    {
        status_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        device_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true
        },

        temperature: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0
        },

        humidity: {
            type: DataTypes.DECIMAL(5,2),
            defaultValue: 0
        },

        smoke: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        flame: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        fire_level: {
            type: DataTypes.ENUM(
                "NORMAL",
                "WARNING",
                "DANGER",
                "EMERGENCY"
            ),
            defaultValue: "NORMAL"
        },

        battery_level: {
            type: DataTypes.TINYINT,
            defaultValue: 100
        },

        power_mode: {
            type: DataTypes.ENUM("ADAPTER","BATTERY"),
            defaultValue: "ADAPTER"
        },

        buzzer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        fan: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        pump: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        relay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        updated_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "device_status",
        timestamps: false
    }
);

module.exports = DeviceStatus;