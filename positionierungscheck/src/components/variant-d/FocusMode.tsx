import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../hooks/useAssessment';
import { useEvaluation } from '../../hooks/useEvaluation';
import Slider from '../common/Slider';
import ResultsView from '../common/ResultsView';
import { blocks, allQuestions } from '../../data/questions';

type Phase = 'welcome' | 'questions' | 'reveal' | 'results';

export default function FocusMode() {
  const assessment = useAssessment();
  const evaluation = useEvaluation(assessment.answers);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [direction, setDirection] = useState(1);
  const [revealValue, setRevealValue] = useState(0);

  const currentQ = allQuestions[assessment.currentIndex];
  const currentBlock = blocks.find((b) => b.id === currentQ?.blockId);
  const hasAnswered = currentQ ? assessment.answers[currentQ.id] !== undefined : false;

  // Background color transitions between blocks
  const bgColor = useMemo(() => {
    if (phase === 'welcome') return '#0A2540';
    if (phase === 'reveal' || phase === 'results') return '#0A2540';
    if (!currentBlock) return '#0A2540';
    const colors: Record<string, string> = {
      markt: '#003d52',
      wettbewerb: '#3d2500',
      unternehmen: '#0d2e15',
    };
    return colors[currentBlock.id] || '#0A2540';
  }, [phase, currentBlock]);

  const handleStart = () => {
    setPhase('questions');
  };

  const handleNext = useCallback(() => {
    if (!hasAnswered) return;
    if (assessment.currentIndex === allQuestions.length - 1) {
      // Start reveal
      setPhase('reveal');
      return;
    }
    setDirection(1);
    assessment.goNext();
  }, [assessment, hasAnswered]);

  const handlePrev = useCallback(() => {
    if (assessment.currentIndex === 0) return;
    setDirection(-1);
    assessment.goPrev();
  }, [assessment]);

  // Reveal animation
  useEffect(() => {
    if (phase !== 'reveal') return;
    const target = evaluation.overallScore;
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRevealValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setPhase('results'), 1000);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, evaluation.overallScore]);

  // Keyboard support
  useEffect(() => {
    if (phase !== 'questions') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleNext]);

  const handleReset = () => {
    assessment.reset();
    setPhase('welcome');
    setRevealValue(0);
  };

  if (phase === 'results') {
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

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      {/* Minimal progress bar */}
      {phase === 'questions' && (
        <div className="fixed top-0 left-0 right-0 z-20">
          <div className="h-1 bg-white/10">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: currentBlock?.color,
                boxShadow: `0 0 10px ${currentBlock?.color}80`,
              }}
            />
          </div>
          <div className="flex justify-end px-4 py-2">
            <span className="text-white/40 text-sm">
              {assessment.currentIndex + 1}/{assessment.totalQuestions}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Welcome */}
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto text-center text-white"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Sie haben eine starke, relevante Positionierung!
                  <br />
                  <span className="text-primary">Wirklich?</span>
                </h1>
                <p className="text-white/60 text-lg">
                  22 Fragen. ~8 Minuten. Klarheit.
                </p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleStart}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg"
              >
                Starten
              </motion.button>
            </motion.div>
          )}

          {/* Question */}
          {phase === 'questions' && currentQ && (
            <motion.div
              key={`q-${assessment.currentIndex}`}
              custom={direction}
              initial={{ opacity: 0, y: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="max-w-xl mx-auto w-full"
            >
              <div className="text-center mb-8">
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-4"
                  style={{ backgroundColor: currentBlock?.color }}
                >
                  {currentQ.id}
                </span>
                <p className="text-white text-xl md:text-2xl font-medium leading-relaxed">
                  {currentQ.text}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                <Slider
                  value={assessment.answers[currentQ.id] ?? 0}
                  onChange={(val) => assessment.setAnswer(currentQ.id, val)}
                  color={currentBlock?.color || '#00ADE0'}
                  size="large"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {assessment.currentIndex > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="text-white/40 hover:text-white/70 text-sm transition-colors"
                  >
                    ← Zurück
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all ${
                    hasAnswered
                      ? 'text-white'
                      : 'text-white/20 cursor-not-allowed'
                  }`}
                  style={
                    hasAnswered
                      ? { backgroundColor: currentBlock?.color }
                      : undefined
                  }
                >
                  {assessment.currentIndex === allQuestions.length - 1 ? 'Auswerten' : 'Weiter'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Enter hint */}
              <div className="text-center mt-6">
                <span className="text-white/20 text-xs">
                  oder Enter drücken ↵
                </span>
              </div>
            </motion.div>
          )}

          {/* Reveal */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/40 text-sm uppercase tracking-widest mb-4"
              >
                Ihr Reifegrad
              </motion.div>
              <div
                className="text-8xl md:text-9xl font-bold tabular-nums"
                style={{ color: '#00ADE0' }}
              >
                {revealValue}%
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-4 text-2xl"
              >
                <span className="text-3xl mr-2">{evaluation.maturityLevel.icon}</span>
                <span className="font-semibold">{evaluation.maturityLevel.title}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
