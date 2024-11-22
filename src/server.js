const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("./config/database");
const userRoutes = require("./routes/userRouter");

require('dotenv').config();
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