import { useState, useCallback, useRef, useEffect } from 'react';

interface FinalSliderProps {
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

const STEP = 10;
const TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function snapToStep(val: number): number {
  return Math.round(val / STEP) * STEP;
}

export default function FinalSlider({
  value,
  onChange,
  color = '#00ADE0',
}: FinalSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      onChange(snapToStep(pct));
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      handleInteraction(e.clientX);
    },
    [handleInteraction]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      handleInteraction(e.touches[0].clientX);
    },
    [handleInteraction]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleInteraction(e.touches[0].clientX);
    };
    const handleEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleInteraction]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newValue = value;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(100, value + STEP);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(0, value - STEP);
          break;
        case 'Home':
          newValue = 0;
          break;
        case 'End':
          newValue = 100;
          break;
        default:
          return;
      }
      e.preventDefault();
      onChange(newValue);
    },
    [value, onChange]
  );

  return (
    <div className="w-full select-none">
      {/* Value display */}
      <div className="flex justify-center mb-4">
        <span
          className="font-bold tabular-nums"
          style={{
            color,
            fontSize: '3rem',
            lineHeight: 1,
            fontFamily: "'Titillium Web', sans-serif",
            fontWeight: 700,
          }}
        >
          {value}%
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-3 rounded-full cursor-pointer"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Bewertung"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Tick marks at every 10% */}
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute top-1/2 -translate-y-1/2 w-0.5 rounded-full"
            style={{
              left: `${tick}%`,
              height: tick % 50 === 0 ? '20px' : '14px',
              transform: 'translateX(-50%) translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          />
        ))}

        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-3 rounded-full transition-all duration-75"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}40`,
          }}
        />

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-white transition-transform duration-75 ${
            isDragging ? 'scale-125' : 'hover:scale-110'
          }`}
          style={{
            left: `${value}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            backgroundColor: color,
            boxShadow: isDragging
              ? `0 0 16px ${color}80, 0 2px 8px rgba(0,0,0,0.4)`
              : `0 2px 8px rgba(0,0,0,0.4), 0 0 8px ${color}30`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', fontFamily: "'Titillium Web', sans-serif" }}>
          trifft gar nicht zu
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', fontFamily: "'Titillium Web', sans-serif" }}>
          trifft voll und ganz zu
        </span>
      </div>

      {/* Tick labels — show 0, 50, 100 */}
      <div className="flex justify-between mt-1">
        <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '11px', fontFamily: "'Titillium Web', sans-serif" }}>
          0%
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '11px', fontFamily: "'Titillium Web', sans-serif" }}>
          50%
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '11px', fontFamily: "'Titillium Web', sans-serif" }}>
          100%
        </span>
      </div>
    </div>
  );
}
