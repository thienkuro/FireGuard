const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Alert = sequelize.define(
    "Alert",
    {
        alert_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        device_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        level_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT
        },

        status: {
            type: DataTypes.ENUM(
                "NEW",
                "ACKNOWLEDGED",
                "PROCESSING",
                "RESOLVED"
            ),
            defaultValue: "NEW"
        },

        acknowledged_by: {
            type: DataTypes.BIGINT
        },

        acknowledged_at: {
            type: DataTypes.DATE
        },

        resolved_by: {
            type: DataTypes.BIGINT
        },

        resolved_at: {
            type: DataTypes.DATE
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "alerts",
        timestamps: false
    }
);

module.exports = Alert;