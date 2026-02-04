import { useState, useCallback, useRef, useEffect } from 'react';

interface CinematicSliderProps {
  value: number;
  onChange: (value: number) => void;
  color?: string;
  touched?: boolean;
}

export default function CinematicSlider({
  value,
  onChange,
  color = '#00ADE0',
  touched = false,
}: CinematicSliderProps) {
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

  return (
    <div className="w-full select-none">
      {/* Value display */}
      <div className="flex justify-center mb-6">
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
        className="relative h-[3px] rounded-full cursor-pointer"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
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
        {/* 50% subtle mark */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-3"
          style={{ left: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />

        {/* Filled track with glow */}
        <div
          className="absolute top-0 left-0 h-[3px] rounded-full transition-all duration-75"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 20px ${color}33`,
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-100"
          style={{
            left: `${value}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            boxShadow: isDragging
              ? `0 0 0 8px ${color}40, 0 0 30px ${color}33`
              : !touched
              ? `0 0 0 6px ${color}30, 0 0 20px ${color}25`
              : `0 0 0 4px ${color}20, 0 0 15px ${color}1a`,
            animation: !touched ? 'pulse-glow 2s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4">
        <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '10px', fontFamily: "'Titillium Web', sans-serif" }}>
          trifft gar nicht zu
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '10px', fontFamily: "'Titillium Web', sans-serif" }}>
          trifft voll und ganz zu
        </span>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 4px ${color}20, 0 0 15px ${color}1a; }
          50% { box-shadow: 0 0 0 8px ${color}30, 0 0 25px ${color}25; }
        }
      `}</style>
    </div>
  );
}
