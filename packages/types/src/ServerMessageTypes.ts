import type { RoomMode } from './RoomTypes';

export interface ViewOnlyRoomInfoMessage {
  type: 'roomInfo';
  accessLevel: RoomMode;
  viewAccessId: string;
}

export interface EditRoomInfoMessage extends ViewOnlyRoomInfoMessage {
  editAccessId: string;
}

export type RoomInfoMessage = ViewOnlyRoomInfoMessage | EditRoomInfoMessage;
