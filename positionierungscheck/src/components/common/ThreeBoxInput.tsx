import { X, Minus, Check } from 'lucide-react';

interface ThreeBoxInputProps {
  value: number;
  onChange: (value: number) => void;
  accent?: string;
}

const options = [
  { value: 0, label: 'Nein', subtext: 'trifft nicht zu', Icon: X },
  { value: 50, label: 'Teilweise', subtext: 'trifft teilweise zu', Icon: Minus },
  { value: 100, label: 'Ja', subtext: 'trifft voll zu', Icon: Check },
] as const;

export default function ThreeBoxInput({
  value,
  onChange,
  accent = '#00ADE0',
}: ThreeBoxInputProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="relative flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              padding: '16px 8px',
              borderColor: isSelected ? accent : '#E2E8F0',
              backgroundColor: isSelected ? accent : '#fff',
              color: isSelected ? '#fff' : '#6B7280',
              boxShadow: isSelected ? `0 4px 12px ${accent}30` : 'none',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = `${accent}0A`;
                e.currentTarget.style.borderColor = `${accent}40`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }
            }}
            aria-pressed={isSelected}
            role="radio"
            aria-checked={isSelected}
          >
            <opt.Icon
              className="mb-1.5"
              style={{ width: 20, height: 20 }}
              strokeWidth={2}
            />
            <span className="font-semibold text-sm">{opt.label}</span>
            <span
              className="mt-0.5 hidden sm:block"
              style={{
                fontSize: '10px',
                opacity: isSelected ? 0.85 : 0.6,
              }}
            >
              {opt.subtext}
            </span>
          </button>
        );
      })}
    </div>
  );
}
