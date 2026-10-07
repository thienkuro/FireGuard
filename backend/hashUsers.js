require("dotenv").config();

const sequelize = require("./config/database");
const { User } = require("./models");
const { hashPassword } = require("./utils/hashPassword");

async function run() {
    try {

        await sequelize.authenticate();

        console.log("Connected to MySQL");

        const users = await User.findAll();

        for (const user of users) {

            const hashed = await hashPassword(user.password_hash);

            user.password_hash = hashed;

            await user.save();

            console.log(`${user.username} updated`);
        }

        console.log("Done.");

        process.exit();

    } catch (err) {

        console.error(err);

        process.exit(1);

    }
}

run();