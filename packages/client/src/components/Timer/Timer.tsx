import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { RoomAccess, type TimerData } from '@lgs-timer/types';
import { formatTime } from '@lgs-timer/utils';
import './Timer.css';
import { useRoomStore } from '@stores/useRoomStore';

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
    <div className="timer-container">
      <div className="timer-details">
        <div className="timer-details-info">
          <h2 className="timer-details-name">{eventName}</h2>
          <p className="timer-details-round">
            Round {currentRoundNumber} of {rounds}
          </p>
        </div>
        {mode === RoomAccess.EDIT && (
          <div className="timer-button-container">
            <button onClick={() => onToggleTimer(id)}>{running ? 'Pause' : 'Start'}</button>
            <Popover
              isOpen={isPopoverOpen}
              positions={['bottom', 'top']}
              padding={10}
              onClickOutside={() => setIsPopoverOpen(false)}
              content={() => (
                <div className="timer-controls">
                  <div className="timer-controls-grid-4">
                    <button onClick={() => onAdjustTime(id, -60 * 1000)}>-1m</button>
                    <button onClick={() => onAdjustTime(id, -10 * 1000)}>-10s</button>
                    <button onClick={() => onAdjustTime(id, 10 * 1000)}>+10s</button>
                    <button onClick={() => onAdjustTime(id, 60 * 1000)}>+1m</button>
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

                  <div className="space-y-1">
                    <label htmlFor="eventName" className="timer-event-label">
                      Event Name
                    </label>
                    <input
                      id="eventName"
                      value={eventName}
                      onChange={(e) => onUpdateEventName(id, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              )}
            >
              <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="timer-button">
                Controls
              </button>
            </Popover>
          </div>
        )}
      </div>

      <div className="timer-details-time-container">
        <p className="timer-details-time">{formatTime(timeRemaining)}</p>
      </div>
    </div>
  );
};
