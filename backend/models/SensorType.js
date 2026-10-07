const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SensorType = sequelize.define(
    "SensorType",
    {
        sensor_type_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        sensor_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        unit: {
            type: DataTypes.STRING(20)
        },

        description: {
            type: DataTypes.STRING(255)
        }
    },
    {
        tableName: "sensor_types",
        timestamps: false
    }
);

module.exports = SensorType;