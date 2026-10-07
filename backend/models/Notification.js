const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        notification_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        alert_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        body: {
            type: DataTypes.TEXT
        },

        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        sent_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "notifications",
        timestamps: false
    }
);

module.exports = Notification;