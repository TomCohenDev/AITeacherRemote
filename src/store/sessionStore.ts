import { create } from "zustand";
import type { SessionState } from "../types";

interface SessionStore extends SessionState {
  // Actions
  setSessionCode: (code: string) => void;
  setSessionId: (id: string) => void;
  setConnectionStatus: (status: SessionState["connectionStatus"]) => void;
  clearSession: () => void;
}

const initialState: SessionState = {
  sessionCode: null,
  sessionId: null,
  connectionStatus: "disconnected",
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,

  setSessionCode: (sessionCode: string) => {
    set({ sessionCode: sessionCode.toUpperCase() });
  },

  setSessionId: (sessionId: string) => {
    set({ sessionId });
  },

  setConnectionStatus: (connectionStatus: SessionState["connectionStatus"]) => {
    set({ connectionStatus });
  },

  clearSession: () => {
    set(initialState);
  },
}));
