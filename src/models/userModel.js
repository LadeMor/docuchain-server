const pool = require("../config/database");

exports.getUserByEmail = async (email) => {
   
    try{
        const result = await pool.query('SELECT * FROM "User" WHERE "Email" = $1', [email]);
        return result.rows[0];
    }catch(error){
        console.error("Error fetching user: ", error.message);
    }
    
}

exports.createUser = async (firstName, lastName, email, hashedPassword, organization) => {
    
    const result = await pool.query(
         `INSERT INTO "User" ("First_name", "Last_name", "Email", "Password", "Organization") VALUES ($1, $2, $3, $4, $5) RETURNING "Id"`,
         [firstName, lastName, email, hashedPassword, organization]
    );
    return result.rows[0];
}