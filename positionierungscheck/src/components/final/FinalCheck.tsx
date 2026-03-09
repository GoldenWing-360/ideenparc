import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '../../hooks/useAssessment';
import { useEvaluation } from '../../hooks/useEvaluation';
import FinalSlider from './FinalSlider';
import FinalResults from './FinalResults';
import { blocks, allQuestions } from '../../data/questions';

type Phase = 'welcome' | 'block-intro' | 'question' | 'reveal' | 'results';

const blockLabels: Record<string, string> = {
  markt: 'MARKT & KUNDEN',
  wettbewerb: 'WETTBEWERB',
  unternehmen: 'MEIN UNTERNEHMEN',
};

// Step names for progress indicator
const stepNames = ['Start', 'Markt', 'Wettbewerb', 'Unternehmen', 'Ergebnis'];

function getActiveStep(phase: Phase, blockId?: string): number {
  if (phase === 'welcome') return 0;
  if (phase === 'results') return 4;
  if (phase === 'reveal') return 4;
  if (blockId === 'markt') return 1;
  if (blockId === 'wettbewerb') return 2;
  if (blockId === 'unternehmen') return 3;
  return 0;
}

export default function FinalCheck() {
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
  const activeStep = getActiveStep(phase, currentBlock?.id);

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

  // Keyboard — Enter to proceed, Arrow keys to move slider
  useEffect(() => {
    if (phase !== 'question') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleNext();
        return;
      }
      if (!currentQ) return;
      const current = assessment.answers[currentQ.id] ?? 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        assessment.setAnswer(currentQ.id, Math.min(100, current + 10));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        assessment.setAnswer(currentQ.id, Math.max(0, current - 10));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, handleNext, currentQ, assessment]);

  // Reveal animation — 3s hold before results
  useEffect(() => {
    if (phase !== 'reveal') return;
    const target = evaluation.overallScore;
    let frame: number;
    let timeout: ReturnType<typeof setTimeout>;
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
        timeout = setTimeout(() => setPhase('results'), 3000);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleReset = () => {
    assessment.reset();
    setPhase('welcome');
    setRevealValue(0);
    setLastBlockId(null);
  };

  const progress = (assessment.answeredCount / assessment.totalQuestions) * 100;

  // Dot navigation data — which questions belong to which block, colored
  const dotData = useMemo(() => {
    return allQuestions.map((q, i) => {
      const block = blocks.find((b) => b.id === q.blockId);
      return {
        index: i,
        color: block?.color || '#00ADE0',
        answered: assessment.answers[q.id] !== undefined,
        active: i === assessment.currentIndex,
      };
    });
  }, [assessment.answers, assessment.currentIndex]);

  if (phase === 'results') {
    return (
      <FinalResults
        overallScore={evaluation.overallScore}
        maturityLevel={evaluation.maturityLevel}
        blockScores={evaluation.blockScores}
        answers={assessment.answers}
        clarityScore={evaluation.clarityScore}
        executionScore={evaluation.executionScore}
        matrixQuadrant={evaluation.matrixQuadrant}
        onReset={handleReset}
      />
    );
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#0A0F1A', fontFamily: font }}
    >
      {/* Progress indicator — wizard circles */}
      {(phase === 'question' || phase === 'block-intro') && (
        <div className="fixed top-0 left-0 right-0 z-20">
          {/* Thin progress bar */}
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

          {/* Step circles */}
          <div className="flex items-center justify-center gap-0 px-4 py-3">
            {stepNames.map((name, i) => {
              const isActive = i === activeStep;
              const isCompleted = i < activeStep;
              const stepColor = isActive
                ? (currentBlock?.color || '#00ADE0')
                : isCompleted
                ? '#39A958'
                : 'rgba(255,255,255,0.15)';

              return (
                <div key={name} className="flex items-center">
                  {i > 0 && (
                    <div
                      className="h-px transition-all duration-300"
                      style={{
                        width: '24px',
                        backgroundColor: isCompleted ? '#39A958' : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  )}
                  <div
                    className="flex items-center justify-center rounded-full transition-all duration-300 shrink-0"
                    style={{
                      width: isActive ? 'auto' : '32px',
                      minWidth: '32px',
                      height: '32px',
                      padding: isActive ? '0 12px' : '0',
                      backgroundColor: isActive ? stepColor : 'transparent',
                      border: `1.5px solid ${stepColor}`,
                    }}
                  >
                    {isActive ? (
                      <span
                        className="text-white font-semibold whitespace-nowrap"
                        style={{ fontSize: '11px' }}
                      >
                        {name}
                      </span>
                    ) : (
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: '12px',
                          color: isCompleted ? '#39A958' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {isCompleted ? '\u2713' : i + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main content */}
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
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10"
              >
                <img
                  src="/logo.png"
                  alt="ideenparc"
                  className="h-12 mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-6 leading-tight"
                style={{ color: '#F1F5F9', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700 }}
              >
                Sie haben eine starke relevante Positionierung!
                <br />
                <span style={{ color: '#00ADE0' }}>Wirklich?</span>
              </motion.h1>

              {/* Second sentence */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-6 mx-auto max-w-[520px]"
                style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                Der ideenparc Positionierungscheck zeigt Ihnen in wenigen Minuten, wie klar,
                differenziert und wirksam Ihr Unternehmen im Markt positioniert ist.
              </motion.p>

              {/* IRO Model text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mb-10 mx-auto max-w-[520px]"
                style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.7 }}
              >
                Der Check basiert auf über 25 Jahren Projekterfahrung von ideenparc und mehr als
                100 Positionierungs- und Marketingprojekten. Das zugrunde liegende Ideal-Real-Optimal
                Model (IRO) wurde in Konzernen ebenso eingesetzt wie im Mittelstand und bei Start-ups.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center gap-6 mb-12"
              >
                {[
                  { value: '22', label: 'Fragen' },
                  { value: '8', label: 'Minuten' },
                  { value: '\u2713', label: 'Klarheit' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="font-bold"
                      style={{ color: '#00ADE0', fontSize: '1.5rem' }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Start button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                onClick={handleStart}
                className="px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: '#00ADE0',
                  color: '#fff',
                }}
              >
                Check starten
              </motion.button>
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
                style={{ color: currentBlock.color, fontSize: '12px', fontWeight: 600 }}
              >
                {blockLabels[currentBlock.id]}
              </p>
              <h2
                className="mb-4"
                style={{ color: '#F1F5F9', fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 }}
              >
                {currentBlock.title}
              </h2>
              <p className="mb-10" style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.7 }}>
                {currentBlock.subtitle}
              </p>
              <button
                onClick={handleBlockIntroNext}
                className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: currentBlock.color,
                  color: '#fff',
                  fontSize: '1rem',
                }}
              >
                Weiter
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
                <FinalSlider
                  value={assessment.answers[currentQ.id] ?? 0}
                  onChange={(val) => assessment.setAnswer(currentQ.id, val)}
                  color={currentBlock?.color || '#00ADE0'}
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
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
                  style={{
                    backgroundColor: currentBlock?.color || '#00ADE0',
                    color: '#fff',
                    fontSize: '0.95rem',
                    cursor: hasAnswered ? 'pointer' : 'not-allowed',
                  }}
                >
                  {assessment.currentIndex === allQuestions.length - 1 ? 'Auswerten' : 'Weiter'}
                </button>
              </div>

              {/* Dot navigation */}
              <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
                {dotData.map((dot) => (
                  <button
                    key={dot.index}
                    onClick={() => {
                      if (dot.answered || dot.index <= assessment.currentIndex) {
                        goToQuestion(dot.index);
                      }
                    }}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: dot.active ? '12px' : '8px',
                      height: dot.active ? '12px' : '8px',
                      backgroundColor: dot.answered
                        ? dot.color
                        : dot.active
                        ? '#fff'
                        : 'rgba(255,255,255,0.15)',
                      boxShadow: dot.active ? `0 0 8px ${dot.color}60` : 'none',
                      cursor:
                        dot.answered || dot.index <= assessment.currentIndex
                          ? 'pointer'
                          : 'default',
                    }}
                  />
                ))}
              </div>

              {/* Enter hint */}
              <div className="text-center mt-4">
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
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
