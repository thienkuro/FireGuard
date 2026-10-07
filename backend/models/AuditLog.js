const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog = sequelize.define(
    "AuditLog",
    {
        log_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.BIGINT
        },

        action: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        target: {
            type: DataTypes.STRING(100)
        },

        ip_address: {
            type: DataTypes.STRING(45)
        },

        created_at: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "audit_logs",
        timestamps: false
    }
);

module.exports = AuditLog;