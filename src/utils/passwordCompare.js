const bcrypt = require("bcrypt");

const passwordCompare = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}

module.exports = passwordCompare;

