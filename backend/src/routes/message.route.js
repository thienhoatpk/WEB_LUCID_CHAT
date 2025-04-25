import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage,getAllLatestMessages, } from "../controllers/message.controller.js";
import { 
    createChatGroup, 
    getUserChatGroups, 
    getChatGroupDetails, 
    updateChatGroup,
    addGroupMember,
    removeGroupMember,
    promoteToAdmin,
    demoteFromAdmin
} from "../controllers/chatGroup.controller.js";
const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/latest-all", protectRoute, getAllLatestMessages);
// router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage)

// Chat nhóm
router.post("/groups", protectRoute, createChatGroup);
router.get("/groups", protectRoute, getUserChatGroups);
router.get("/groups/:groupId", protectRoute, getChatGroupDetails);
router.put("/groups/:groupId", protectRoute, updateChatGroup);
router.post("/groups/:groupId/members", protectRoute, addGroupMember);
router.delete("/groups/:groupId/members/:userId", protectRoute, removeGroupMember);
router.put("/groups/:groupId/admins/:userId", protectRoute, promoteToAdmin);
router.delete("/groups/:groupId/admins/:userId", protectRoute, demoteFromAdmin);

export default router;