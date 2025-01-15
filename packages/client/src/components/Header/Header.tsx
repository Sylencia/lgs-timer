import { ExpandablePill } from '@components/ExpandablePill';
import { RoomAccess } from '@lgs-timer/types';
import { ExitIcon, EyeOpenIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useRoomStore } from '@stores/useRoomStore';
import clsx from 'clsx';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import logo from '../../assets/logo.svg';
import './Header.css';

export const Header = () => {
  const { readyState, sendJsonMessage } = useWebSocket(import.meta.env.VITE_WS_URL!, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onMessage: (message) => {
      const messageData: string = message.data;

      try {
        const data = JSON.parse(messageData);

        if (data.type === 'unsubscribeSuccess') {
          resetRoomStore();
        }

        switch (data.type) {
          case 'roomInfo':
            break;
          case 'roomUpdate':
            break;
          case 'unsubscribeSuccess':
            resetRoomStore();
            break;
          default:
            console.warn('Unknown message type', data);
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    },
  });

  const { editRoomId, viewOnlyRoomId, mode, getRoomCode, resetRoomStore } = useRoomStore();

  const readyStateText = {
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Disconnected',
  }[readyState];

  const handleLeaveRoom = () => {
    sendJsonMessage({
      type: 'unsubscribe',
      accessId: getRoomCode(),
    });
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="Logo" />
          {mode !== RoomAccess.NONE && (
            <div className="header-room-info">
              {mode === RoomAccess.EDIT && (
                <ExpandablePill icon={<Pencil1Icon />} text={editRoomId} className="edit-pill" />
              )}
              <ExpandablePill icon={<EyeOpenIcon />} text={viewOnlyRoomId} className="view-pill" />
              <ExpandablePill icon={<ExitIcon />} text="Leave Room" onClick={handleLeaveRoom} className="leave-pill" />
            </div>
          )}
        </div>
        <div className="header-connection-status">
          <div
            className={clsx('header-status-icon', {
              'header-status-connecting': readyState === ReadyState.CONNECTING,
              'header-status-open': readyState === ReadyState.OPEN,
              'header-status-closed': readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING,
            })}
            title={readyStateText}
          ></div>
        </div>
      </div>
    </header>
  );
};
