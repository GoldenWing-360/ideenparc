import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../../hooks/useAssessment';
import { useEvaluation } from '../../hooks/useEvaluation';
import ThreeBoxInput from '../common/ThreeBoxInput';
import { Check } from 'lucide-react';
import ResultsView from '../common/ResultsView';
import { blocks } from '../../data/questions';

const blockLabels: Record<string, string> = {
  markt: 'Markt & Kunden',
  wettbewerb: 'Wettbewerb',
  unternehmen: 'Mein Unternehmen',
};

export default function ScrollJourney() {
  const assessment = useAssessment();
  const evaluation = useEvaluation(assessment.answers);
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    markt: true,
    wettbewerb: false,
    unternehmen: false,
  });
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleBlock = (blockId: string) => {
    setOpenBlocks((prev) => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  const openNextBlock = (currentBlockId: string) => {
    const blockIds: string[] = blocks.map((b) => b.id);
    const currentIdx = blockIds.indexOf(currentBlockId);
    if (currentIdx < blockIds.length - 1) {
      const nextId = blockIds[currentIdx + 1];
      setOpenBlocks((prev) => ({ ...prev, [currentBlockId]: false, [nextId]: true }));
      setTimeout(() => {
        document.getElementById(`block-${nextId}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    assessment.reset();
    setShowResults(false);
    setOpenBlocks({ markt: true, wettbewerb: false, unternehmen: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = (assessment.answeredCount / assessment.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-navy">ideenparc Positionierungscheck</span>
          <span className="text-sm text-gray-500">{assessment.answeredCount}/{assessment.totalQuestions}</span>
        </div>
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-blue-dark text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Sie haben eine starke, relevante Positionierung! Wirklich?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 mb-8 max-w-xl mx-auto"
          >
            Der ideenparc Positionierungscheck zeigt Ihnen in wenigen Minuten, wie klar,
            differenziert und wirksam Ihr Unternehmen im Markt positioniert ist.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 text-sm"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow">22</div>
              <div className="text-white/60">Fragen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow">~8</div>
              <div className="text-white/60">Minuten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow">100+</div>
              <div className="text-white/60">Projekte</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-navy mb-3">
            Willkommen beim ideenparc Positionierungscheck
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Dieser kurze Check unterstützt Sie dabei, Ihre aktuelle Positionierung realistisch
            einzuordnen: aus Sicht von Markt und Kunden, im Vergleich zum Wettbewerb und mit Blick
            auf die interne Umsetzung. Im Mittelpunkt steht Ihre persönliche Einschätzung: Wie klar,
            relevant und wirksam ist das, was Sie heute nach außen und nach innen kommunizieren?
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
            Der Positionierungscheck basiert auf über 25 Jahren Projekterfahrung von ideenparc und
            mehr als 100 Positionierungs- und Marketingprojekten. Das zugrunde liegende
            Ideal-Real-Optimal Modell (IRO) wurde in Konzernen ebenso eingesetzt wie im Mittelstand
            und bei Start-ups.
          </p>
        </div>
      </div>

      {/* Question Blocks */}
      <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
        {blocks.map((block) => {
          const isOpen = openBlocks[block.id];
          const answeredInBlock = assessment.blockAnsweredCount(block.id);
          const totalInBlock = block.questions.length;
          const blockComplete = answeredInBlock === totalInBlock;

          return (
            <div
              key={block.id}
              id={`block-${block.id}`}
              className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
            >
              {/* Block Header */}
              <button
                onClick={() => toggleBlock(block.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left text-white transition-colors"
                style={{ backgroundColor: block.color }}
              >
                <div>
                  <h3 className="text-lg md:text-xl font-bold">{block.title}</h3>
                  <p className="text-white/80 text-sm mt-1">{block.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    {answeredInBlock}/{totalInBlock} {blockComplete && <Check className="inline w-3.5 h-3.5 ml-0.5" strokeWidth={2.5} />}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Block Content */}
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white"
                >
                  <div className="p-5 md:p-6 space-y-8">
                    {block.questions.map((q) => (
                      <div key={q.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-4">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full text-white shrink-0 mt-0.5"
                            style={{ backgroundColor: block.color }}
                          >
                            {q.id}
                          </span>
                          <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                            {q.text}
                          </p>
                        </div>
                        <div className="ml-0 md:ml-9">
                          <ThreeBoxInput
                            value={assessment.answers[q.id] ?? 0}
                            onChange={(val) => assessment.setAnswer(q.id, val)}
                            accent={block.color}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Next block button */}
                    {block.id !== 'unternehmen' && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => openNextBlock(block.id)}
                          className="text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                          style={{ backgroundColor: block.color }}
                        >
                          Weiter zu {blockLabels[blocks[blocks.indexOf(block) + 1]?.id] || 'nächstem Block'} →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Submit button */}
        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={!assessment.isComplete}
            className={`font-bold px-10 py-4 rounded-xl text-lg transition-all ${
              assessment.isComplete
                ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Ergebnis anzeigen
          </button>
          {!assessment.isComplete && (
            <p className="text-sm text-gray-400 mt-2">
              Bitte beantworten Sie alle {assessment.totalQuestions} Fragen
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div ref={resultsRef} className="border-t-4 border-primary">
          <ResultsView
            overallScore={evaluation.overallScore}
            maturityLevel={evaluation.maturityLevel}
            blockScores={evaluation.blockScores}
            clarityScore={evaluation.clarityScore}
            executionScore={evaluation.executionScore}
            matrixQuadrant={evaluation.matrixQuadrant}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
