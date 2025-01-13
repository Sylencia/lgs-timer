import { useState, useEffect, useCallback } from 'react';
import { Popover } from 'react-tiny-popover';
import type { TimerData } from '@lgs-timer/types';
import { formatTime } from '../../utils/formatTime';
import './Timer.css';

interface ExtraTimerProps {
  onRemoveTimer: (id: string) => void;
}

type TimerProps = TimerData & ExtraTimerProps;

export const Timer = ({ onRemoveTimer, ...props }: TimerProps) => {
  const [timer, setTimer] = useState<TimerData>(props);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.running && timer.timeRemaining > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => ({
          ...prevTimer,
          timeRemaining: prevTimer.timeRemaining - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.running, timer.timeRemaining]);

  const toggleTimer = useCallback(() => {
    setTimer((prevTimer) => ({ ...prevTimer, running: !prevTimer.running }));
  }, []);

  const adjustTime = useCallback((amount: number) => {
    setTimer((prevTimer) => ({
      ...prevTimer,
      timeRemaining: Math.max(0, prevTimer.timeRemaining + amount),
    }));
  }, []);

  const adjustRounds = useCallback((amount: number) => {
    setTimer((prevTimer) => ({
      ...prevTimer,
      rounds: Math.max(1, prevTimer.rounds + amount),
    }));
  }, []);

  const changeRound = useCallback((direction: 'next' | 'previous') => {
    setTimer((prevTimer) => {
      const newRoundNumber =
        direction === 'next'
          ? Math.min(prevTimer.rounds, prevTimer.currentRoundNumber + 1)
          : Math.max(1, prevTimer.currentRoundNumber - 1);
      return {
        ...prevTimer,
        currentRoundNumber: newRoundNumber,
        timeRemaining: prevTimer.roundTime,
      };
    });
  }, []);

  const endEvent = useCallback(() => {
    onRemoveTimer(timer.id);
  }, [onRemoveTimer, timer.id]);

  return (
    <div className="w-full h-[12.5rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
      <div className="flex-1 p-4 flex items-center">
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-xl font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{timer.eventName}</h2>
          <p className="text-lg">
            Round {timer.currentRoundNumber} of {timer.rounds}
          </p>
        </div>
        <div className="flex-shrink-0">
          <p className="text-5xl font-mono">{formatTime(timer.timeRemaining)}</p>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center">
        <button onClick={toggleTimer}>{timer.running ? 'Pause' : 'Start'}</button>
        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom', 'right', 'left', 'top']}
          padding={10}
          onClickOutside={() => setIsPopoverOpen(false)}
          content={() => (
            <div className="timer-controls">
              <div className="timer-controls-grid-4">
                <button onClick={() => adjustTime(-60)}>-1m</button>
                <button onClick={() => adjustTime(-10)}>-10s</button>
                <button onClick={() => adjustTime(10)}>+10s</button>
                <button onClick={() => adjustTime(60)}>+1m</button>
              </div>

              <div className="timer-controls-grid-2">
                <button onClick={() => adjustRounds(-1)}>-1 Round</button>
                <button onClick={() => adjustRounds(1)}>+1 Round</button>
              </div>

              <div className="timer-controls-grid-2">
                <button onClick={() => changeRound('previous')}>Prev Round</button>
                <button onClick={() => changeRound('next')}>Next Round</button>
              </div>

              <button onClick={endEvent} className="timer-controls-end-event">
                End Event
              </button>

              <div className="space-y-1">
                <label htmlFor="eventName" className="text-xs">
                  Event Name
                </label>
                <input
                  id="eventName"
                  value={timer.eventName}
                  onChange={(e) => setTimer((prev) => ({ ...prev, eventName: e.target.value }))}
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
