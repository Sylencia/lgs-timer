import type { ServerWebSocket } from 'bun';
import type { TimerData } from '../../types/messageTypes';

type WebSocketData = {
  channelId: string;
};

interface RoomData {
  timers: TimerData[];
  clients: Set<ServerWebSocket<WebSocketData>>;
}

const rooms = new Map<string, RoomData>();

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
      console.log('Opened connection', ws);
    },
    close(ws) {
      removeClientFromAllRooms(ws);
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
  if (!rooms.has(room)) {
    rooms.set(room, {
      timers: [],
      clients: new Set(),
    });
  }
  ws.subscribe(room);
  rooms.get(room)!.clients.add(ws);
  server.publish(
    room,
    JSON.stringify({
      messageType: 'roomUpdate',
      clients: rooms.get(room)!.clients.size,
    })
  );
  ws.send(JSON.stringify(rooms.get(room)!.timers));
};

const handleUnsubscribe = (ws: ServerWebSocket<WebSocketData>, room: string) => {
  ws.unsubscribe(room);
  rooms.get(room)!.clients.delete(ws);

  server.publish(
    room,
    JSON.stringify({
      messageType: 'roomUpdate',
      clients: rooms.get(room)!.clients.size,
    })
  );
};

const handleCreateTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timer: TimerData) => {
  console.log('Creating timer', timer);
  const roomData = rooms.get(room);
  if (roomData && roomData.clients.has(ws)) {
    roomData.timers.push(timer);
    server.publish(room, JSON.stringify(roomData.timers));
  }
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

const removeClientFromAllRooms = (ws: ServerWebSocket<WebSocketData>) => {
  for (const room of rooms.keys()) {
    handleUnsubscribe(ws, room);
  }
};

console.log(`Listening on ${server.hostname}:${server.port}`);
