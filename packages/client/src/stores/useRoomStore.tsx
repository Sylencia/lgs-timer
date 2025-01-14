import { create } from 'zustand';
import { RoomAccess, RoomMode } from '@lgs-timer/types';

interface RoomState {
  editRoomId: string;
  viewOnlyRoomId: string;
  mode: RoomMode;
  updateEditRoomInfo: (editRoomId: string, viewOnlyRoomId: string, mode: RoomMode) => void;
  updateViewOnlyRoomInfo: (viewOnlyRoomId: string, mode: RoomMode) => void;
  getRoomCode: () => string;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  editRoomId: '',
  viewOnlyRoomId: '',
  mode: RoomAccess.NONE,
  updateEditRoomInfo: (editRoomId: string, viewOnlyRoomId: string, mode: RoomMode) =>
    set({ editRoomId, viewOnlyRoomId, mode }),
  updateViewOnlyRoomInfo: (viewOnlyRoomId: string, mode: RoomMode) => set({ editRoomId: '', viewOnlyRoomId, mode }),
  getRoomCode: () => (get().editRoomId ? get().editRoomId : get().viewOnlyRoomId),
}));
