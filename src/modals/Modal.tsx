import { useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40 max-w-screen max-h-screen overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) {
          mouseDownTarget.current = e.target;
        } else {
          mouseDownTarget.current = null;
        }
      }}
      onMouseUp={(e) => {
        if (
          e.target === overlayRef.current &&
          mouseDownTarget.current === overlayRef.current
        ) {
          onClose();
        }
        mouseDownTarget.current = null;
      }}
    >
      <div
        className="bg-white rounded-xl p-6 w-full relative max-w-[80vw] lg:max-w-[60vw] max-h-[70vh] md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Luk"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
