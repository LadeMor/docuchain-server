const path = require("path");
const fs = require("fs/promises");
const documentModel = require("../models/documentModel");
const {storeDocument} = require("../../scripts/storeDocument");

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

exports.uploadFile = async (fileName, fileType, fileSize, userId, fileHash) => {
    const uploadPath = path.join(__dirname, "../../uploads/documents");
    const tempPath = path.join(__dirname, "../../uploads/temp");

    const filePath = path.join(uploadPath, fileName);
    const tempFilePath = path.join(tempPath, fileName);

    const document = await documentModel.uploadDocument(userId, fileName, filePath, fileType, fileSize);

    if(document){
        (async () => {
            const documentHash = fileHash; 
            const timestamp = Math.floor(Date.now() / 1000); 
            const Id = userId; 
        
            try {
                await storeDocument(documentHash, timestamp, Id);
                console.log("Document stored in blockchain successfully!");
            } catch (error) {
                console.error("Error while storing document in blockchain:", error);
            }
        })();
    }

    return document.Id;
}