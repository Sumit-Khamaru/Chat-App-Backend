const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports.isAuthenticated = async (req, res, next) => {
    try {
        
        const {token} = req.cookies;

        if(!token) {
            return res.status(401).json({
                msg: "Please login first"
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        next();

    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}