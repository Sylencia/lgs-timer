import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useShallow } from 'zustand/shallow';
import clsx from 'clsx';
import { useRoomStore } from '@stores/useRoomStore';
import './Header.css';

export const Header = () => {
  const { readyState } = useWebSocket('ws://localhost:3000', {
    share: true,
  });

  const { room, mode } = useRoomStore(useShallow((state) => ({ room: state.room, mode: state.mode })));

  const readyStateText = {
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing...',
    [ReadyState.CLOSED]: 'Disconnected',
  }[readyState];

  return (
    <header className="header">
      <div className="header-container container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="header-title">LGS Timer</h1>
        {mode !== 'none' && (
          <div className="header-room-info">
            <p className="header-room-code">Room: {room}</p>
            <p className="header-room-mode">Mode: {mode}</p>
          </div>
        )}
        <div className="header-connection-status">
          <div
            className={clsx('header-status-icon', {
              'header-status-connecting': readyState === ReadyState.CONNECTING,
              'header-status-open': readyState === ReadyState.OPEN,
              'header-status-closed': readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING,
            })}
          ></div>
          {readyStateText}
        </div>
      </div>
    </header>
  );
};
