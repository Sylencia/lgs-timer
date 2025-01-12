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
