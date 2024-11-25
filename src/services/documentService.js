const path = require("path");
const fs = require("fs/promises");
const documentModel = require("../models/documentModel");

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

exports.uploadFile = async (file, userId) => {
    const uploadPaht = path.join(__dirname, "../../uploads/documents");
    const filePath = path.join(uploadPaht, file.name);

    await fs.rename(file.temFilePath, filePath);

    const document = await documentModel.uploadDocument(userId, file.name, filePath, file.mimetype, file.size);

    return document.id;
}