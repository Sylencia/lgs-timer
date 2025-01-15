import { RoomAccess } from '@lgs-timer/types';
import { EyeOpenIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useRoomStore } from '@stores/useRoomStore';
import clsx from 'clsx';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useShallow } from 'zustand/shallow';
import logo from '../../assets/logo.svg';
import './Header.css';

export const Header = () => {
  const { readyState } = useWebSocket(import.meta.env.VITE_WS_URL!, {
    share: true,
  });

  const { editRoomId, viewOnlyRoomId, mode } = useRoomStore(
    useShallow((state) => ({ editRoomId: state.editRoomId, viewOnlyRoomId: state.viewOnlyRoomId, mode: state.mode })),
  );

  const readyStateText = {
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing...',
    [ReadyState.CLOSED]: 'Disconnected',
  }[readyState];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="Logo" />
          {mode !== RoomAccess.NONE && (
            <div className="header-room-info">
              {mode === RoomAccess.EDIT && (
                <div className="pill">
                  <Pencil1Icon /> {editRoomId}
                </div>
              )}
              <div className="pill">
                <EyeOpenIcon /> {viewOnlyRoomId}
              </div>
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
