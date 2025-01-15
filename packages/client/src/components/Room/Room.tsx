import { useEffect, useState } from 'react';
import { Timer } from '@components/Timer';
import useWebSocket from 'react-use-websocket';
import type { CreateTimerMessage, DeleteTimerMessage, TimerData } from '@lgs-timer/types';
import { convertMinutesToMilliseconds, generateRandomId } from '@lgs-timer/utils';
import { useRoomStore } from '@stores/useRoomStore';
import './Room.css';
import { AddTimer } from '@components/AddTimer';

const WS_URL = 'ws://localhost:3000';

interface AddTimerInfo {
  eventName: string;
  rounds: number;
  roundTime: number;
  hasDraft: boolean;
  draftTime: number;
}

export const Room = () => {
  const [timers, setTimers] = useState<Array<TimerData>>([]);
  const getRoomCode = useRoomStore((state) => state.getRoomCode);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.running) {
            return { ...timer, timeRemaining: timer.endTime - Date.now() };
          }
          return timer;
        }),
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onOpen: () => {
      console.log('Opened connection');
    },
    onMessage: (message) => {
      const messageData: string = message.data;

      try {
        const data = JSON.parse(messageData);

        switch (data.type) {
          case 'roomInfo':
            break;
          case 'roomUpdate':
            handleRoomUpdate(data.timers);
            break;
          default:
            console.warn('Unknown message type', data);
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    },
  });

  // Timer Handlers

  const handleAddTimer = ({ eventName, rounds, roundTime, hasDraft, draftTime }: AddTimerInfo) => {
    const convertedDraftTime = convertMinutesToMilliseconds(draftTime ?? 0);
    const convertedRoundTime = convertMinutesToMilliseconds(roundTime);
    const timeRemaining = hasDraft ? convertedDraftTime : convertedRoundTime;

    sendJsonMessage({
      type: 'createTimer',
      accessId: getRoomCode(),
      timer: {
        id: generateRandomId(),
        endTime: Date.now() + timeRemaining,
        timeRemaining,
        running: false,
        eventName,
        rounds,
        roundTime: convertedRoundTime,
        hasDraft,
        draftTime: convertedDraftTime,
        currentRoundNumber: hasDraft ? 0 : 1,
        currentRoundLength: timeRemaining,
      },
    } as CreateTimerMessage);
  };

  const handleRoomUpdate = (timers: Array<TimerData>) => {
    setTimers(timers);
  };

  const handleUpdateTimer = (timer: TimerData) => {
    sendJsonMessage({
      type: 'updateTimer',
      accessId: getRoomCode(),
      timer,
    });
  };

  const handleRemoveTimer = (id: string) => {
    setTimers(timers.filter((timer) => timer.id !== id));

    sendJsonMessage({
      type: 'deleteTimer',
      accessId: getRoomCode(),
      id,
    } as DeleteTimerMessage);
  };

  const handleToggleTimer = (id: string) => {
    const timer = timers.find((timer) => timer.id === id);

    if (timer) {
      const newTimer = {
        ...timer,
        running: !timer.running,
      };

      if (newTimer.running) {
        const newEndTime = Date.now() + timer.timeRemaining;
        newTimer.endTime = newEndTime;
      } else {
        const newTimeRemaining = timer.endTime - Date.now();
        newTimer.timeRemaining = newTimeRemaining;
      }

      setTimers(timers.map((t) => (t.id === id ? newTimer : t)));

      handleUpdateTimer(newTimer);
    }
  };

  const handleAdjustTime = (id: string, amount: number) => {
    const timer = timers.find((timer) => timer.id === id);

    if (timer) {
      const newTimeRemaining = timer.timeRemaining + amount;
      const newEndTime = Date.now() + newTimeRemaining;
      const newTimer = { ...timer, timeRemaining: newTimeRemaining, endTime: newEndTime };

      setTimers(timers.map((t) => (t.id === id ? newTimer : t)));

      handleUpdateTimer(newTimer);
    }
  };

  const handleAdjustRounds = (id: string, amount: number) => {
    const timer = timers.find((timer) => timer.id === id);

    if (timer) {
      const newTimer = { ...timer, rounds: Math.max(0, timer.rounds + amount) };

      setTimers(timers.map((t) => (t.id === id ? newTimer : t)));

      handleUpdateTimer(newTimer);
    }
  };

  const handleChangeRounds = (id: string, direction: 'next' | 'previous') => {
    const timer = timers.find((timer) => timer.id === id);

    if (timer) {
      const newRoundNumber =
        direction === 'next'
          ? Math.min(timer.rounds, timer.currentRoundNumber + 1)
          : Math.max(1, timer.currentRoundNumber - 1);
      const newTimer = { ...timer, currentRoundNumber: newRoundNumber, timeRemaining: timer.roundTime, running: false };

      setTimers(timers.map((t) => (t.id === id ? newTimer : t)));

      handleUpdateTimer(newTimer);
    }
  };

  // TODO: Debounce this as it can change fast
  const handleUpdateEventName = (id: string, eventName: string) => {
    const timer = timers.find((timer) => timer.id === id);

    if (timer) {
      const newTimer = { ...timer, eventName };

      setTimers(timers.map((t) => (t.id === id ? newTimer : t)));

      handleUpdateTimer(newTimer);
    }
  };

  return (
    <>
      <div className="timer-grid">
        {timers.map((timer) => (
          <Timer
            key={timer.id}
            timerData={timer}
            onRemoveTimer={handleRemoveTimer}
            onToggleTimer={handleToggleTimer}
            onAdjustTime={handleAdjustTime}
            onAdjustRounds={handleAdjustRounds}
            onChangeRound={handleChangeRounds}
            onUpdateEventName={handleUpdateEventName}
          />
        ))}
      </div>

      <AddTimer onAddTimer={handleAddTimer} />
    </>
  );
};
