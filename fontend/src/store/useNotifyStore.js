import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useNotifyStore = create((set, get) => ({
    mapNotify: [],
    type: 0,
    users: [],
    userReceive: null,




    notifyNewMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.on("receiveNotification", (message) => {
            console.log("Received notification:", message);  
            toast.success(`📩 ${message}`, { position: "top-right", autoClose: 1000 });
          });
    },

}));