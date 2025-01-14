import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://localhost:3000';

export const Welcome = () => {
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
  });

  const handleCreateNewRoom = () => {
    sendJsonMessage({ type: 'createRoom' });
  };

  return (
    <>
      <div>Welcome to LGS Timer</div>
      <button onClick={handleCreateNewRoom}>Create New Room</button>
      <div>
        <label htmlFor="roomCode">Enter Room Code</label>
        <input id="roomCode" placeholder="Room Code"></input>
      </div>
    </>
  );
};
