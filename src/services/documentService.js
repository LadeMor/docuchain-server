const path = require("path");
const fs = require("fs/promises");
const documentModel = require("../models/documentModel");

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

exports.uploadFile = async (fileName, fileType, fileSize, userId) => {
    const uploadPath = path.join(__dirname, "../../uploads/documents");
    const tempPath = path.join(__dirname, "../../uploads/temp");

    const filePath = path.join(uploadPath, fileName);
    const tempFilePath = path.join(tempPath, fileName);

    //await fs.rename(tempFilePath, filePath);

    const document = await documentModel.uploadDocument(userId, fileName, filePath, fileType, fileSize);
    console.log(document);
    return document.Id;
}