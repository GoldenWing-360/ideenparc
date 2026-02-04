import { motion } from 'framer-motion';
import type { BlockId } from '../../data/questions';
import type { MaturityLevel, MatrixQuadrant } from '../../data/evaluation';
import { maturityLevels } from '../../data/evaluation';
import { getIcon } from '../../data/icons';
import ProgressRing from './ProgressRing';
import MatrixGrid from './MatrixGrid';
import BlockScores from './BlockScores';
import LeadCapture from './LeadCapture';
import ConsultationCTA from './ConsultationCTA';
import { ArrowRight } from 'lucide-react';

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
  const MaturityIcon = getIcon(maturityLevel.icon);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      {/* Logo */}
      <motion.div
        className="flex justify-center"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <img
          src="/logo.png"
          alt="ideenparc"
          className="h-8 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
          Ihr Ergebnis – klar auf den Punkt
        </h2>
        <p className="text-gray-600" style={{ fontSize: '15px', lineHeight: 1.7 }}>
          Auf Basis Ihrer Einschätzungen lässt sich eine erste fundierte Einordnung
          Ihrer aktuellen Marktpositionierung ableiten.
        </p>
      </motion.div>

      {/* Reifegrad Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
      >
        <div className="text-center mb-8">
          <ProgressRing value={overallScore} />
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00ADE00F' }}>
              <MaturityIcon className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-navy">
              {maturityLevel.title}
            </h3>
          </div>
          <p className="text-gray-600 mt-4 max-w-lg mx-auto" style={{ fontSize: '15px', lineHeight: 1.7 }}>
            {maturityLevel.text}
          </p>
        </div>

        {/* Block Scores */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5">
            Ergebnisse nach Bereich
          </h4>
          <BlockScores scores={blockScores} />
        </div>

        {/* Maturity Scale */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Reifegrad-Skala
          </h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {maturityLevels.map((level, idx) => {
              const isActive = level.title === maturityLevel.title;
              const LevelIcon = getIcon(level.icon);
              return (
                <div key={level.title} className="flex items-center">
                  <div
                    className="flex flex-col items-center text-center transition-all duration-300"
                    style={{
                      minWidth: '110px',
                      padding: '16px 12px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#00ADE0' : '#F1F5F9',
                      color: isActive ? '#fff' : '#6B7280',
                      opacity: isActive ? 1 : 0.6,
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <LevelIcon
                      className="mb-2"
                      style={{ width: 22, height: 22 }}
                      strokeWidth={1.5}
                    />
                    <div
                      className="font-semibold leading-tight"
                      style={{ fontSize: '12px' }}
                    >
                      {level.title}
                    </div>
                    <div
                      className="mt-1 tabular-nums"
                      style={{ fontSize: '10px', opacity: 0.8 }}
                    >
                      {level.min}–{level.max}%
                    </div>
                  </div>
                  {idx < maturityLevels.length - 1 && (
                    <ArrowRight
                      className="mx-1 shrink-0 hidden md:block"
                      style={{ width: 14, height: 14, color: '#D1D5DB' }}
                      strokeWidth={2}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Matrix Card */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10"
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeUp}
      >
        <h3 className="text-lg md:text-xl font-bold text-navy mb-6 text-center">
          Ihre Position in der Positionierungsmatrix
        </h3>
        <MatrixGrid
          activeQuadrant={matrixQuadrant}
          clarityScore={clarityScore}
          executionScore={executionScore}
        />
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
        className="text-center text-xs text-gray-400 pt-6 space-y-2"
        initial="hidden"
        animate="visible"
        custom={5}
        variants={fadeUp}
      >
        <img
          src="/logo.png"
          alt="ideenparc"
          className="h-7 mx-auto opacity-60"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <p>ideenparc GmbH · Mandlstraße 26 · 80802 München</p>
        <p className="text-gray-400">Ein Projekt von GoldenWing Digital</p>
        <div className="mt-1 space-x-3">
          <a href="/impressum" className="hover:text-gray-600 transition-colors">Impressum</a>
          <a href="/datenschutz" className="hover:text-gray-600 transition-colors">Datenschutz</a>
          <a href="https://www.ideenparc.net" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">ideenparc.net</a>
        </div>
      </motion.div>
    </div>
  );
}
