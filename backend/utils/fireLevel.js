function getFireLevel(data) {

    if (data.flame) {
        return "EMERGENCY";
    }

    if (data.smoke >= 3000) {
        return "EMERGENCY";
    }

    if (data.smoke >= 2500) {
        return "DANGER";
    }

    if (data.smoke >= 2000) {
        return "WARNING";
    }

    return "NORMAL";
}

module.exports = getFireLevel;