import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { BlockId } from '../../data/questions';
import { blocks } from '../../data/questions';
import type { MaturityLevel, MatrixQuadrant } from '../../data/evaluation';
import { maturityLevels } from '../../data/evaluation';

interface CinematicResultsProps {
  overallScore: number;
  maturityLevel: MaturityLevel;
  blockScores: Record<BlockId, number>;
  clarityScore: number;
  executionScore: number;
  matrixQuadrant: MatrixQuadrant;
  onReset: () => void;
}

const blockMeta: Record<BlockId, { label: string; color: string }> = {
  markt: { label: 'Markt & Kunden', color: '#00ADE0' },
  wettbewerb: { label: 'Wettbewerb', color: '#F39401' },
  unternehmen: { label: 'Mein Unternehmen', color: '#39A958' },
};

const quadrants = [
  { clarityHigh: true, executionHigh: false, title: 'Strategie vor Umsetzung', row: 0, col: 0 },
  { clarityHigh: true, executionHigh: true, title: 'Klar & Konsequent', row: 0, col: 1 },
  { clarityHigh: false, executionHigh: false, title: 'Neustart mit Potenzial', row: 1, col: 0 },
  { clarityHigh: false, executionHigh: true, title: 'Aktiv ohne Leitplanken', row: 1, col: 1 },
];

function AnimatedRing({ value, size = 200 }: { value: number; size?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;
  const center = size / 2;

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke="#00ADE0" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-100"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="tabular-nums"
          style={{
            color: '#00ADE0',
            fontSize: '2.5rem',
            fontFamily: "'Titillium Web', sans-serif",
            fontWeight: 700,
          }}
        >
          {displayValue}%
        </span>
      </div>
    </div>
  );
}

const stagger = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: 'easeOut' as const },
  }),
};

