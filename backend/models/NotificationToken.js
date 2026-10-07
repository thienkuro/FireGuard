const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NotificationToken = sequelize.define(
    "NotificationToken",
    {
        token_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        device_name: {
            type: DataTypes.STRING(100)
        },

        fcm_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "notification_tokens",
        timestamps: false
    }
);

module.exports = NotificationToken;