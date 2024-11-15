const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {Pool} = require("pg");

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: String(process.env.DB_USER),
    host: String(process.env.DB_HOST),
    database:"Docuchain",
    password:String(process.env.DB_PASSWORD),
    port:5432,
    client_encoding: 'UTF8'
})

const JWT_SECRET = process.env.JWT_SECRET;

app.post("/register", async (req, res) => {
    const {firstName, lastName, email, password, organization} = req.body;

    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({message: "Missing required fileds"});
    }

    try{

        const userCheck = await pool.query('SELECT * FROM "User" WHERE "Email" = $1', [email]);
        if(userCheck.rows.length > 0){
            return res.status(409).json({message: "User with this email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO "User" ("First_name", "Last_name", "Email", "Password", "Organization") VALUES ($1, $2, $3, $4, $5) RETURNING "Id"`,
            [firstName, lastName, email, hashedPassword, organization]
        )

        res.status(201).json({message: "User registered successfully", userId: result.rows[0].id});


    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});


app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Missing required fields"});
    }

    try{

        const userResult = await pool.query("SELECT * FROM User WHERE Email = $1", [email]);
        const user = userResult.rows[0];

        if(!user){
            return res.status(401),json({message: "Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.json({message: "Login successful", token});

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
})

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "You are authorized!", user: req.user });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});