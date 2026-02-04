import { useState, useCallback, useRef, useEffect } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  color?: string;
  showLabels?: boolean;
  size?: 'default' | 'large';
}

export default function Slider({
  value,
  onChange,
  color = '#00ADE0',
  showLabels = true,
  size = 'default',
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      onChange(Math.round(pct));
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
          newValue = Math.min(100, value + 5);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(0, value - 5);
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

  const trackHeight = size === 'large' ? 'h-3' : 'h-2';
  const thumbSize = size === 'large' ? 'w-7 h-7' : 'w-5 h-5';

  return (
    <div className="w-full select-none">
      {/* Value display */}
      <div className="flex justify-center mb-2">
        <span
          className="font-bold tabular-nums"
          style={{
            color,
            fontSize: size === 'large' ? '3rem' : '2rem',
            lineHeight: 1,
          }}
        >
          {value}%
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className={`relative ${trackHeight} rounded-full bg-gray-200 cursor-pointer`}
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
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <div
            key={tick}
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-300 rounded-full"
            style={{ left: `${tick}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        ))}

        {/* Filled track */}
        <div
          className={`absolute top-0 left-0 ${trackHeight} rounded-full transition-all duration-75`}
          style={{ width: `${value}%`, backgroundColor: color }}
        />

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${thumbSize} rounded-full border-2 border-white shadow-lg transition-transform duration-75 ${
            isDragging ? 'scale-125' : 'hover:scale-110'
          }`}
          style={{
            left: `${value}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            backgroundColor: color,
            boxShadow: isDragging ? `0 0 12px ${color}60` : '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>trifft gar nicht zu</span>
          <span>trifft voll und ganz zu</span>
        </div>
      )}

      {/* Tick labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick}>{tick}%</span>
        ))}
      </div>
    </div>
  );
}
