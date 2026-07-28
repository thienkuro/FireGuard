const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SensorHistory = sequelize.define(
    "SensorHistory",
    {
        history_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        device_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        temperature: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false
        },

        humidity: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false
        },

        smoke: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        flame: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        battery_level: {
            type: DataTypes.TINYINT,
            allowNull: false
        },

        power_mode: {
            type: DataTypes.ENUM("ADAPTER","BATTERY"),
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "sensor_history",
        timestamps: false
    }
);

module.exports = SensorHistory;