const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        role_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        phone: {
            type: DataTypes.STRING(20)
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        created_at: {
            type: DataTypes.DATE
        },

        updated_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "users",
        timestamps: false
    }
);


module.exports = User;