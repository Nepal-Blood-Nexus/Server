const asyncHandler = require("express-async-handler");
const BloodRequest = require("../models/request");
const User = require("../models/user");
const Chat = require("../models/chat");
const { sendNotification } = require("../utils/sendNotification");
const { pusher } = require("../utils/pusher");
const { default: mongoose } = require("mongoose");


const intializeChat = asyncHandler(async (req, res) => {
    const { requestid } = req.body;
    console.log(requestid)
    const userid = req.user._id;
    const _request = await BloodRequest.findById().populate("initiator")
    
    const bloodRequest = await BloodRequest.findOne({
        _id: mongoose.Schema.ObjectId(requestid),
        'chats.user': mongoose.Schema.ObjectId(userid)
    })
    .populate({
        path: 'chats.user',
        model: 'User'
    })
    .populate('initiator');
   
    console.log(bloodRequest)
    if (!bloodRequest) {
        const _chat = new Chat();
        let chat = {};
        chat.content = "chat reference";
        chat.author = userid;
        chat.type = "info";
        _chat.requestid = requestid;
        _chat.usera = userid;
        _chat.userb = _request.initiator;
        _chat.message = [..._chat.message, chat];
        _chat.recipentName = _request.initiator.fullname;

        await _chat.save();

        const chatRef = {
            user: userid,
            chat: _chat._id
        }
        _request.chats = [..._request.chats, chatRef];
        console.log(_request);
        await _request.save();
        await sendNotification(_request.initiator.notification_token, "New Chat")
        res.status(200).json({ chat: _chat })
    }
    else {
        // const chat = await Chat.findOne({requestid: requestid, usera: req.user._id}).populate(['usera','userb'])
        const chat = await Chat.findOne({
            $or: [
                {  usera: req.user._id },
                {  userb: req.user._id }
            ]
        }).populate(['usera', 'userb']).populate({
            path: 'requestid',
            populate: {
                path: 'initiator',
                model: 'User'
            }
        });
    
        let recipentName = chat.usera._id.toString() === req.user._id.toString() ? chat.userb.fullname : chat.usera.fullname;
        res.status(200).json({ chat: { ...chat._doc, recipentName } })
    }
   
});



const getMyChats = asyncHandler(async (req, res) => {
    // const userid = req.user._id;
    const chat = await Chat.find({
        $or: [
            {  usera: req.user._id },
            {  userb: req.user._id }
        ]
    }).populate(['usera', 'userb']).populate({
        path: 'requestid',
        populate: {
            path: 'initiator',
            model: 'User'
        }
    });

    // const chatsa = await Chat.find({ usera: userid }).populate('userb')
    // const chatsb = await Chat.find({ userb: userid }).populate('usera');
    // const chatsc = chatsa.concat(chatsb);
    let allchats = [];
    chat.forEach((chat) => {
        let recipentName = chat.usera._id.toString() === req.user._id.toString() ? chat.userb.fullname : chat.usera.fullname;
        allchats.push({ ...chat._doc, recipentName });
    });

    console.log(allchats)

    // let recipentName = chat.usera._id.toString() === req.user._id.toString() ? chat.userb.fullname : chat.usera.fullname;
    res.status(200).json({ chats: allchats })
})

const sendMessage = asyncHandler(async (req, res) => {
    const { msg, chatid } = req.body;
    const _chat = await Chat.findById(chatid);
    let chat = {};
    chat.content = msg;
    chat.author = req.user._id;
    chat.type = "text";
    _chat.message = [..._chat.message, chat];
    await _chat.save();
    res.status(200).send("sent");
    pusher.trigger('main', 'chat', chat);

});



module.exports = {
    intializeChat,
    getMyChats,
    sendMessage
};