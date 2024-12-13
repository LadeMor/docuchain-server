const pool = require("../config/database");

exports.uploadDocument = async (userId, fileName, filePath, fileType, fileSize) => {

    try{

        const result = await pool.query(
            `INSERT INTO "Documents" ("User_id", "File_name", "File_path", "File_type", "Size") VALUES ($1, $2, $3, $4, $5) RETURNING "Id"`,
            [userId, fileName, filePath, fileType, fileSize]
        );
        console.log(result);
        return result.rows[0];
    }catch(error){
        console.error("Error uploading document to database: " + error);
    }

}