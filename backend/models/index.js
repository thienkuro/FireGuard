const Role = require("./Role");
const User = require("./User");
const Area = require("./Area");
const Device = require("./Device");
const DeviceStatus = require("./DeviceStatus");
const SensorHistory = require("./SensorHistory");
const AlarmLevel = require("./AlarmLevel");
const Alert = require("./Alert");
const Command = require("./Command");
const Notification = require("./Notification");
const NotificationToken = require("./NotificationToken");
const Setting = require("./Setting");
const AuditLog = require("./AuditLog");
const DeviceLog = require("./DeviceLog");
const SensorType = require("./SensorType");


//User and Role Relationship
Role.hasMany(User, {
    foreignKey: "role_id"
});

User.belongsTo(Role, {
    foreignKey: "role_id"
});

//Area ↔ Device
Area.hasMany(Device, {
    foreignKey: "area_id"
});

Device.belongsTo(Area, {
    foreignKey: "area_id"
});

//Device ↔ DeviceStatus(Một thiết bị chỉ có một trạng thái hiện tại.)
Device.hasOne(DeviceStatus, {
    foreignKey: "device_id"
});

DeviceStatus.belongsTo(Device, {
    foreignKey: "device_id"
});

//Device ↔ SensorHistory (Một thiết bị có rất nhiều bản ghi lịch sử.)
Device.hasMany(SensorHistory, {
    foreignKey: "device_id"
});

SensorHistory.belongsTo(Device, {
    foreignKey: "device_id"
});

//Device ↔ Alert
Device.hasMany(Alert, {
    foreignKey: "device_id"
});

Alert.belongsTo(Device, {
    foreignKey: "device_id"
});

//AlarmLevel ↔ Alert
AlarmLevel.hasMany(Alert, {
    foreignKey: "level_id"
});

Alert.belongsTo(AlarmLevel, {
    foreignKey: "level_id"
});

//User ↔ Alert(Người xác nhận cảnh báo)
User.hasMany(Alert, {
    foreignKey: "acknowledged_by",
    as: "AcknowledgedAlerts"
});

Alert.belongsTo(User, {
    foreignKey: "acknowledged_by",
    as: "AcknowledgedBy"
});

//Người xử lý xong
User.hasMany(Alert, {
    foreignKey: "resolved_by",
    as: "ResolvedAlerts"
});

Alert.belongsTo(User, {
    foreignKey: "resolved_by",
    as: "ResolvedBy"
});

//Device ↔ Command
Device.hasMany(Command, {
    foreignKey: "device_id"
});

Command.belongsTo(Device, {
    foreignKey: "device_id"
});

//User ↔ Command
User.hasMany(Command, {
    foreignKey: "sender"
});

Command.belongsTo(User, {
    foreignKey: "sender"
});

//Alert ↔ Notification
Alert.hasMany(Notification, {
    foreignKey: "alert_id"
});

Notification.belongsTo(Alert, {
    foreignKey: "alert_id"
});

//User ↔ Notification
User.hasMany(Notification, {
    foreignKey: "user_id"
});

Notification.belongsTo(User, {
    foreignKey: "user_id"
});

//User ↔ NotificationToken
User.hasMany(NotificationToken, {
    foreignKey: "user_id"
});

NotificationToken.belongsTo(User, {
    foreignKey: "user_id"
});

//User ↔ AuditLog
User.hasMany(AuditLog, {
    foreignKey: "user_id"
});

AuditLog.belongsTo(User, {
    foreignKey: "user_id"
});

//Device ↔ DeviceLog
Device.hasMany(DeviceLog, {
    foreignKey: "device_id"
});

DeviceLog.belongsTo(Device, {
    foreignKey: "device_id"
});


module.exports = {
    Role,
    User,
    Area,
    Device,
    DeviceStatus,
    SensorHistory,
    AlarmLevel,
    Alert,
    Command,
    Notification,
    NotificationToken,
    Setting,
    AuditLog,
    DeviceLog,
    SensorType
};