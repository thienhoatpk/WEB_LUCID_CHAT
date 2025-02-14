import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useFriendStore = create((set, get) => ({
    type : 1,
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
        console.log("Loi get Friend in useFriendStore")

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
        console.log("Loi get Friemd in useFriendStore")

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
        console.log("Loi get Friemd in useFriendStore")

    } finally {
        set({ isFriendsLoading: false });
      }
    },

    removeFriend: async (idFriend) => {
      console.log("first")
      set({ isFriendsLoading: true });
      try {
        const res = await axiosInstance.post("/friend/remove-friend", idFriend);
        // set({ invitatesFriend: res.data });
        
      } catch (error) {
        console.log("Error remove Friend in useFriendStore ",error)

    } finally {
        set({ isFriendsLoading: false });
      }
    }

    // setType: (type) => set({type : type}),

    
    
    // getMessages: async (userId) => {
    //   set({ isMessagesLoading: true });
    //   try {
    //     const res = await axiosInstance.get(`/messages/${userId}`);
    //     set({ messages: res.data });
    //   } catch (error) {
    //     toast.error(error.response.data.message);
    //   } finally {
    //     set({ isMessagesLoading: false });
    //   }
    // },
    
    // sendMessage: async (messageData) => {
    //   const { selectedUser, messages } = get();
    //   try {
    //     const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    //     set({ messages: [...messages, res.data] });
    //   } catch (error) {
    //     toast.error(error.response.data.message);
    //   }
    // },
  
    // subscribeToMessages: () => {
    //   const { selectedUser } = get();
    //   if (!selectedUser) return;
  
    //   const socket = useAuthStore.getState().socket;
  
    //   socket.on("newMessage", (newMessage) => {
    //     const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
    //     if (!isMessageSentFromSelectedUser) return;
  
    //     set({
    //       messages: [...get().messages, newMessage],
    //     });
    //   });
    // },
  
    // unsubscribeFromMessages: () => {
    //   const socket = useAuthStore.getState().socket;
    //   socket.off("newMessage");
    // },
  
    // setSelectedUser: (selectedUser) => set({ selectedUser }),
  }));