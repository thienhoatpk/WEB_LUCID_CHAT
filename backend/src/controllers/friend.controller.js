import User from "../models/user.model.js"

export const sendRequest = async(req, res) => {
    try {
    const sender = req.user
    const {idReceiver} = req.body;
    console.log(idReceiver)
    const receiver = await User.findById(idReceiver);
    if(!receiver) {
        return res.status(400).json({ msg: "Receiver is not exists" });
    }
    
    if(idReceiver == sender._id){
        return res.status(400).json({ msg: "Cannot send to yourself" });
    }

    if(sender.requestFriend.includes(receiver._id)) {
        return res.status(400).json({ msg: "You sent requset before" });
    }
    if(sender.friends.includes(receiver._id)) {
        return res.status(400).json({ msg: "This user is your Friend" });
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
        const mapRequestFriend = [];
        for(const idRequestFriend of requestFriends){
            const myRequestFriend = await User.findById(idRequestFriend)
            if(myRequestFriend){
                mapRequestFriend.push(myRequestFriend);
            }
        }
        res.status(200).json(mapRequestFriend);
        
    } catch (error) {
        console.log("Error get Requests Friend in Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
};

export const getInvitates = async(req, res) => {
    try {
        const myUser = req.user;
        const invitateFriends = await myUser.invitateFriend;
        const mapInvitates = [];
        for(const idInvitateFriend of invitateFriends){
            const myInvitateFriend = await User.findById(idInvitateFriend);
            if(myInvitateFriend){
                mapInvitates.push(myInvitateFriend);
            }
        }
        res.status(200).json(mapInvitates);
        
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

export const removeFriend = async(req, res) => {
    try {
        const myUser = req.user;
        const { idRemove } = req.body;
        const myFriend = await User.findById(idRemove);
        if(!myUser.friends.includes(idRemove)){
            return res.status(500).json({ msg: "This user is not your friend" });
        }
        else{
            myUser.friends = myUser.friends.filter(id => id.toString() !== idRemove);
            myFriend.friends = myFriend.friends.filter(id => id.toString() !== myUser._id.toString());
            await myUser.save();
            await myFriend.save();
            return res.status(200).json({ msg: "Remove friend by ID: "+idRemove, user: myFriend});
        }  
    } catch (error) {
        console.log("Error remove friend in Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
};
export const cancleRequest = async(req, res) => {
    try {
        const myUser = req.user;
        const { idCancle } = req.body;
        console.log(idCancle)
        if(!myUser.requestFriend.includes(idCancle)){
            return res.status(500).json({ msg: "You don't send this user" });
        }
        else{
            const userCancle = await User.findById(idCancle);
            await myUser.requestFriend.pull(idCancle);
            await userCancle.invitateFriend.pull(myUser._id);
            await userCancle.save();
            await myUser.save();
            return res.status(201).json({ msg: "Cancled ID: "+idCancle});
        }  
    } catch (error) {
        console.log("Error cancle friend in Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
};

export const acceptFriend = async(req, res) => {
    try {
        const myUser = req.user;
        const {idAccept} = req.body;

        if(!myUser.invitateFriend.includes(idAccept)){
            return res.status(500).json({ msg: "This user not request to you" });
        }

        const sender = await User.findById(idAccept);
        if(!sender){
            return res.status(500).json({ msg: "This user not request to you" });
        }
        sender.friends.push(myUser._id);
        myUser.friends.push(sender._id);

        sender.requestFriend.pull(myUser._id);
        myUser.invitateFriend.pull(sender._id);

        sender.save();
        myUser.save();

        res.status(201).json({msg: "Accepted id: "+idAccept, user: sender})
    } catch (error) {
        return res.status(500).json({ msg: "Accepted Fail" });
    }


};
export const search = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const requesterId = req.user._id; 
        console.log(requesterId)
        let type = "stranger"; 

        if (user.friends.includes(requesterId)) {
            type = "Friend";
        } else if (user.requestFriend.includes(requesterId)) {
            type = "sent_request";
        } else if (user.invitateFriend.includes(requesterId)) {
            type = "received_request";
        }
        if(requesterId==user._id){
            type = "isme"
        }
        console.log(type)
        res.status(200).json({ ...user.toObject(), type });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
