const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {ethers} = require("ethers");
const path = require("path");
const fs = require("fs-extra");
const bodyParser = require('body-parser');
const multer = require("multer");

const pool = require("./config/database");

const userRoutes = require("./routes/userRouter");
const documentRoutes = require("./routes/documentRoute");
const documentService = require("./services/documentService");

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, {
    name: "sepolia",
    chainId: 1
});

const app = express();

const corsOptions = {
    origin: "http://localhost:3000", 
    credentials: true, 
    allowedHeaders: ["Authorization", "Content-Type"]
};
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use("/user", userRoutes);


const uploadPath = path.join(__dirname, "../uploads/documents");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
 });

app.post("/document/upload", upload.single("document"), async (req, res) => {

    try {
        const file = req.file;
        const userId = req.body.userID;

        if (!file || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const document = {
            filePath: file.path,
            userId,
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
        };
       
        const documentId = await documentService.uploadFile(
            document.fileName,
            document.fileType,
            document.fileSize,
            document.userId,
        );

        res.status(201).json({
            message: "File uploaded successfully",
            documentId,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

async function checkConnection() {
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
}

checkConnection();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            message: "Invalid token"
        });

        req.user = user;
        next();
    });
};

app.get("/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You are authorized!",
        user: req.user
    });
});

app.get("/me", (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json(user);
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});