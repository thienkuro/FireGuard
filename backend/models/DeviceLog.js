const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DeviceLog = sequelize.define(
    "DeviceLog",
    {
        log_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        device_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        event: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "device_logs",
        timestamps: false
    }
);

module.exports = DeviceLog;