const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AlarmLevel = sequelize.define(
    "AlarmLevel",
    {
        level_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        level_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },

        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        color: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        sound: {
            type: DataTypes.STRING(100)
        },

        description: {
            type: DataTypes.STRING(255)
        }
    },
    {
        tableName: "alarm_levels",
        timestamps: false
    }
);

module.exports = AlarmLevel;