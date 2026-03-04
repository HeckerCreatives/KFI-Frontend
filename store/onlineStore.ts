'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnlineState {
  online: boolean;
  setOnline: (status: boolean) => void;
}

export const useOnlineStore = create<OnlineState>()(
  persist(
    (set) => ({
      online: typeof navigator !== "undefined" ? navigator.onLine : true,
      setOnline: (status) => set({ online: status }),
    }),
    {
      name: 'online-storage',
    }
  )
);
