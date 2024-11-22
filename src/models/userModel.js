const pool = require("../config/database");

exports.getUserByEmail = async (email) => {
   
    try{
        const result = await pool.query('SELECT * FROM "User" WHERE "Email" = $1', [email]);
        return result.rows[0];
    }catch(error){
        console.error("Error fetching user: ", error.message);
    }
    
}

exports.getUserDataById = async (id) => {
    try{
        const userData = await pool.query('SELECT "First_name", "Last_name", "Email", "Organization" FROM "User" WHERE "Id" = $1', [id]);
        return userData.rows[0];
    }catch(error){
        console.error("Database query error: ", error);
        throw error;
    }
}

exports.createUser = async (firstName, lastName, email, hashedPassword, organization) => {
    
    const result = await pool.query(
         `INSERT INTO "User" ("First_name", "Last_name", "Email", "Password", "Organization") VALUES ($1, $2, $3, $4, $5) RETURNING "Id"`,
         [firstName, lastName, email, hashedPassword, organization]
    );
    return result.rows[0];
}

