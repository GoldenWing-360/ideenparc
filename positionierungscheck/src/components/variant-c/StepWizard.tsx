import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../hooks/useAssessment';
import { useEvaluation } from '../../hooks/useEvaluation';
import ThreeBoxInput from '../common/ThreeBoxInput';
import ResultsView from '../common/ResultsView';
import { blocks } from '../../data/questions';

const steps = [
  { id: 'intro', label: 'Start' },
  { id: 'markt', label: 'Markt' },
  { id: 'wettbewerb', label: 'Wettbewerb' },
  { id: 'unternehmen', label: 'Unternehmen' },
  { id: 'results', label: 'Ergebnis' },
];

export default function StepWizard() {
  const assessment = useAssessment();
  const evaluation = useEvaluation(assessment.answers);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToStep = useCallback((step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleReset = () => {
    assessment.reset();
    setCurrentStep(0);
  };

  const canProceed = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    if (stepIndex >= 1 && stepIndex <= 3) {
      const block = blocks[stepIndex - 1];
      return block.questions.every((q) => assessment.answers[q.id] !== undefined);
    }
    return true;
  };

  const fadeVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i < currentStep
                        ? 'bg-primary text-white'
                        : i === currentStep
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {i < currentStep ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs mt-1 text-gray-500 hidden md:block">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${
                      i < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 0: Intro */}
          {currentStep === 0 && (
            <motion.div
              key="intro"
              custom={direction}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-xl mx-auto text-center py-8">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                  Willkommen beim ideenparc Positionierungscheck
                </h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Dieser kurze Check unterstützt Sie dabei, Ihre aktuelle Positionierung realistisch
                  einzuordnen: aus Sicht von Markt und Kunden, im Vergleich zum Wettbewerb und mit
                  Blick auf die interne Umsetzung.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Der Positionierungscheck basiert auf über 25 Jahren Projekterfahrung von ideenparc
                  und mehr als 100 Positionierungs- und Marketingprojekten. Das zugrunde liegende
                  Ideal-Real-Optimal Modell (IRO) wurde in Konzernen ebenso eingesetzt wie im
                  Mittelstand und bei Start-ups.
                </p>
                <div className="flex justify-center gap-6 mb-8 text-sm">
                  <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                    <div className="text-xl font-bold text-primary">22</div>
                    <div className="text-gray-500">Fragen</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                    <div className="text-xl font-bold text-primary">3</div>
                    <div className="text-gray-500">Bereiche</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                    <div className="text-xl font-bold text-primary">~8</div>
                    <div className="text-gray-500">Minuten</div>
                  </div>
                </div>
                <button
                  onClick={() => goToStep(1)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
                >
                  Los geht's →
                </button>
              </div>
            </motion.div>
          )}

          {/* Steps 1-3: Question Blocks */}
          {currentStep >= 1 && currentStep <= 3 && (
            <motion.div
              key={`block-${currentStep}`}
              custom={direction}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {(() => {
                const block = blocks[currentStep - 1];
                return (
                  <div>
                    {/* Block Header */}
                    <div className="text-center mb-8">
                      <div
                        className="inline-block px-4 py-1 rounded-full text-white text-sm font-medium mb-3"
                        style={{ backgroundColor: block.color }}
                      >
                        Bereich {currentStep} von 3
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
                        {block.title}
                      </h2>
                      <p className="text-gray-600">{block.subtitle}</p>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                      {block.questions.map((q, qi) => (
                        <div
                          key={q.id}
                          className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <span
                              className="text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                              style={{ backgroundColor: block.color }}
                            >
                              {qi + 1}
                            </span>
                            <p className="text-gray-800 leading-relaxed">{q.text}</p>
                          </div>
                          <div className="ml-0 md:ml-11">
                            <ThreeBoxInput
                              value={assessment.answers[q.id] ?? 0}
                              onChange={(val) => assessment.setAnswer(q.id, val)}
                              accent={block.color}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pb-4">
                      <button
                        onClick={() => goToStep(currentStep - 1)}
                        className="text-gray-500 hover:text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors border border-gray-200"
                      >
                        ← Zurück
                      </button>
                      <button
                        onClick={() => goToStep(currentStep + 1)}
                        disabled={!canProceed(currentStep)}
                        className={`font-semibold px-6 py-3 rounded-xl transition-all ${
                          canProceed(currentStep)
                            ? 'text-white shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        style={
                          canProceed(currentStep)
                            ? { backgroundColor: block.color }
                            : undefined
                        }
                      >
                        {currentStep === 3 ? 'Auswerten →' : 'Weiter →'}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <motion.div
              key="results"
              custom={direction}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ResultsView
                overallScore={evaluation.overallScore}
                maturityLevel={evaluation.maturityLevel}
                blockScores={evaluation.blockScores}
                clarityScore={evaluation.clarityScore}
                executionScore={evaluation.executionScore}
                matrixQuadrant={evaluation.matrixQuadrant}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
