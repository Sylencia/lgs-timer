import { EditRoomInfoMessage, RoomAccess, ViewOnlyRoomInfoMessage, type RoomInfoMessage } from '@lgs-timer/types';
import { useRoomStore } from '@stores/useRoomStore';
import { FormEvent, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import './Welcome.css';

const WS_URL = 'ws://localhost:3000';

export const Welcome = () => {
  const updateEditRoomInfo = useRoomStore((state) => state.updateEditRoomInfo);
  const updateViewRoomInfo = useRoomStore((state) => state.updateViewOnlyRoomInfo);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onMessage: (message) => {
      const messageData: string = message.data;

      try {
        const data = JSON.parse(messageData);

        switch (data.type) {
          case 'roomInfo':
            handleRoomInfo(data);
            break;
          case 'roomUpdate':
            break;
          default:
            console.warn('Unknown message type', data);
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    },
  });

  const handleRoomInfo = (data: RoomInfoMessage) => {
    if (data.accessLevel === RoomAccess.EDIT) {
      const { editAccessId, viewAccessId, accessLevel } = data as EditRoomInfoMessage;
      updateEditRoomInfo(editAccessId, viewAccessId, accessLevel);
    } else if (data.accessLevel === RoomAccess.VIEW_ONLY) {
      const { viewAccessId, accessLevel } = data as ViewOnlyRoomInfoMessage;
      updateViewRoomInfo(viewAccessId, accessLevel);
    }
  };

  const handleCreateNewRoom = () => {
    sendJsonMessage({ type: 'createRoom' });
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({ type: 'subscribe', accessId: roomCodeInput });
    setRoomCodeInput('');
  };

  return (
    <>
      <div>Welcome to LGS Timer</div>
      <button onClick={handleCreateNewRoom}>Create New Room</button>
      <form onSubmit={handleJoinRoom}>
        <label htmlFor="roomCode">Enter Room Code</label>
        <input
          className="room-input"
          id="roomCode"
          type="text"
          required
          placeholder="Room Code"
          value={roomCodeInput}
          pattern="[a-zA-Z]{4}"
          title="Room codes are 4 letters long"
          onChange={(event) => {
            setRoomCodeInput(event.target.value);
          }}
        ></input>
        <button type="submit" disabled={!roomCodeInput}>
          Join Room
        </button>
      </form>
    </>
  );
};
