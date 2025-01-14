import type { TimerData } from '@lgs-timer/types';
import { Timer } from '@components/Timer';
import './TimerGrid.css';

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
  return (
    <div className="timer-grid">
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
