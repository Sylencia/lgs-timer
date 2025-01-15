import clsx from 'clsx';
import { ReactNode, useMemo, useState } from 'react';
import './ExpandablePill.css';

interface ExpandablePillProps {
  onClick?: () => void;
  icon: ReactNode;
  text: string;
  className?: string;
}

interface PillActiveStates {
  hover: boolean;
  focus: boolean;
  clicked: boolean;
}

export const ExpandablePill = ({ onClick, icon, text, className }: ExpandablePillProps) => {
  const [isFocused, setIsFocused] = useState<PillActiveStates>({
    hover: false,
    focus: false,
    clicked: false,
  });

  const showContent = useMemo(() => isFocused.hover || isFocused.focus || isFocused.clicked, [isFocused]);

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsFocused((prev: PillActiveStates) => ({ ...prev, clicked: !prev.clicked }));
    }
  };

  return (
    <button
      className={clsx(className, 'expandable-pill')}
      onClick={handleOnClick}
      onTouchStart={(e) => {
        e.preventDefault();
        handleOnClick();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        setIsFocused((prev: PillActiveStates) => ({ ...prev, clicked: false }));
      }}
      onMouseEnter={() => setIsFocused((prev: PillActiveStates) => ({ ...prev, hover: true }))}
      onFocus={() => setIsFocused((prev: PillActiveStates) => ({ ...prev, focus: true }))}
      onMouseLeave={() => setIsFocused((prev: PillActiveStates) => ({ ...prev, hover: false }))}
      onBlur={() => setIsFocused((prev: PillActiveStates) => ({ ...prev, focus: false }))}
    >
      {icon}
      {showContent && <div>{text}</div>}
    </button>
  );
};
