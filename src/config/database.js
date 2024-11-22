const {Pool} = require("pg");
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "Docuchain",
    password: String(process.env.DB_PASSWORD),
    port: 5432,
    client_encoding: 'UTF8'
})


module.exports = pool;