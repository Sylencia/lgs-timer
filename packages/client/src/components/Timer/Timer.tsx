import { useState, useEffect, useCallback } from 'react';
import { Popover } from 'react-tiny-popover';
import type { TimerData } from '@lgs-timer/types';
import { currentTimeToNearestSecond, formatTime } from '../../utils/formatTime';
import './Timer.css';

interface ExtraTimerProps {
  timerData: TimerData;
  onRemoveTimer: (id: string) => void;
  onUpdateTimer: (timer: TimerData) => void;
}

type TimerProps = ExtraTimerProps;

export const Timer = ({ onRemoveTimer, onUpdateTimer, timerData }: TimerProps) => {
  const [timer, setTimer] = useState<TimerData>(timerData);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    console.log(timerData, formatTime(timerData.endTime - currentTimeToNearestSecond()));
    setTimer(timerData);
    setTimeRemaining(timerData.running ? timerData.endTime - currentTimeToNearestSecond() : timerData.timeRemaining);
    setIsRunning(timerData.running);
  }, [timerData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        console.log('tick', formatTime(timer.endTime - currentTimeToNearestSecond()));
        setTimeRemaining(timer.endTime - currentTimeToNearestSecond());
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const startTimer = useCallback(() => {
    console.log(currentTimeToNearestSecond() + timer.timeRemaining);
    const newTimer = { ...timer, running: true, endTime: currentTimeToNearestSecond() + timer.timeRemaining };
    setIsRunning(true);
    setTimer(newTimer);
    onUpdateTimer(newTimer);
  }, [onUpdateTimer, timer]);

  const pauseTimer = useCallback(() => {
    const newTimer = { ...timer, running: false, timeRemaining };
    setIsRunning(false);
    setTimer(newTimer);
    onUpdateTimer(newTimer);
  }, [onUpdateTimer, timer, timeRemaining]);

  const adjustTime = useCallback(
    (amount: number) => {
      const newTimeRemaining = timeRemaining + amount;
      const newEndTime = currentTimeToNearestSecond() + newTimeRemaining;
      const newTimer = { ...timer, timeRemaining: newTimeRemaining, endTime: newEndTime };
      setTimer(newTimer);
      onUpdateTimer(newTimer);
    },
    [onUpdateTimer, timer, timeRemaining]
  );

  const adjustRounds = useCallback(
    (amount: number) => {
      const newTimer = { ...timer, rounds: Math.max(1, timer.rounds + amount) };
      setTimer(newTimer);
      onUpdateTimer(newTimer);
    },
    [onUpdateTimer, timer]
  );

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
          <p className="text-5xl font-mono">{formatTime(timeRemaining)}</p>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center">
        <button onClick={isRunning ? pauseTimer : startTimer}>{isRunning ? 'Pause' : 'Start'}</button>
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
