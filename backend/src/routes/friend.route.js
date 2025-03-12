import express from 'express';
import {sendRequest, getRequests, getInvitates, getFriends,removeFriend ,acceptFriend, cancleRequest} from "../controllers/friend.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/friends", protectRoute, getFriends);

router.post("/send-requests", protectRoute, sendRequest);

router.get("/get-requests", protectRoute, getRequests);

router.get("/get-invitates", protectRoute, getInvitates);

router.post("/remove-friend", protectRoute, removeFriend);
1
router.post("/cancle-request", protectRoute, cancleRequest);

router.post("/accept-friend", protectRoute, acceptFriend);



export default router;