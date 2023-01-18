const User = require("../models/userModel");
import { toast } from "react-toastify";


module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const nameCheck = await User.findOne({ name });
    if (nameCheck) {
      return res
        .status(200)
        .json({  msg: "Username already taken", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(200).json({  msg: "Email already used", status: false});
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 1000),
      httpOnly: true,
    };
    res.status(201).cookie("token", token, options).json({
      status: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid username or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.
      status(400).
      json({ status: false, msg: "Invalid username or password" });
    }

    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      status: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

module.exports.logout = (req, res) => {
  const options = { expires: new Date(Date.now()), httpOnly: true };

  try {
    res.status(200).cookie("token", null, options).json({
      status: true,
      msg: "Logged Out",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

module.exports.setAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    return res.status(201).json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {

    const allUsers = await (await User.find({ _id: { $ne: req.params.id } }));

    return res.status(201).json({allUsers});
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};
