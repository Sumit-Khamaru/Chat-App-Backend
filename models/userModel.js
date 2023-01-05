const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        maxlength: 20,
        unique: [true, "Please choose another name already exists"],
        required: [true, "Please enter a name"],
    },
    email: {
        type: String,
        requird:[true, "Please enter an email "],
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        requird: [true, "Please enter password"],
        minlength: [8, "Password must be at least have 8 characters"],
        select: false
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    }
});
userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY);
}

module.exports = mongoose.model("Users", userSchema);