export default function CinematicResults({
  overallScore,
  maturityLevel,
  blockScores,
  clarityScore,
  executionScore,
  matrixQuadrant,
  onReset,
}: CinematicResultsProps) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;
    console.log('Lead captured:', { name: leadName, email: leadEmail });
    setLeadSubmitted(true);
  };

  const font = "'Titillium Web', sans-serif";

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{ backgroundColor: '#0A0F1A', fontFamily: font }}
    >
      <div className="max-w-[680px] mx-auto space-y-20">
        {/* Header */}
        <motion.div className="text-center" initial="hidden" animate="visible" custom={0} variants={stagger}>
          <p
            className="uppercase tracking-[3px] mb-4"
            style={{ color: '#475569', fontSize: '11px', fontWeight: 600 }}
          >
            Ihr Ergebnis
          </p>
          <h2
            className="mb-3"
            style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 700 }}
          >
            Klar auf den Punkt
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.7 }}>
            Auf Basis Ihrer Einschätzungen lässt sich eine erste fundierte Einordnung
            Ihrer aktuellen Marktpositionierung ableiten.
          </p>
        </motion.div>

        {/* Reifegrad Card */}
        <motion.div
          className="rounded-2xl p-8 md:p-10"
          style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
          initial="hidden" animate="visible" custom={1} variants={stagger}
        >
          <div className="text-center mb-8">
            <AnimatedRing value={overallScore} />
            <div className="mt-6">
              <h3 style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700 }}>
                {maturityLevel.title}
              </h3>
            </div>
            <p
              className="mt-4 mx-auto max-w-lg"
              style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.8 }}
            >
              {maturityLevel.text}
            </p>
          </div>

          {/* Block Scores */}
          <div
            className="pt-8 space-y-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p
              className="uppercase tracking-[3px] mb-4"
              style={{ color: '#475569', fontSize: '10px', fontWeight: 600 }}
            >
              Ergebnisse nach Bereich
            </p>
            {blocks.map((block, i) => {
              const meta = blockMeta[block.id];
              const score = blockScores[block.id];
              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.2, duration: 0.5 }}
                >
                  <div className="flex justify-between mb-2">
                    <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{meta.label}</span>
                    <span style={{ color: meta.color, fontSize: '0.85rem', fontWeight: 700 }}>{score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 1.2 + i * 0.2, duration: 1, ease: 'easeOut' as const }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Maturity Scale */}
          <div className="pt-8 mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p
              className="uppercase tracking-[3px] mb-4"
              style={{ color: '#475569', fontSize: '10px', fontWeight: 600 }}
            >
              Reifegrad-Skala
            </p>
            <div className="flex gap-1">
              {maturityLevels.map((level) => {
                const isActive = level.title === maturityLevel.title;
                return (
                  <div
                    key={level.title}
                    className="flex-1 rounded-lg p-2 text-center transition-all"
                    style={{
                      backgroundColor: isActive ? '#00ADE0' : 'rgba(255,255,255,0.04)',
                      color: isActive ? '#fff' : '#475569',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 600 }}>
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
          className="rounded-2xl p-8 md:p-10"
          style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
          initial="hidden" animate="visible" custom={2} variants={stagger}
        >
          <p
            className="uppercase tracking-[3px] mb-2 text-center"
            style={{ color: '#475569', fontSize: '10px', fontWeight: 600 }}
          >
            Positionierungsmatrix
          </p>
          <h3
            className="text-center mb-2"
            style={{ color: '#F1F5F9', fontSize: '1.25rem', fontWeight: 700 }}
          >
            Ihre Position
          </h3>
          <div className="flex justify-center gap-6 mb-6" style={{ fontSize: '0.8rem' }}>
            <span style={{ color: '#94A3B8' }}>
              Strategische Klarheit: <strong style={{ color: '#F1F5F9' }}>{clarityScore}%</strong>
            </span>
            <span style={{ color: '#94A3B8' }}>
              Umsetzungsstärke: <strong style={{ color: '#F1F5F9' }}>{executionScore}%</strong>
            </span>
          </div>

          <div className="relative">
            <div
              className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap"
              style={{ color: '#475569', fontSize: '9px', fontWeight: 600, letterSpacing: '2px' }}
            >
              KLARHEIT
            </div>
            <div className="grid grid-cols-2 gap-2 ml-2">
              {quadrants.map((q) => {
                const isActive =
                  q.clarityHigh === matrixQuadrant.clarityHigh &&
                  q.executionHigh === matrixQuadrant.executionHigh;
                return (
                  <div
                    key={q.title}
                    className="p-4 rounded-xl text-center transition-all duration-500"
                    style={{
                      backgroundColor: isActive ? 'rgba(0, 173, 224, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: isActive
                        ? '1px solid rgba(0, 173, 224, 0.3)'
                        : '1px solid rgba(255,255,255,0.04)',
                      opacity: isActive ? 1 : 0.4,
                    }}
                  >
                    <div
                      style={{
                        color: isActive ? '#F1F5F9' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {q.title}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="text-center mt-3 ml-2"
              style={{ color: '#475569', fontSize: '9px', fontWeight: 600, letterSpacing: '2px' }}
            >
              UMSETZUNG
            </div>
          </div>

          <div
            className="mt-6 rounded-xl p-5"
            style={{ backgroundColor: '#1A2332', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <h4 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1rem' }}>
              {matrixQuadrant.title}
            </h4>
            <p className="mt-2" style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.7 }}>
              {matrixQuadrant.text}
            </p>
          </div>
        </motion.div>

        {/* Lead Capture */}
        <motion.div
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#1A2332', border: '1px solid rgba(255,255,255,0.06)' }}
          initial="hidden" animate="visible" custom={3} variants={stagger}
        >
          {leadSubmitted ? (
            <div className="text-center py-4">
              <h3 style={{ color: '#39A958', fontSize: '1.1rem', fontWeight: 600 }}>Vielen Dank</h3>
              <p className="mt-2" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                Ihr Report wird an <strong style={{ color: '#F1F5F9' }}>{leadEmail}</strong> gesendet.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h3 style={{ color: '#F1F5F9', fontSize: '1.1rem', fontWeight: 600 }}>
                Detaillierte Auswertung per E-Mail
              </h3>
              <p className="mt-2 mb-6" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                Erhalten Sie einen ausführlichen Report mit personalisierten Handlungsempfehlungen.
              </p>
              {!leadOpen ? (
                <button
                  onClick={() => setLeadOpen(true)}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: '#00ADE0', color: '#fff', fontSize: '0.9rem' }}
                >
                  Kostenlos anfordern
                </button>
              ) : (
                <form onSubmit={handleLeadSubmit} className="max-w-sm mx-auto space-y-4 text-left">
                  <div>
                    <label
                      htmlFor="cin-name"
                      className="block mb-1"
                      style={{ color: '#94A3B8', fontSize: '0.8rem' }}
                    >
                      Name
                    </label>
                    <input
                      id="cin-name"
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ihr vollständiger Name"
                      required
                      className="w-full px-0 py-2 bg-transparent border-0 border-b outline-none transition-colors focus:border-[#00ADE0]"
                      style={{
                        borderBottomColor: 'rgba(255,255,255,0.1)',
                        color: '#F1F5F9',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cin-email"
                      className="block mb-1"
                      style={{ color: '#94A3B8', fontSize: '0.8rem' }}
                    >
                      E-Mail
                    </label>
                    <input
                      id="cin-email"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="ihre@email.de"
                      required
                      className="w-full px-0 py-2 bg-transparent border-0 border-b outline-none transition-colors focus:border-[#00ADE0]"
                      style={{
                        borderBottomColor: 'rgba(255,255,255,0.1)',
                        color: '#F1F5F9',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.75rem' }}>
                    Kein Spam. Ihre Daten werden nur für den Report verwendet.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: '#00ADE0', color: '#fff', fontSize: '0.9rem' }}
                  >
                    Report anfordern
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="rounded-2xl p-8 md:p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0A2540, #0E3054)' }}
          initial="hidden" animate="visible" custom={4} variants={stagger}
        >
          <h3 style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700 }}>
            Lassen Sie uns über Ihr Ergebnis sprechen
          </h3>
          <p
            className="mt-4 mx-auto max-w-lg"
            style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.8 }}
          >
            Auf Basis Ihrer Antworten und ergänzender Recherche durch uns erstellen wir einen erweiterten,
            kostenfreien Positionierungs-Check für Ihr Unternehmen und besprechen die Ergebnisse in einem
            persönlichen, 1-stündigen Gespräch.
          </p>
          <a
            href="mailto:jbenkovich@ideenparc.net?subject=Beratungsgespr%C3%A4ch%20Positionierungscheck"
            className="inline-block mt-6 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] hover:brightness-110"
            style={{ backgroundColor: '#E7E44D', color: '#0A2540' }}
          >
            Kostenloses Beratungsgespräch
          </a>
          <p className="mt-4" style={{ color: '#475569', fontSize: '0.8rem' }}>
            Kostenfrei · Unverbindlich · Persönlich
          </p>
        </motion.div>

        {/* Reset + Footer */}
        <motion.div
          className="text-center space-y-6 pb-8"
          initial="hidden" animate="visible" custom={5} variants={stagger}
        >
          <button
            onClick={onReset}
            className="transition-colors"
            style={{ color: '#475569', fontSize: '0.85rem' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Check wiederholen
          </button>
          <div style={{ color: '#475569', fontSize: '0.75rem' }}>
            <p>© ideenparc GmbH · Mandlstraße 26 · 80802 München</p>
            <div className="mt-1 space-x-3">
              <a href="/impressum" className="hover:text-[#94A3B8] transition-colors" style={{ color: '#475569' }}>Impressum</a>
              <a href="/datenschutz" className="hover:text-[#94A3B8] transition-colors" style={{ color: '#475569' }}>Datenschutz</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
