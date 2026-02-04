import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../hooks/useAssessment';
import { useEvaluation } from '../../hooks/useEvaluation';
import CinematicSlider from './CinematicSlider';
import CinematicResults from './CinematicResults';
import { blocks, allQuestions } from '../../data/questions';

type Phase = 'welcome' | 'block-intro' | 'question' | 'reveal' | 'results';

const blockLabels: Record<string, string> = {
  markt: 'MARKT & KUNDEN',
  wettbewerb: 'WETTBEWERB',
  unternehmen: 'MEIN UNTERNEHMEN',
};

export default function CinematicMode() {
  const assessment = useAssessment();
  const evaluation = useEvaluation(assessment.answers);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [direction, setDirection] = useState(1);
  const [lastBlockId, setLastBlockId] = useState<string | null>(null);
  const [revealValue, setRevealValue] = useState(0);

  const currentQ = allQuestions[assessment.currentIndex];
  const currentBlock = blocks.find((b) => b.id === currentQ?.blockId);
  const hasAnswered = currentQ ? assessment.answers[currentQ.id] !== undefined : false;

  const font = "'Titillium Web', sans-serif";

  const handleStart = () => {
    setLastBlockId(blocks[0].id);
    setPhase('block-intro');
  };

  const handleBlockIntroNext = () => {
    setPhase('question');
  };

  const goToQuestion = useCallback(
    (index: number) => {
      const newQ = allQuestions[index];
      const newBlock = blocks.find((b) => b.id === newQ?.blockId);
      setDirection(index > assessment.currentIndex ? 1 : -1);

      if (newBlock && newBlock.id !== lastBlockId) {
        setLastBlockId(newBlock.id);
        assessment.goTo(index);
        setPhase('block-intro');
      } else {
        assessment.goTo(index);
        setPhase('question');
      }
    },
    [assessment, lastBlockId]
  );

  const handleNext = useCallback(() => {
    if (!hasAnswered) return;
    if (assessment.currentIndex === allQuestions.length - 1) {
      setPhase('reveal');
      return;
    }
    setDirection(1);
    goToQuestion(assessment.currentIndex + 1);
  }, [assessment.currentIndex, hasAnswered, goToQuestion]);

  const handlePrev = useCallback(() => {
    if (assessment.currentIndex === 0) {
      setPhase('welcome');
      return;
    }
    setDirection(-1);
    goToQuestion(assessment.currentIndex - 1);
  }, [assessment.currentIndex, goToQuestion]);

  // Keyboard
  useEffect(() => {
    if (phase !== 'question') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleNext]);

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
        setTimeout(() => setPhase('results'), 1200);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, evaluation.overallScore]);

  const handleReset = () => {
    assessment.reset();
    setPhase('welcome');
    setRevealValue(0);
    setLastBlockId(null);
  };

  if (phase === 'results') {
    return (
      <CinematicResults
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
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0A0F1A', fontFamily: font }}
    >
      {/* Progress bar (2px) */}
      {(phase === 'question' || phase === 'block-intro') && (
        <div className="fixed top-0 left-0 right-0 z-20">
          <div className="h-[2px]" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: currentBlock?.color || '#00ADE0',
                boxShadow: `0 0 10px ${currentBlock?.color || '#00ADE0'}40`,
              }}
            />
          </div>
          <div className="flex justify-end px-6 py-3">
            <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>
              {assessment.currentIndex + 1} / {assessment.totalQuestions}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Welcome */}
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl text-center"
            >
              {/* Logo placeholder */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <span
                  className="uppercase tracking-[4px]"
                  style={{ color: '#E7E44D', fontSize: '12px', fontWeight: 700 }}
                >
                  ideenparc
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-6 leading-tight"
                style={{ color: '#F1F5F9', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700 }}
              >
                Wie stark ist Ihre
                <br />
                <span style={{ color: '#00ADE0' }}>Positionierung</span>?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-10 mx-auto max-w-[480px]"
                style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                Der ideenparc Positionierungscheck zeigt Ihnen in wenigen Minuten, wie klar,
                differenziert und wirksam Ihr Unternehmen im Markt positioniert ist.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-12"
                style={{ color: '#475569', fontSize: '0.85rem' }}
              >
                22 Fragen · ~8 Minuten · Kostenlos
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                onClick={handleStart}
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
                style={{
                  color: '#00ADE0',
                  border: '1px solid rgba(0, 173, 224, 0.4)',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 30px rgba(0, 173, 224, 0.1)',
                }}
              >
                Check starten →
              </motion.button>

              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-16"
              >
                <div
                  className="w-px h-8 mx-auto"
                  style={{ background: 'linear-gradient(to bottom, #475569, transparent)' }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Block Intro */}
          {phase === 'block-intro' && currentBlock && (
            <motion.div
              key={`block-intro-${currentBlock.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl text-center"
            >
              <div
                className="w-12 h-[2px] mx-auto mb-8"
                style={{ backgroundColor: currentBlock.color }}
              />
              <p
                className="uppercase tracking-[3px] mb-4"
                style={{ color: currentBlock.color, fontSize: '11px', fontWeight: 600 }}
              >
                {blockLabels[currentBlock.id]}
              </p>
              <h2
                className="mb-4"
                style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 }}
              >
                {currentBlock.title}
              </h2>
              <p className="mb-10" style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {currentBlock.subtitle}
              </p>
              <button
                onClick={handleBlockIntroNext}
                className="transition-all hover:scale-[1.02]"
                style={{ color: currentBlock.color, fontSize: '0.95rem', fontWeight: 600 }}
              >
                Weiter →
              </button>
            </motion.div>
          )}

          {/* Question */}
          {phase === 'question' && currentQ && (
            <motion.div
              key={`q-${assessment.currentIndex}`}
              custom={direction}
              initial={{ opacity: 0, y: direction > 0 ? 30 : -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -30 : 30 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
              className="max-w-[580px] w-full"
            >
              {/* Block label */}
              <p
                className="uppercase tracking-[3px] mb-6 text-center"
                style={{ color: currentBlock?.color, fontSize: '10px', fontWeight: 600 }}
              >
                {blockLabels[currentBlock?.id || '']}
              </p>

              {/* Question text */}
              <p
                className="text-center mb-10"
                style={{
                  color: '#F1F5F9',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {currentQ.text}
              </p>

              {/* Slider */}
              <div className="px-4">
                <CinematicSlider
                  value={assessment.answers[currentQ.id] ?? 0}
                  onChange={(val) => assessment.setAnswer(currentQ.id, val)}
                  color={currentBlock?.color || '#00ADE0'}
                  touched={hasAnswered}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12">
                {assessment.currentIndex > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="transition-colors"
                    style={{ color: '#475569', fontSize: '0.85rem' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                  >
                    ← Zurück
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className="transition-all"
                  style={{
                    color: hasAnswered ? (currentBlock?.color || '#00ADE0') : '#475569',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    opacity: hasAnswered ? 1 : 0.3,
                    cursor: hasAnswered ? 'pointer' : 'not-allowed',
                  }}
                >
                  {assessment.currentIndex === allQuestions.length - 1 ? 'Auswerten →' : 'Weiter →'}
                </button>
              </div>

              {/* Enter hint */}
              <div className="text-center mt-8">
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>
                  Enter drücken ↵
                </span>
              </div>
            </motion.div>
          )}

          {/* Reveal */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="uppercase tracking-[4px] mb-6"
                style={{ color: '#475569', fontSize: '11px', fontWeight: 600 }}
              >
                Ihr Reifegrad
              </motion.p>
              <div
                className="tabular-nums"
                style={{
                  color: '#00ADE0',
                  fontSize: 'clamp(4rem, 12vw, 7rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {revealValue}%
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="mt-6"
              >
                <span style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 600 }}>
                  {evaluation.maturityLevel.title}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
