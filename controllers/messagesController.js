const Message = require("../models/MessageModel");

module.exports.addMessage = async (req, res) => {
    try {
        
        const {from, to, message} = req.body;
        const data = await Message.create({
            message:{text: message},
            users: [from, to],
            sender: from,
        });

        if(data) return res.status(201).json({msg: 'Message added Successfully.'});

        return res.status(404).json({msg: 'Failed to add Message to the Database.'})

    } catch (error) {
        res.status(500).json({
        status: false,
        msg: error.message,
    });
    }

}




module.exports.getAllMessage = async (req, res) => {
    try {
        
        const {from, to} = req.body;
        const messages = await Message.find({
            users:{
                $all:[from, to]
            },
        }).sort({updatedAt: 1});

        const projMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        });
        if(projMessages) {
            return res.status(201).json(projMessages);
        }
        res.status(404).json({
            status: false,
            msg: "Can't get the message"
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
}