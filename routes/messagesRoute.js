const { addMessage, getAllMessage } = require("../controllers/messagesController");
const { isAuthenticated } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/addmessage", addMessage);

router.post("/getmessages", getAllMessage);


module.exports = router;