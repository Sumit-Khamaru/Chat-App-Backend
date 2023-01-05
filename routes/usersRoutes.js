const { register, login, logout, setAvatar, getAllUsers } = require("../controllers/userController");

const router = require("express").Router();


router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);


router.get("/allusers/:id", getAllUsers);


module.exports = router;