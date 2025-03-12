import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const usePostStore = create((set, get) => ({
  posts: [],
  page: 1,
  limit: 10,
  isLoading: false,

  createPost: async (data) => {
    set({ isLoading: true });
    try {

      // const res = await axiosInstance.post(`/post/create-post`);
      // if(res.status==200){
        
      // }

    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      set({ isLoading: false });
    }
  },

  getPosts: async () => {
    set({ isLoading: true });
    try {
      const { page, limit } = get();
      const res = await axiosInstance.get(`/post/get-post?page=${page}&limit=${limit}`);
      set({ posts: res.data.posts });

    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      set({ isLoading: false });
    }
  },

}));
