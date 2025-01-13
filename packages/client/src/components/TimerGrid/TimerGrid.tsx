import { useEffect, useState } from 'react';
import type { TimerData } from '@lgs-timer/types';
import { Timer } from '../Timer';

interface TimerGridProps {
  timers: Array<TimerData>;
  onRemoveTimer: (id: string) => void;
  onToggleTimer: (id: string) => void;
  onAdjustTime: (id: string, amount: number) => void;
  onAdjustRounds: (id: string, amount: number) => void;
  onChangeRound: (id: string, direction: 'next' | 'previous') => void;
  onUpdateEventName: (id: string, eventName: string) => void;
}

export const TimerGrid = ({
  timers,
  onRemoveTimer,
  onToggleTimer,
  onAdjustRounds,
  onAdjustTime,
  onChangeRound,
  onUpdateEventName,
}: TimerGridProps) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const checkHeight = () => {
      const windowHeight = window.innerHeight;
      const timerHeight = 12.5 * 16; // Approximate height of a timer in pixels
      const totalTimerHeight = timers.length * timerHeight + (timers.length - 1) * 16;
      setColumns(totalTimerHeight > windowHeight ? 2 : 1);
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, [timers.length]);

  return (
    <div className={`grid gap-4 p-4 ${columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
      {timers.map((timer) => (
        <Timer
          key={timer.id}
          timerData={timer}
          onRemoveTimer={onRemoveTimer}
          onToggleTimer={onToggleTimer}
          onAdjustTime={onAdjustTime}
          onAdjustRounds={onAdjustRounds}
          onChangeRound={onChangeRound}
          onUpdateEventName={onUpdateEventName}
        />
      ))}
    </div>
  );
};
