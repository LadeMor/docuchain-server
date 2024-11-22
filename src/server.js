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

const getUserDataById = async id => {
    try{
        const userData = await pool.query('SELECT "First_name", "Last_name", "Email", "Organization" FROM "User" WHERE "Id" = $1', [id]);
        return userData.rows[0];
    }catch(error){
        console.error("Database query error: ", error);
        throw error;
    }
}

app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserDataById(userId); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); 
    } catch (error) {
        console.error("Error fetching user data: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});