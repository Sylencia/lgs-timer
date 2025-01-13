export interface SubscribeMessage {
  type: 'subscribe';
  room: string;
}

export interface UnsubscribeMessage {
  type: 'unsubscribe';
  room: string;
}

export interface CreateTimerMessage {
  type: 'createTimer';
  room: string;
  timer: TimerData;
}

export interface DeleteTimerMessage {
  type: 'deleteTimer';
  room: string;
  id: string;
}

export interface UpdateTimerMessage {
  type: 'updateTimer';
  room: string;
  timer: TimerData;
}

export type ClientMessage =
  | SubscribeMessage
  | UnsubscribeMessage
  | CreateTimerMessage
  | DeleteTimerMessage
  | UpdateTimerMessage;

export type TimerData = {
  id: string;
  endTime: number;
  timeRemaining: number;
  running: boolean;
  eventName: string;
  rounds: number;
  roundTime: number;
  hasDraft: boolean;
  draftTime: number;
  currentRoundNumber: number;
  currentRoundLength: number;
};
