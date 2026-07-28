const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Area = sequelize.define(
    "Area",
    {
        area_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        area_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "areas",
        timestamps: false
    }
);

module.exports = Area;