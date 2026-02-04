import { getIcon } from '../../data/icons';
import type { MatrixQuadrant } from '../../data/evaluation';
import { matrixQuadrants } from '../../data/evaluation';
import { CheckCircle2 } from 'lucide-react';

interface MatrixGridProps {
  activeQuadrant: MatrixQuadrant;
  clarityScore: number;
  executionScore: number;
}

const quadrantLayout = [
  { clarityHigh: true, executionHigh: false, row: 0, col: 0, roundedClass: 'rounded-tl-2xl' },
  { clarityHigh: true, executionHigh: true, row: 0, col: 1, roundedClass: 'rounded-tr-2xl' },
  { clarityHigh: false, executionHigh: false, row: 1, col: 0, roundedClass: 'rounded-bl-2xl' },
  { clarityHigh: false, executionHigh: true, row: 1, col: 1, roundedClass: 'rounded-br-2xl' },
];

export default function MatrixGrid({ activeQuadrant, clarityScore, executionScore }: MatrixGridProps) {
  return (
    <div className="w-full max-w-[520px] mx-auto">
      {/* Score display */}
      <div className="flex justify-center gap-6 mb-6" style={{ fontSize: '15px' }}>
        <span className="text-gray-600">
          Strategische Klarheit:{' '}
          <strong className="tabular-nums" style={{ color: '#00ADE0' }}>{clarityScore}%</strong>
        </span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600">
          Umsetzungsstärke:{' '}
          <strong className="tabular-nums" style={{ color: '#00ADE0' }}>{executionScore}%</strong>
        </span>
      </div>

      {/* Matrix with axis labels */}
      <div className="relative pl-10 pb-10">
        {/* Y-axis label */}
        <div className="absolute left-0 top-0 bottom-10 flex items-center">
          <div className="flex flex-col items-center justify-between h-full py-2">
            <span className="text-[10px] text-gray-400 font-medium">hoch</span>
            <span
              className="-rotate-90 whitespace-nowrap text-xs text-gray-500 font-medium tracking-wide"
            >
              Strategische Klarheit
            </span>
            <span className="text-[10px] text-gray-400 font-medium">niedrig</span>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 overflow-hidden rounded-2xl"
          style={{ border: '1px solid #E2E8F0', minHeight: '320px' }}
        >
          {quadrantLayout.map((layout) => {
            const quadrant = matrixQuadrants.find(
              (q) => q.clarityHigh === layout.clarityHigh && q.executionHigh === layout.executionHigh
            )!;
            const isActive =
              layout.clarityHigh === activeQuadrant.clarityHigh &&
              layout.executionHigh === activeQuadrant.executionHigh;
            const Icon = getIcon(quadrant.icon);

            return (
              <div
                key={quadrant.title}
                className="relative flex flex-col items-center justify-center p-6 md:p-8 transition-all duration-500"
                style={{
                  backgroundColor: isActive ? quadrant.color : '#F1F5F9',
                  borderRight: layout.col === 0 ? '1px solid #E2E8F0' : 'none',
                  borderBottom: layout.row === 0 ? '1px solid #E2E8F0' : 'none',
                }}
              >
                <Icon
                  className="mb-2 transition-all duration-500"
                  style={{
                    width: isActive ? 32 : 20,
                    height: isActive ? 32 : 20,
                    color: isActive ? '#fff' : '#94A3B8',
                    opacity: isActive ? 1 : 0.4,
                  }}
                  strokeWidth={1.5}
                />
                <span
                  className="text-center font-semibold transition-all duration-500"
                  style={{
                    fontSize: isActive ? '14px' : '12px',
                    color: isActive ? '#fff' : '#94A3B8',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {quadrant.title}
                </span>
                {isActive && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-white/80" strokeWidth={2} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X-axis label */}
        <div className="flex items-center justify-between mt-3 px-2">
          <span className="text-[10px] text-gray-400 font-medium">niedrig</span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            Umsetzungsstärke
          </span>
          <span className="text-[10px] text-gray-400 font-medium">hoch</span>
        </div>
      </div>

      {/* Result box */}
      {(() => {
        const ActiveIcon = getIcon(activeQuadrant.icon);
        return (
          <div
            className="mt-6 rounded-xl p-6"
            style={{
              backgroundColor: `${activeQuadrant.color}0D`,
              border: `1px solid ${activeQuadrant.color}26`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${activeQuadrant.color}1A` }}
              >
                <ActiveIcon className="w-5 h-5" style={{ color: activeQuadrant.color }} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-navy" style={{ fontSize: '16px' }}>
                  {activeQuadrant.title}
                </h4>
                <p className="text-gray-600 mt-1" style={{ fontSize: '14px', lineHeight: 1.7 }}>
                  {activeQuadrant.text}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
