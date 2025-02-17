import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useFriendStore = create((set, get) => ({
  type: 1,
  friends: [],
  requestsFriend: [],
  invitatesFriend: [],
  isFriendsLoading: false,

  setType: (newType) => set({ type: newType }),

  getFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friend/friends");
      set({ friends: res.data });
    } catch (error) {
      console.log("Lỗi khi lấy danh sách bạn bè:", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  getRequsetFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friend/get-requests");
      set({ requestsFriend: res.data });
    } catch (error) {
      console.log("Lỗi khi lấy danh sách yêu cầu kết bạn:", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  getInvitateFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/friend/get-invitates");
      set({ invitatesFriend: res.data });
    } catch (error) {
      console.log("Lỗi khi lấy danh sách lời mời kết bạn:", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  removeFriend: async (idUser) => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.post("/friend/remove-friend", { idRemove: idUser });

      if (res.status === 200) {
        console.log("Đã xóa bạn bè thành công:", res.data);
        set((state) => ({
          friends: state.friends.filter(friend => friend._id !== idUser),
        }));
      }
    } catch (error) {
      console.log("Lỗi khi xóa bạn bè:", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  cancleRequest: async (idUser) => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.post("/friend/cancle-request", { idCancle : idUser });

      if (res.status === 201) {
        console.log("Đã hủy yêu cầu kết bạn:", res.data);
        set((state) => ({
          requestsFriend: state.requestsFriend.filter(friend => friend._id !== idUser),
        }));
      }
    } catch (error) {
      console.log("Lỗi khi hủy yêu cầu kết bạn:", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  acceptInvitation: async (idUser) => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.post("/friend/accept-friend", { idAccept: idUser});
      console.log(
        res.data
      )
      if (res.status === 201) {
        console.log("Đã chấp nhận lời mời kết bạn:", res.data);
        set((state) => ({
          invitatesFriend: state.invitatesFriend.filter(user => user._id !== idUser),
          
          friends: [...state.friends, res.data.user],
        }));
      }
    } catch (error) {
      console.log("Lỗi khi chấp nhận lời mời kết bạn:", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },
}));
