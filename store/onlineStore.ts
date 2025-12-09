'use client';
import { create } from 'zustand';

interface OnlineState {
  online: boolean;
  setOnline: (status: boolean) => void;
}

export const useOnlineStore = create<OnlineState>((set) => ({
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
  setOnline: (status) => set({ online: status }),
}));
