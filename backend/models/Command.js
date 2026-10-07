const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Command = sequelize.define(
    "Command",
    {
        command_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        device_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        command: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        value: {
            type: DataTypes.STRING(100)
        },

        sender: {
            type: DataTypes.BIGINT
        },

        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "SENT",
                "EXECUTED",
                "FAILED"
            ),
            defaultValue: "PENDING"
        },

        created_at: {
            type: DataTypes.DATE
        },

        executed_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "commands",
        timestamps: false
    }
);

module.exports = Command;