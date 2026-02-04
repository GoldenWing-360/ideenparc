import { motion } from 'framer-motion';
import type { BlockId } from '../../data/questions';
import type { MaturityLevel, MatrixQuadrant } from '../../data/evaluation';
import { maturityLevels } from '../../data/evaluation';
import ProgressRing from './ProgressRing';
import MatrixGrid from './MatrixGrid';
import BlockScores from './BlockScores';
import LeadCapture from './LeadCapture';
import ConsultationCTA from './ConsultationCTA';

interface ResultsViewProps {
  overallScore: number;
  maturityLevel: MaturityLevel;
  blockScores: Record<BlockId, number>;
  clarityScore: number;
  executionScore: number;
  matrixQuadrant: MatrixQuadrant;
  onReset: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

export default function ResultsView({
  overallScore,
  maturityLevel,
  blockScores,
  clarityScore,
  executionScore,
  matrixQuadrant,
  onReset,
}: ResultsViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
          Ihr Ergebnis – klar auf den Punkt
        </h2>
        <p className="text-gray-600">
          Auf Basis Ihrer Einschätzungen lässt sich eine erste fundierte Einordnung
          Ihrer aktuellen Marktpositionierung ableiten.
        </p>
      </motion.div>

      {/* Reifegrad Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
      >
        <div className="text-center mb-6">
          <ProgressRing value={overallScore} />
          <div className="mt-4">
            <span className="text-3xl mr-2">{maturityLevel.icon}</span>
            <h3 className="text-xl md:text-2xl font-bold text-navy inline">
              {maturityLevel.title}
            </h3>
          </div>
          <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            {maturityLevel.text}
          </p>
        </div>

        {/* Block Scores */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Ergebnisse nach Bereich
          </h4>
          <BlockScores scores={blockScores} />
        </div>

        {/* Maturity Scale */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Reifegrad-Skala
          </h4>
          <div className="flex gap-1">
            {maturityLevels.map((level) => {
              const isActive = level.title === maturityLevel.title;
              return (
                <div
                  key={level.title}
                  className={`flex-1 rounded-lg p-2 text-center transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="text-lg">{level.icon}</div>
                  <div className="text-[10px] font-medium leading-tight mt-1 hidden md:block">
                    {level.title}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    {level.min}–{level.max}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Matrix Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeUp}
      >
        <h3 className="text-lg md:text-xl font-bold text-navy mb-4 text-center">
          Ihre Position in der Positionierungsmatrix
        </h3>
        <MatrixGrid
          activeQuadrant={matrixQuadrant}
          clarityScore={clarityScore}
          executionScore={executionScore}
        />
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{matrixQuadrant.icon}</span>
            <div>
              <h4 className="font-semibold text-navy">{matrixQuadrant.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{matrixQuadrant.text}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lead Capture */}
      <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
        <LeadCapture
          onSubmit={(data) => {
            console.log('Lead captured:', data);
          }}
        />
      </motion.div>

      {/* CTA */}
      <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}>
        <ConsultationCTA onReset={onReset} />
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center text-xs text-gray-400 pt-4"
        initial="hidden"
        animate="visible"
        custom={5}
        variants={fadeUp}
      >
        <p>© ideenparc GmbH · Mandlstraße 26 · 80802 München</p>
        <div className="mt-1 space-x-3">
          <a href="/impressum" className="hover:text-gray-600 transition-colors">Impressum</a>
          <a href="/datenschutz" className="hover:text-gray-600 transition-colors">Datenschutz</a>
        </div>
      </motion.div>
    </div>
  );
}
