// const express = require("express");
// const path = require("path");
// const fs = require("fs-extra");
// const documentService = require("../services/documentService");

// const app = express();
// app.use(express.json());

// const router = express.Router();

// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// router.post("/upload", async (req, res) => {
    
//     try{

//         console.log(req)
//         if(!req.files || !req.files.document){
//             return res.status(400).json({message: "No file uploaded"})
//         }

//     }catch(error){
//         console.error("Error uploading files: " + error);
//         res.status(500).json({message: "Internal server error"});
//     }

// });

// module.exports = router;