import type { MatrixQuadrant } from '../../data/evaluation';

interface MatrixGridProps {
  activeQuadrant: MatrixQuadrant;
  clarityScore: number;
  executionScore: number;
}

const quadrants = [
  { clarityHigh: true, executionHigh: false, title: 'Strategie vor Umsetzung', icon: '💡', row: 0, col: 0 },
  { clarityHigh: true, executionHigh: true, title: 'Klar & Konsequent', icon: '⭐', row: 0, col: 1 },
  { clarityHigh: false, executionHigh: false, title: 'Neustart mit Potenzial', icon: '❓', row: 1, col: 0 },
  { clarityHigh: false, executionHigh: true, title: 'Aktiv ohne Leitplanken', icon: '💪', row: 1, col: 1 },
];

export default function MatrixGrid({ activeQuadrant, clarityScore, executionScore }: MatrixGridProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Score display */}
      <div className="flex justify-center gap-8 mb-4 text-sm">
        <span className="text-gray-600">
          Strategische Klarheit: <strong className="text-blue">{clarityScore}%</strong>
        </span>
        <span className="text-gray-600">
          Umsetzungsstärke: <strong className="text-blue">{executionScore}%</strong>
        </span>
      </div>

      {/* Matrix */}
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 whitespace-nowrap font-medium">
          Strategische Klarheit →
        </div>

        <div className="grid grid-cols-2 gap-2 ml-4">
          {quadrants.map((q) => {
            const isActive =
              q.clarityHigh === activeQuadrant.clarityHigh &&
              q.executionHigh === activeQuadrant.executionHigh;
            return (
              <div
                key={q.title}
                className={`
                  relative p-4 rounded-xl border-2 text-center transition-all duration-500
                  ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-lg scale-105'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">{q.icon}</div>
                <div className={`text-sm font-semibold ${isActive ? 'text-blue-dark' : 'text-gray-400'}`}>
                  {q.title}
                </div>
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X-axis label */}
        <div className="text-center mt-3 text-xs text-gray-500 font-medium ml-4">
          Umsetzungsstärke →
        </div>
      </div>
    </div>
  );
}
