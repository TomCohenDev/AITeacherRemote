import { create } from "zustand";
import type { SessionState } from "../types";

interface SessionStore extends SessionState {
  // Actions
  setCode: (code: string) => void;
  setStatus: (status: SessionState["status"]) => void;
  setUserInfo: (userInfo: SessionState["userInfo"]) => void;
  connect: (code: string) => Promise<void>;
  disconnect: () => void;
  reset: () => void;
}

const initialState: SessionState = {
  code: "",
  status: "disconnected",
  userInfo: undefined,
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,

  setCode: (code: string) => {
    set({ code: code.toUpperCase() });
  },

  setStatus: (status: SessionState["status"]) => {
    set({ status });
  },

  setUserInfo: (userInfo: SessionState["userInfo"]) => {
    set({ userInfo });
  },

  connect: async (code: string) => {
    set({ status: "connecting", code: code.toUpperCase() });

    try {
      // TODO: Implement actual API call to n8n backend
      // For now, simulate connection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({
        status: "connected",
        code: code.toUpperCase(),
        userInfo: {
          id: "temp-user",
          name: "Student",
        },
      });
    } catch (error) {
      set({ status: "disconnected" });
      throw error;
    }
  },

  disconnect: () => {
    set(initialState);
  },

  reset: () => {
    set(initialState);
  },
}));
