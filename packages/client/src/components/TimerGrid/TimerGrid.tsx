import { useEffect, useState } from 'react';
import type { TimerData } from '@lgs-timer/types';

interface TimerGridProps {
  timers: Array<TimerData>;
  onRemoveTimer: (id: string) => void;
}

export const TimerGrid = ({ timers, onRemoveTimer }: TimerGridProps) => {
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
        // <Timer key={timer.id} {...timer} onRemoveTimer={onRemoveTimer} />
        <div key={timer.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold">{timer.eventName}</h2>
          <p className="text-lg">
            {timer.currentRoundNumber}/{timer.rounds} - {timer.currentRoundLength / 1000} seconds
          </p>
          <button onClick={() => onRemoveTimer(timer.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
