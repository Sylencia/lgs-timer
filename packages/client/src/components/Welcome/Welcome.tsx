import { EditRoomInfoMessage, RoomAccess, ViewOnlyRoomInfoMessage, type RoomInfoMessage } from '@lgs-timer/types';
import { useRoomStore } from '@stores/useRoomStore';
import { FormEvent, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import './Welcome.css';

export const Welcome = () => {
  const updateEditRoomInfo = useRoomStore((state) => state.updateEditRoomInfo);
  const updateViewRoomInfo = useRoomStore((state) => state.updateViewOnlyRoomInfo);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');

  const { sendJsonMessage } = useWebSocket(import.meta.env.VITE_WS_URL!, {
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
    <div className="welcome">
      <h1 className="welcome-heading">Create and sync timers for multiple events at your local game store.</h1>

      <div className="welcome-room-select">
        <button onClick={handleCreateNewRoom}>Create New Room</button>
        <p>OR</p>
        <form className="welcome-join-form" onSubmit={handleJoinRoom}>
          <input
            className="room-input"
            id="roomCode"
            type="text"
            required
            value={roomCodeInput}
            placeholder="Code"
            pattern="[a-zA-Z]{4}"
            size={4}
            maxLength={4}
            title="Room codes are 4 letters long"
            onChange={(event) => {
              setRoomCodeInput(event.target.value);
            }}
          ></input>
          <button type="submit" disabled={!roomCodeInput}>
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};
