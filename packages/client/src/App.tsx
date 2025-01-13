import { useState } from 'react';
import './App.css';
import useWebSocket from 'react-use-websocket';
import type { SubscribeMessage, CreateTimerMessage, DeleteTimerMessage, TimerData } from '@lgs-timer/types';
import { TimerGrid } from './components/TimerGrid';

const WS_URL = 'ws://localhost:3000';

const generateRoomId = (length: number = 4): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let roomId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters[randomIndex];
  }
  return roomId;
};

function App() {
  const [timers, setTimers] = useState<Array<TimerData>>([]);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onOpen: () => {
      console.log('Opened connection');
    },
    onMessage: (message) => {
      const messageData: string = message.data;

      try {
        const data = JSON.parse(messageData);

        switch (data.type) {
          case 'roomUpdate':
            handleRoomUpdate(data.timers);
            break;
          default:
            console.warn('Unknown message type', data);
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    },
  });

  const handleRoomUpdate = (timers: Array<TimerData>) => {
    setTimers(timers);
  };

  const handleUpdateTimer = (timer: TimerData) => {
    sendJsonMessage({
      type: 'updateTimer',
      room: 'abcd',
      timer,
    });
  };

  const handleRemoveTimer = (id: string) => {
    setTimers(timers.filter((timer) => timer.id !== id));

    sendJsonMessage({
      type: 'deleteTimer',
      room: 'abcd',
      id,
    } as DeleteTimerMessage);
  };

  return (
    <>
      <div className="card">
        <button onClick={() => sendJsonMessage({ type: 'subscribe', room: 'abcd' } as SubscribeMessage)}>
          send msg
        </button>
        <button
          onClick={() =>
            sendJsonMessage({
              type: 'createTimer',
              room: 'abcd',
              timer: {
                id: generateRoomId(),
                endTime: Date.now() + 10 * 60 * 1000,
                timeRemaining: 10 * 60 * 1000,
                running: false,
                eventName: 'Test Event',
                rounds: 3,
                roundTime: 10 * 60 * 1000,
                hasDraft: false,
                draftTime: 0,
                currentRoundNumber: 1,
                currentRoundLength: 10 * 60 * 1000,
              },
            } as CreateTimerMessage)
          }
        >
          create timer
        </button>
      </div>
      <TimerGrid timers={timers} onRemoveTimer={handleRemoveTimer} onUpdateTimer={handleUpdateTimer} />
    </>
  );
}

export default App;
