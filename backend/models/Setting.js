const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Setting = sequelize.define(
    "Setting",
    {
        setting_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        smoke_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        temperature_threshold: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false
        },

        flame_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        confirm_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        alarm_sound: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        dark_mode: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        auto_mode: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        updated_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "settings",
        timestamps: false
    }
);

module.exports = Setting;