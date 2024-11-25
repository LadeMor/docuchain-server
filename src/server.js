const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {ethers} = require("ethers");

const pool = require("./config/database");

const userRoutes = require("./routes/userRouter");
const documentRoutes = require("./routes/documentRoute");


const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`, {
    name: "mainnet",
    chainId: 1
});

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = express();

const corsOptions = {
    origin: "http://localhost:3000", 
    credentials: true, 
    allowedHeaders: ["Authorization", "Content-Type"]
};
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use("/user", userRoutes);
app.use("/document", documentRoutes);

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