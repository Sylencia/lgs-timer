import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import type { TimerData } from '@lgs-timer/types';
import { formatTime } from '../../utils/formatTime';
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

  return (
    <div className="w-full h-[12.5rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
      <div className="flex-1 p-4 flex items-center">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-xl font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{eventName}</h2>
          <p className="text-lg">
            Round {currentRoundNumber} of {rounds}
          </p>
        </div>
        <div className="flex-shrink-0">
          <p className="text-5xl font-mono">{formatTime(timeRemaining)}</p>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center">
        <button onClick={() => onToggleTimer(id)}>{running ? 'Pause' : 'Start'}</button>
        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom', 'right', 'left', 'top']}
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
                <label htmlFor="eventName" className="text-xs">
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
    </div>
  );
};
