import type { ServerWebSocket } from 'bun';
import type { ClientMessage, TimerData } from '@lgs-timer/types';

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
      console.log('Opened connection');
    },
    close(ws) {
      removeClientFromAllRooms(ws);
      console.log('Closed connection');
    },
    // this is called when a message is received
    async message(ws, message) {
      try {
        const data: ClientMessage = JSON.parse(message as string);

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
          case 'updateTimer':
            handleUpdateTimer(ws, data.room, data.timer);
            break;
          case 'deleteTimer':
            handleDeleteTimer(ws, data.room, data.id);
            break;
          default:
            console.warn('Unknown message type', data);
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

  // Send the current state of the room to the client
  ws.send(
    JSON.stringify({
      type: 'roomUpdate',
      timers: rooms.get(room)!.timers,
    })
  );
};

const handleUnsubscribe = (ws: ServerWebSocket<WebSocketData>, room: string) => {
  ws.unsubscribe(room);
  rooms.get(room)!.clients.delete(ws);
};

const handleCreateTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timer: TimerData) => {
  const roomData = rooms.get(room);
  if (roomData && roomData.clients.has(ws)) {
    roomData.timers.push(timer);
    server.publish(
      room,
      JSON.stringify({
        type: 'roomUpdate',
        timers: rooms.get(room)!.timers,
      })
    );
  }
};

const handleUpdateTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timer: TimerData) => {
  console.log(timer);
  const roomData = rooms.get(room);
  if (roomData && roomData.clients.has(ws)) {
    const existingTimer = roomData.timers.find((t) => t.id === timer.id);
    if (existingTimer) {
      Object.assign(existingTimer, timer);
      server.publish(
        room,
        JSON.stringify({
          type: 'roomUpdate',
          timers: rooms.get(room)!.timers,
        })
      );
    }
  }
};

const handleDeleteTimer = (ws: ServerWebSocket<WebSocketData>, room: string, timerId: string) => {
  const roomData = rooms.get(room);
  if (roomData && roomData.clients.has(ws)) {
    const idx = roomData.timers.findIndex((timer) => timer.id === timerId);
    if (idx !== -1) {
      roomData.timers.splice(idx, 1);

      server.publish(
        room,
        JSON.stringify({
          type: 'roomUpdate',
          timers: rooms.get(room)!.timers,
        })
      );
    }
  }
};

const removeClientFromAllRooms = (ws: ServerWebSocket<WebSocketData>) => {
  for (const room of rooms.keys()) {
    handleUnsubscribe(ws, room);
  }
};

console.log(`Listening on ${server.hostname}:${server.port}`);
