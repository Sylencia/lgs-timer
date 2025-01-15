import { forwardRef } from 'react';
import './Dialog.css';
import { Cross1Icon } from '@radix-ui/react-icons';

type DialogProps = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(({ children, toggleDialog }, ref) => {
  return (
    <dialog
      className="dialog"
      ref={ref}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleDialog();
        }
      }}
    >
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={toggleDialog}>
          <Cross1Icon height={16} width={16} />
        </button>
        {children}
      </div>
    </dialog>
  );
});
