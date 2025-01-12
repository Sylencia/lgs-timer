import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import useWebSocket from 'react-use-websocket';
import type { SubscribeMessage, CreateTimerMessage } from '../../../types/messageTypes';

const WS_URL = 'ws://localhost:3000';

function App() {
  const [count, setCount] = useState(0);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onOpen: () => {
      console.log('Opened connection');
    },
    onMessage: (message) => {
      console.log('Received message', message);
    },
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
                id: '1',
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
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
