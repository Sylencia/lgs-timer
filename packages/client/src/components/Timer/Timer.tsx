import { RoomAccess, type TimerData } from '@lgs-timer/types';
import { formatTime } from '@lgs-timer/utils';
import { useRoomStore } from '@stores/useRoomStore';
import clsx from 'clsx';
import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import './Timer.css';

interface TimerProps {
  timerData: TimerData;
  onRemoveTimer: (id: string) => void;
  onToggleTimer: (id: string) => void;
  onAdjustTime: (id: string, amount: number) => void;
  onAdjustRounds: (id: string, amount: number) => void;
  onChangeRound: (id: string, direction: 'next' | 'previous') => void;
  onUpdateEventName: (id: string, eventName: string) => void;
}

export const Timer = ({
  onRemoveTimer,
  onToggleTimer,
  onAdjustTime,
  onAdjustRounds,
  onChangeRound,
  onUpdateEventName,
  timerData,
}: TimerProps) => {
  const { id, timeRemaining, running, eventName, rounds, currentRoundNumber } = timerData;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const mode = useRoomStore((state) => state.mode);

  return (
    <div className={clsx('timer-container', { 'view-mode': mode === RoomAccess.VIEW_ONLY })}>
      <h2 className="timer-details-name">{eventName}</h2>
      <p className="timer-details-round">
        Round {currentRoundNumber} of {rounds}
      </p>

      {mode === RoomAccess.EDIT && (
        <div className="timer-button-container">
          <button
            className={clsx({
              'pause-button': running,
              'start-button': !running,
            })}
            onClick={() => onToggleTimer(id)}
          >
            {running ? 'Pause' : 'Start'}
          </button>

          <button onClick={() => onChangeRound(id, 'next')}>Next Round</button>

          <Popover
            isOpen={isPopoverOpen}
            positions={['bottom', 'top']}
            padding={10}
            onClickOutside={() => setIsPopoverOpen(false)}
            content={() => (
              <div className="timer-controls">
                <input
                  className="timer-controls-name"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => onUpdateEventName(id, e.target.value)}
                />

                <div className="timer-controls-grid-4">
                  <button onClick={() => onAdjustTime(id, -5 * 60 * 1000)}>-5m</button>
                  <button onClick={() => onAdjustTime(id, -1 * 60 * 1000)}>-1m</button>
                  <button onClick={() => onAdjustTime(id, 1 * 60 * 1000)}>+1m</button>
                  <button onClick={() => onAdjustTime(id, 5 * 60 * 1000)}>+5m</button>
                </div>

                <div className="timer-controls-grid-2">
                  <button onClick={() => onAdjustRounds(id, -1)}>-1 Round</button>
                  <button onClick={() => onAdjustRounds(id, 1)}>+1 Round</button>
                </div>

                <div className="timer-controls-grid-2">
                  <button onClick={() => onChangeRound(id, 'previous')}>Prev Round</button>
                  <button onClick={() => onChangeRound(id, 'next')}>Next Round</button>
                </div>

                <button onClick={() => onRemoveTimer(id)} className="timer-controls-end-event">
                  End Event
                </button>
              </div>
            )}
          >
            <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="timer-button">
              Controls
            </button>
          </Popover>
        </div>
      )}

      <p className="timer-details-time">{formatTime(timeRemaining)}</p>
    </div>
  );
};
