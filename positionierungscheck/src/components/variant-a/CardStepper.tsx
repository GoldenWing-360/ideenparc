import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../hooks/useAssessment';
import { useEvaluation } from '../../hooks/useEvaluation';
import Slider from '../common/Slider';
import ResultsView from '../common/ResultsView';
import { blocks, allQuestions } from '../../data/questions';

type Screen = 'welcome' | 'block-intro' | 'question' | 'results';

export default function CardStepper() {
  const assessment = useAssessment();
  const evaluation = useEvaluation(assessment.answers);
  const [screen, setScreen] = useState<Screen>('welcome');
  const [direction, setDirection] = useState(1);
  const [lastBlockId, setLastBlockId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentQ = allQuestions[assessment.currentIndex];
  const currentBlock = blocks.find((b) => b.id === currentQ?.blockId);
  const hasAnswered = currentQ ? assessment.answers[currentQ.id] !== undefined : false;

  const handleStart = () => {
    setScreen('block-intro');
    setLastBlockId(blocks[0].id);
  };

  const handleBlockIntroNext = () => {
    setScreen('question');
  };

  const goToQuestion = useCallback(
    (index: number) => {
      const newQ = allQuestions[index];
      const newBlock = blocks.find((b) => b.id === newQ?.blockId);
      setDirection(index > assessment.currentIndex ? 1 : -1);

      if (newBlock && newBlock.id !== lastBlockId) {
        setLastBlockId(newBlock.id);
        assessment.goTo(index);
        setScreen('block-intro');
      } else {
        assessment.goTo(index);
        setScreen('question');
      }
    },
    [assessment, lastBlockId]
  );

  const handleNext = useCallback(() => {
    if (!hasAnswered) return;
    if (assessment.currentIndex === allQuestions.length - 1) {
      setShowResults(true);
      return;
    }
    setDirection(1);
    goToQuestion(assessment.currentIndex + 1);
  }, [assessment.currentIndex, hasAnswered, goToQuestion]);

  const handlePrev = useCallback(() => {
    if (assessment.currentIndex === 0) {
      setScreen('welcome');
      return;
    }
    setDirection(-1);
    goToQuestion(assessment.currentIndex - 1);
  }, [assessment.currentIndex, goToQuestion]);

  // Keyboard support
  useEffect(() => {
    if (screen !== 'question') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, handleNext]);

  const handleReset = () => {
    assessment.reset();
    setScreen('welcome');
    setShowResults(false);
    setLastBlockId(null);
  };

  if (showResults) {
    return (
      <ResultsView
        overallScore={evaluation.overallScore}
        maturityLevel={evaluation.maturityLevel}
        blockScores={evaluation.blockScores}
        clarityScore={evaluation.clarityScore}
        executionScore={evaluation.executionScore}
        matrixQuadrant={evaluation.matrixQuadrant}
        onReset={handleReset}
      />
    );
  }

  const progress = (assessment.answeredCount / assessment.totalQuestions) * 100;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Top bar */}
      {screen !== 'welcome' && (
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentBlock?.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {currentBlock?.id === 'markt'
                  ? 'Markt & Kunden'
                  : currentBlock?.id === 'wettbewerb'
                  ? 'Wettbewerb'
                  : 'Mein Unternehmen'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {assessment.currentIndex + 1} von {assessment.totalQuestions}
            </span>
          </div>
          {/* Progress bar */}
          <div className="max-w-lg mx-auto mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: currentBlock?.color }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {screen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-navy mb-3">
                  ideenparc Positionierungscheck
                </h1>
                <p className="text-lg text-blue font-medium mb-2">
                  Sie haben eine starke, relevante Positionierung! Wirklich?
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  Der ideenparc Positionierungscheck zeigt Ihnen in wenigen Minuten, wie klar,
                  differenziert und wirksam Ihr Unternehmen im Markt positioniert ist.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">22</div>
                    <div>Fragen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">~8</div>
                    <div>Minuten</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div>Projekte</div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleStart}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-primary/20"
              >
                Jetzt starten
              </button>
            </motion.div>
          )}

          {screen === 'block-intro' && currentBlock && (
            <motion.div
              key={`block-intro-${currentBlock.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${currentBlock.color}20` }}
              >
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: currentBlock.color }}
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
                {currentBlock.title}
              </h2>
              <p className="text-gray-600 mb-6">{currentBlock.subtitle}</p>
              <button
                onClick={handleBlockIntroNext}
                className="text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                style={{ backgroundColor: currentBlock.color }}
              >
                Weiter →
              </button>
            </motion.div>
          )}

          {screen === 'question' && currentQ && (
            <motion.div
              key={`q-${assessment.currentIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="max-w-lg mx-auto w-full"
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: currentBlock?.color }}
                  >
                    {currentQ.id}
                  </span>
                </div>
                <p className="text-base md:text-lg text-gray-800 mb-8 leading-relaxed">
                  {currentQ.text}
                </p>
                <Slider
                  value={assessment.answers[currentQ.id] ?? 0}
                  onChange={(val) => assessment.setAnswer(currentQ.id, val)}
                  color={currentBlock?.color}
                  size="large"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrev}
                  className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className={`font-semibold px-6 py-3 rounded-xl transition-all ${
                    hasAnswered
                      ? 'bg-primary hover:bg-primary-dark text-white shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {assessment.currentIndex === allQuestions.length - 1 ? 'Auswerten' : 'Weiter →'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      {screen === 'question' && (
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 py-3 px-4">
          <div className="max-w-lg mx-auto flex justify-center gap-1.5 flex-wrap">
            {allQuestions.map((q, i) => {
              const block = blocks.find((b) => b.id === q.blockId);
              const isAnswered = assessment.answers[q.id] !== undefined;
              const isCurrent = i === assessment.currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className={`rounded-full transition-all ${
                    isCurrent ? 'w-4 h-4 scale-125' : 'w-2.5 h-2.5 hover:scale-125'
                  }`}
                  style={{
                    backgroundColor: isAnswered || isCurrent ? block?.color : '#d1d5db',
                    opacity: isCurrent ? 1 : isAnswered ? 0.7 : 0.3,
                  }}
                  aria-label={`Frage ${i + 1}`}
                  title={`Frage ${i + 1}: ${q.id}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
