const express = require("express");
const documentService = require("../services/documentService");

const router = express.Router();


router.post("/upload", async (req, res) => {
    try{

        if(!req.files || !req.files.document){
            return res.status(400).json({message: "No file uploaded"});
        }

        const document  = req.files.document;
        const userId = req.body.userId;

        if(!userId){
            return res.status(400).json({message: "Missing user Id"});
        }

        const documentId = documentService.uploadFile(document, userId);

        res.status(201).json({
            message: "File uploaded successfully",
            documentId
        });

    }catch(error){
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;