const userService = require("../services/userService");

exports.registerUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        organization
    } = req.body;
    console.log(req.body);

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "Missing required fileds"
        });
    }

    try {

        const user = await userService.registerUser(firstName, lastName, email, password, organization);
        res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });


    } catch (error) {

        if(error.code == "USER_EXISTS"){
            return res.status(409).json({message: "User with this email already exists"});
        }

        console.error("Error while register user: ", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

exports.loginUsers = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    try {

        const token = await userService.loginUser(email, password);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful"
        });

    } catch (error) {

        if(error.code == "INVALID_DATA"){
            return res.status(409).json("Invalid email or password");
        }

        res.status(500).json({
            message: "Server error"
        });
    }
}

exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userService.getUserById(userId);
        res.json(user); 
    } catch (error) {

        if(error.code == "INVALID_ID"){
            return res.status(409).json("Invalid user id");
        }

        console.error("Error fetching user data: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}