import User from "../models/user.model.js"

export const sendRequest = async(req, res) => {
    try {
    const sender = req.user
    const {idReceiver} = req.body;
    const receiver = await User.findById(idReceiver);

    if(!receiver) {
        return res.status(500).json({ msg: "Receiver is not exists" });
    }
    
    if(idReceiver == sender._id){
        return res.status(500).json({ msg: "Cannot send to yourself" });
    }

    if(sender.requestFriend.includes(receiver._id)) {
        return res.status(500).json({ msg: "You sent requset before" });
    }
    sender.requestFriend.push(receiver._id);
    sender.save();

    receiver.invitateFriend.push(sender._id);
    receiver.save();

    return res.status(200).json({ msg: "send Successfully" });
    
    } catch (error) {
        console.log("Error send Requests Friend in Controller", error.message)
        res.status(500).json({msg: "Internal Server Error"});
    }
};

export const getRequests = async(req, res) => {
    try {
        const myUser = req.user;
        const requestFriends = await myUser.requestFriend;
        res.status(200).json(requestFriends);
        
    } catch (error) {
        console.log("Error get Requests Friend in Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
};

export const getInvitates = async(req, res) => {
    try {
        const myUser = req.user;
        const invitateFriends = await myUser.invitateFriend;
        res.status(200).json(invitateFriends);
        
    } catch (error) {
        console.log("Error get Invitate Friend in Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
};

export const getFriends = async(req, res) => {
    try {
        const myUser = req.user;
        const friends = await myUser.friends;
        const mapFriend =[];
        for (const idFriend of friends) {
            const myFriend = await User.findById(idFriend); 
            if (myFriend) {
                mapFriend.push(myFriend); 
            }
        }
        res.status(200).json(mapFriend);
        
    } catch (error) {
        console.log("Error get Friend in Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
};

export const acceptFriend = async(req, res) => {
    try {
        const myUser = req.user;
        const {idSender} = req.body;

        if(!myUser.invitateFriend.includes(idSender)){
            return res.status(500).json({ msg: "This user not request to you" });
        }

        const sender = await User.findById(idSender);
        if(!sender){
            return res.status(500).json({ msg: "This user not request to you" });
        }
        sender.friends.push(myUser._id);
        myUser.friends.push(sender._id);

        sender.requestFriend.pull(myUser._id);
        myUser.invitateFriend.pull(sender._id);

        sender.save();
        myUser.save();

        res.status(201).json({msg: "Accepted"})
    } catch (error) {
        return res.status(500).json({ msg: "Accepted Fail" });
    }
};