const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Device = sequelize.define(
    "Device",
    {
        device_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        area_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        device_serial: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        device_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        mac_address: {
            type: DataTypes.STRING(20),
            unique: true
        },

        firmware_version: {
            type: DataTypes.STRING(20)
        },

        ip_address: {
            type: DataTypes.STRING(45)
        },

        battery_capacity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        battery_level: {
            type: DataTypes.TINYINT,
            defaultValue: 100
        },

        power_mode: {
            type: DataTypes.ENUM("ADAPTER", "BATTERY"),
            defaultValue: "ADAPTER"
        },

        device_status: {
            type: DataTypes.ENUM("ONLINE", "OFFLINE"),
            defaultValue: "OFFLINE"
        },

        last_seen: {
            type: DataTypes.DATE
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "devices",
        timestamps: false
    }
);

module.exports = Device;