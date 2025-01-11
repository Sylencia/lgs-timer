import type { ServerWebSocket } from 'bun';

type WebSocketData = {
  channelId: string;
};

type TimerData = {
  id: number;
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

const server = Bun.serve<WebSocketData>({
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response('Hello world!');
  },
  websocket: {
    open(ws) {
      console.log('Opened connection');
    },
    close(ws) {
      console.log('Closed connection');
    },
    // this is called when a message is received
    async message(ws, message) {
      try {
        const data = JSON.parse(message as string);

        switch (data.type) {
          case 'subscribe':
            handleSubscribe(ws, data.room);
            break;
          case 'unsubscribe':
            handleUnsubscribe(ws, data.room);
            break;
          case 'createTimer':
            handleCreateTimer(ws, data.room, data.timer);
            break;
          case 'startTimer':
            handleStartTimer(ws, data.room, data.timerId);
            break;
          case 'pauseTimer':
            handlePauseTimer(ws, data.room, data.timerId);
            break;
          case 'deleteTimer':
            handleDeleteTimer(ws, data.room, data.timerId);
            break;
          default:
            console.warn('Unknown message type', data.type);
        }
      } catch (e) {
        console.error('Invalid message format: ', message, e);
      }
    },
  },
});

const handleSubscribe = (ws: ServerWebSocket<WebSocketData>, room: string) => {
  // Subscribe to a room
};

const handleUnsubscribe = (ws: ServerWebSocket<WebSocketData>, room: string) => {
  // Unsubscribe from a room
};

const handleCreateTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timer: TimerData) => {
  // Create a timer in the room
};

const handleStartTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timerId: number) => {
  // Start a specific timer in the room
};

const handlePauseTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timerId: number) => {
  // Pause a specific timer in the room
};

const handleDeleteTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timerId: number) => {
  // Delete a specific timer in the room
};

console.log(`Listening on ${server.hostname}:${server.port}`);
