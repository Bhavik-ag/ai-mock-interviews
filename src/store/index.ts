import { create } from "zustand";
import { SubmitType } from "@/constants";

const useStore = create((set) => ({
  submitType: SubmitType.START,
  conversationHistory: [],
  addMessage: (sender: string, message: string) => {
    set((state: any) => ({
      conversationHistory: [
        ...state.conversationHistory,
        { sender, message, timestamp: new Date() },
      ],
    }));
  },
  updateSubmitType: (newSubmitType: SubmitType) =>
    set({ submitType: newSubmitType }),
}));

export default useStore;
