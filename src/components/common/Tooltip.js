import React, { useState, useRef, useEffect } from 'react';
import { Transition } from 'react-transition-group';

const Tooltip = React.forwardRef(({ children, show, ...props }, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (show && tooltipRef.current) {
      const { x, y, width, height } = tooltipRef.current.getBoundingClientRect();
      setPosition({ x: x + width / 2, y: y - height - 8 });
    }
  }, [show]);

  return (
    <Transition in={show} timeout={300} unmountOnExit>
      {(state) => (
        <div
          ref={tooltipRef}
          className={`absolute z-50 bg-gray-800 text-white rounded-lg px-3 py-2 shadow-lg transition-all duration-300 pointer-events-none
            ${state === 'entering' ? 'opacity-0 translate-y-2' : ''}
            ${state === 'entered' ? 'opacity-100 translate-y-0' : ''}
            ${state === 'exiting' ? 'opacity-0 translate-y-2' : ''}`}
          style={{ left: position.x, top: position.y }}
          {...props}
        >
          {children}
        </div>
      )}
    </Transition>
  );
});

export const TooltipTrigger = ({ children }) => children;

export const TooltipContent = ({ children }) => children;

export default Tooltip;