import express from 'express';
import {sendRequest, getRequests, getInvitates, getFriends, acceptFriend} from "../controllers/friend.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/friends", protectRoute, getFriends);

router.post("/send-requests", protectRoute, sendRequest);

router.get("/get-requests", protectRoute, getRequests);

router.get("/get-invitates", protectRoute, getInvitates);

router.post("/accept", protectRoute, acceptFriend);



export default router;