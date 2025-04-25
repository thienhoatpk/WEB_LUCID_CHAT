import ChatGroup from "../models/chatGroup.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverId, io } from "../lib/socket.js";

// Tạo nhóm chat mới
export const createChatGroup = async (req, res) => {
    try {
        const { name, description, avatar, memberIds } = req.body;
        const creatorId = req.user._id; // giả sử đã xác thực qua middleware
    
        // Gộp creator vào danh sách thành viên nếu chưa có
        const allMembers = new Set(memberIds.map(id => id.toString()));
        allMembers.add(creatorId.toString());
    
        const group = await ChatGroup.create({
          name,
          description,
          avatar,
          members: Array.from(allMembers),
          admins: [creatorId],
          createdBy: creatorId,
        });
    
        res.status(201).json({ success: true, group });
      } catch (error) {
        console.error("Lỗi tạo nhóm:", error);
        res.status(500).json({ success: false, message: "Không thể tạo nhóm" });
      }
  };

// Lấy tất cả nhóm chat mà người dùng là thành viên
export const getUserChatGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatGroups = await ChatGroup.find({ members: userId })
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName")
      .sort({ updatedAt: -1 });

    res.status(200).json(chatGroups);
  } catch (error) {
    console.log("Error in getUserChatGroups controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Lấy chi tiết về một nhóm chat cụ thể
export const getChatGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const chatGroup = await ChatGroup.findById(groupId)
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName");

    if (!chatGroup) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra xem người dùng có phải là thành viên không
    if (!chatGroup.members.some(member => member._id.toString() === userId.toString())) {
      return res.status(403).json({ msg: "You are not a member of this group" });
    }

    res.status(200).json(chatGroup);
  } catch (error) {
    console.log("Error in getChatGroupDetails controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Cập nhật thông tin nhóm chat
export const updateChatGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    const chatGroup = await ChatGroup.findById(groupId);
    if (!chatGroup) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra xem người dùng có phải là admin không
    if (!chatGroup.admins.includes(userId)) {
      return res.status(403).json({ msg: "Only administrators can update group information" });
    }

    // Cập nhật avatar nếu có
    let avatarUrl = chatGroup.avatar;
    if (req.body.avatar) {
      const uploadRes = await cloudinary.uploader.upload(req.body.avatar);
      avatarUrl = uploadRes.secure_url;
    }

    chatGroup.name = name || chatGroup.name;
    chatGroup.description = description || chatGroup.description;
    chatGroup.avatar = avatarUrl;
    chatGroup.updatedAt = Date.now();

    await chatGroup.save();

    const updatedGroup = await ChatGroup.findById(groupId)
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName");

    // Thông báo cho tất cả thành viên về cập nhật nhóm
    updatedGroup.members.forEach(member => {
      if (member._id.toString() !== userId.toString()) {
        const memberSocketIds = getSocketIdsByUserId(member._id.toString());
        if (memberSocketIds && memberSocketIds.length > 0) {
          memberSocketIds.forEach(socketId => {
            io.to(socketId).emit("groupChatUpdated", updatedGroup);
          });
        }
      }
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in updateChatGroup controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Thêm thành viên vào nhóm
export const addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIds } = req.body; // Mảng các ID người dùng để thêm vào
    const adminId = req.user._id;

    const chatGroup = await ChatGroup.findById(groupId);
    if (!chatGroup) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra quyền admin
    if (!chatGroup.admins.includes(adminId)) {
      return res.status(403).json({ msg: "Only administrators can add members" });
    }

    // Thêm các thành viên mới nếu chưa có trong nhóm
    const currentMemberIds = chatGroup.members.map(id => id.toString());
    const newMemberIds = userIds.filter(id => !currentMemberIds.includes(id));

    if (newMemberIds.length === 0) {
      return res.status(400).json({ msg: "All users are already members" });
    }

    // Kiểm tra xem các ID người dùng mới có tồn tại không
    const usersExist = await User.find({ _id: { $in: newMemberIds } });
    if (usersExist.length !== newMemberIds.length) {
      return res.status(400).json({ msg: "One or more user IDs are invalid" });
    }

    chatGroup.members = [...chatGroup.members, ...newMemberIds];
    chatGroup.updatedAt = Date.now();
    await chatGroup.save();

    const updatedGroup = await ChatGroup.findById(groupId)
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName");

    // Thông báo cho các thành viên mới
    newMemberIds.forEach(memberId => {
      const memberSocketIds = getSocketIdsByUserId(memberId);
      if (memberSocketIds && memberSocketIds.length > 0) {
        memberSocketIds.forEach(socketId => {
          io.to(socketId).emit("addedToGroup", updatedGroup);
        });
      }
    });

    // Thông báo cho các thành viên hiện tại về thành viên mới
    currentMemberIds.forEach(memberId => {
      if (memberId !== adminId.toString()) {
        const memberSocketIds = getSocketIdsByUserId(memberId);
        if (memberSocketIds && memberSocketIds.length > 0) {
          memberSocketIds.forEach(socketId => {
            io.to(socketId).emit("newMembersAdded", {
              groupId: chatGroup._id,
              newMembers: usersExist.map(user => ({
                _id: user._id,
                fullName: user.fullName,
                profilePic: user.profilePic
              }))
            });
          });
        }
      }
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in addGroupMember controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Xóa thành viên khỏi nhóm
export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId: memberIdToRemove } = req.params;
    const adminId = req.user._id;

    const chatGroup = await ChatGroup.findById(groupId);
    if (!chatGroup) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Người dùng có thể tự rời nhóm hoặc admin có thể xóa thành viên
    const isSelfLeaving = adminId.toString() === memberIdToRemove;
    const isAdmin = chatGroup.admins.some(id => id.toString() === adminId.toString());

    if (!isSelfLeaving && !isAdmin) {
      return res.status(403).json({ msg: "Only administrators can remove members" });
    }

    // Không thể xóa người tạo nhóm
    if (memberIdToRemove === chatGroup.createdBy.toString() && !isSelfLeaving) {
      return res.status(403).json({ msg: "Cannot remove the group creator" });
    }

    // Xóa thành viên khỏi danh sách members và admins nếu họ là admin
    chatGroup.members = chatGroup.members.filter(id => id.toString() !== memberIdToRemove);
    chatGroup.admins = chatGroup.admins.filter(id => id.toString() !== memberIdToRemove);

    // Nếu nhóm không còn thành viên nào, xóa nhóm
    if (chatGroup.members.length === 0) {
      await ChatGroup.findByIdAndDelete(groupId);
      return res.status(200).json({ msg: "Group has been deleted as it has no members left" });
    }

    // Nếu nhóm không còn admin nào, chọn thành viên tiếp theo làm admin
    if (chatGroup.admins.length === 0 && chatGroup.members.length > 0) {
      chatGroup.admins = [chatGroup.members[0]];
    }

    chatGroup.updatedAt = Date.now();
    await chatGroup.save();

    // Thông báo cho người bị xóa
    const removedUserSocketIds = getSocketIdsByUserId(memberIdToRemove);
    if (removedUserSocketIds && removedUserSocketIds.length > 0) {
      removedUserSocketIds.forEach(socketId => {
        io.to(socketId).emit("removedFromGroup", { groupId: chatGroup._id });
      });
    }

    // Thông báo cho các thành viên còn lại
    chatGroup.members.forEach(memberId => {
      if (memberId.toString() !== adminId.toString()) {
        const memberSocketIds = getSocketIdsByUserId(memberId.toString());
        if (memberSocketIds && memberSocketIds.length > 0) {
          memberSocketIds.forEach(socketId => {
            io.to(socketId).emit("memberRemoved", {
              groupId: chatGroup._id,
              removedMemberId: memberIdToRemove
            });
          });
        }
      }
    });

    const updatedGroup = await ChatGroup.findById(groupId)
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName");

    res.status(200).json(updatedGroup || { msg: "Member removed successfully" });
  } catch (error) {
    console.log("Error in removeGroupMember controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Thêm quản trị viên mới
export const promoteToAdmin = async (req, res) => {
  try {
    const { groupId, userId: newAdminId } = req.params;
    const adminId = req.user._id;

    const chatGroup = await ChatGroup.findById(groupId);
    if (!chatGroup) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra quyền admin
    if (!chatGroup.admins.includes(adminId)) {
      return res.status(403).json({ msg: "Only administrators can promote members" });
    }

    // Kiểm tra xem người được thăng cấp có phải là thành viên không
    if (!chatGroup.members.includes(newAdminId)) {
      return res.status(400).json({ msg: "User is not a member of this group" });
    }

    // Kiểm tra xem người dùng đã là admin chưa
    if (chatGroup.admins.includes(newAdminId)) {
      return res.status(400).json({ msg: "User is already an administrator" });
    }

    chatGroup.admins.push(newAdminId);
    chatGroup.updatedAt = Date.now();
    await chatGroup.save();

    // Thông báo cho người được thăng cấp
    const newAdminSocketIds = getSocketIdsByUserId(newAdminId);
    if (newAdminSocketIds && newAdminSocketIds.length > 0) {
      newAdminSocketIds.forEach(socketId => {
        io.to(socketId).emit("promotedToAdmin", { groupId: chatGroup._id });
      });
    }

    const updatedGroup = await ChatGroup.findById(groupId)
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in promoteToAdmin controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Gỡ bỏ quyền quản trị viên
export const demoteFromAdmin = async (req, res) => {
  try {
    const { groupId, userId: adminToRemove } = req.params;
    const adminId = req.user._id;

    const chatGroup = await ChatGroup.findById(groupId);
    if (!chatGroup) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // Kiểm tra quyền admin
    if (!chatGroup.admins.includes(adminId)) {
      return res.status(403).json({ msg: "Only administrators can demote other admins" });
    }

    // Không thể gỡ quyền admin của người tạo nhóm
    if (adminToRemove === chatGroup.createdBy.toString()) {
      return res.status(403).json({ msg: "Cannot demote the group creator" });
    }

    // Kiểm tra xem người bị gỡ có phải là admin không
    if (!chatGroup.admins.includes(adminToRemove)) {
      return res.status(400).json({ msg: "User is not an administrator" });
    }

    chatGroup.admins = chatGroup.admins.filter(id => id.toString() !== adminToRemove);
    chatGroup.updatedAt = Date.now();
    await chatGroup.save();

    // Thông báo cho người bị gỡ quyền
    const demotedAdminSocketIds = getSocketIdsByUserId(adminToRemove);
    if (demotedAdminSocketIds && demotedAdminSocketIds.length > 0) {
      demotedAdminSocketIds.forEach(socketId => {
        io.to(socketId).emit("demotedFromAdmin", { groupId: chatGroup._id });
      });
    }

    const updatedGroup = await ChatGroup.findById(groupId)
      .populate("members", "fullName profilePic")
      .populate("admins", "fullName")
      .populate("createdBy", "fullName");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in demoteFromAdmin controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};