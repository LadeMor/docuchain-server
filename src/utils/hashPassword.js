const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const passwordCompare = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}

module.exports = hashPassword;

