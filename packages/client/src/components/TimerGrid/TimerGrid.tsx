import { useEffect, useState } from 'react';
import type { TimerData } from '@lgs-timer/types';
import { Timer } from '../Timer';

interface TimerGridProps {
  timers: Array<TimerData>;
  onRemoveTimer: (id: string) => void;
  onUpdateTimer: (timer: TimerData) => void;
}

export const TimerGrid = ({ timers, onRemoveTimer, onUpdateTimer }: TimerGridProps) => {
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
        <Timer key={timer.id} timerData={timer} onRemoveTimer={onRemoveTimer} onUpdateTimer={onUpdateTimer} />
      ))}
    </div>
  );
};
