import { create } from 'zustand';

export type RoomMode = 'view' | 'edit' | 'none';

interface RoomState {
  room: string;
  mode: RoomMode;
  setRoomInfo: (room: string, mode: RoomMode) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  room: '',
  mode: 'none',
  setRoomInfo: (room: string, mode: RoomMode) => set({ room, mode }),
}));
