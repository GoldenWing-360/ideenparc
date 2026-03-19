import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { BlockId } from '../../data/questions';
import { blocks, allQuestions } from '../../data/questions';
import type { MaturityLevel, MatrixQuadrant } from '../../data/evaluation';
import { maturityLevels, matrixQuadrants } from '../../data/evaluation';
import { getIcon } from '../../data/icons';
import { CheckCircle2, Calendar } from 'lucide-react';
import { submitConsultation } from '../../services/leadService';

interface FinalResultsProps {
  overallScore: number;
  maturityLevel: MaturityLevel;
  blockScores: Record<BlockId, number>;
  clarityScore: number;
  executionScore: number;
  matrixQuadrant: MatrixQuadrant;
  answers: Record<string, number>;
  onReset: () => void;
}

const blockMeta: Record<BlockId, { label: string; color: string }> = {
  markt: { label: 'Markt & Kunden', color: '#00ADE0' },
  wettbewerb: { label: 'Wettbewerb', color: '#F39401' },
  unternehmen: { label: 'Mein Unternehmen', color: '#39A958' },
};

const quadrantLayout = [
  { clarityHigh: true, executionHigh: false, row: 0, col: 0 },
  { clarityHigh: true, executionHigh: true, row: 0, col: 1 },
  { clarityHigh: false, executionHigh: false, row: 1, col: 0 },
  { clarityHigh: false, executionHigh: true, row: 1, col: 1 },
];

// 5 unified type sizes — clearly differentiated
const T = {
  small: { fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 500 } as const,   // labels, captions
  base: { fontSize: '1.15rem', color: '#CBD5E1', lineHeight: 1.7 } as const,    // body text, descriptions
  medium: { fontSize: '1.4rem', color: '#F1F5F9', fontWeight: 600 } as const,   // card titles, subheadings
  large: { fontSize: '1.85rem', color: '#F1F5F9', fontWeight: 700 } as const,   // section headings
  muted: { fontSize: '0.85rem', color: '#94A3B8' } as const,                    // footer, legal
};

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

export default function FinalResults({
  overallScore,
  maturityLevel,
  blockScores,
  clarityScore,
  executionScore,
  matrixQuadrant,
  answers,
  onReset,
}: FinalResultsProps) {
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultCompany, setConsultCompany] = useState('');
  const [consultMessage, setConsultMessage] = useState('');
  const [consultDsgvo, setConsultDsgvo] = useState(false);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultEmail.trim() || !consultDsgvo) return;
    setConsultSubmitting(true);
    await submitConsultation({
      name: consultName.trim(),
      email: consultEmail.trim(),
      phone: consultPhone.trim() || undefined,
      company: consultCompany.trim() || undefined,
      message: consultMessage.trim() || undefined,
      type: 'consultation',
      timestamp: new Date().toISOString(),
      variant: 'final',
      results: {
        overallScore,
        reifegrad: maturityLevel.title,
        matrixQuadrant: matrixQuadrant.title,
        blockScores: {
          markt: blockScores.markt,
          wettbewerb: blockScores.wettbewerb,
          unternehmen: blockScores.unternehmen,
        },
        strategischeKlarheit: clarityScore,
        umsetzungsstaerke: executionScore,
        einzelantworten: allQuestions.map((q) => ({
          frage: q.text,
          block: q.blockId,
          prozent: answers[q.id] ?? 0,
        })),
      },
    });
    setConsultSubmitting(false);
    setConsultSubmitted(true);
  };

  const font = "'Titillium Web', sans-serif";
  const MaturityIcon = getIcon(maturityLevel.icon);

  const inputClass = "w-full px-0 py-2 bg-transparent border-0 border-b outline-none transition-colors focus:border-[#00ADE0]";
  const inputStyle = { borderBottomColor: 'rgba(255,255,255,0.1)', color: '#F1F5F9', fontSize: '1rem' };

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{ backgroundColor: '#0A0F1A', fontFamily: font }}
    >
      <div className="max-w-[680px] mx-auto space-y-20">
        {/* Header */}
        <motion.div className="text-center" initial="hidden" animate="visible" custom={0} variants={stagger}>
          <p
            className="uppercase tracking-[4px] mb-4"
            style={T.small}
          >
            Ihr Ergebnis
          </p>
          <h2 className="mb-4" style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 700 }}>
            Klar auf den Punkt
          </h2>
          <p style={T.base}>
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
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,173,224,0.1)' }}>
                <MaturityIcon className="w-6 h-6" style={{ color: '#00ADE0' }} strokeWidth={1.5} />
              </div>
              <h3 style={T.large}>
                {maturityLevel.title}
              </h3>
            </div>
            <p className="mt-4 mx-auto max-w-lg" style={T.base}>
              {maturityLevel.text}
            </p>
          </div>

          {/* Block Scores */}
          <div
            className="pt-8 space-y-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="uppercase tracking-[3px] mb-4" style={T.small}>
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
                    <span style={T.small}>{meta.label}</span>
                    <span className="tabular-nums" style={{ ...T.small, color: meta.color, fontWeight: 700 }}>{score}%</span>
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
            <p className="uppercase tracking-[3px] mb-4" style={T.small}>
              Reifegrad-Skala
            </p>
            <div className="flex flex-col gap-1.5">
              {maturityLevels.map((level) => {
                const isActive = level.title === maturityLevel.title;
                const LevelIcon = getIcon(level.icon);
                return (
                  <div
                    key={level.title}
                    className="flex items-center gap-3 transition-all duration-300"
                    style={{
                      padding: isActive ? '12px 14px' : '9px 14px',
                      borderRadius: '10px',
                      backgroundColor: isActive ? '#00ADE0' : 'rgba(255,255,255,0.04)',
                      border: isActive ? '1px solid #00ADE0' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <LevelIcon
                      className="shrink-0 hidden sm:block"
                      style={{
                        width: isActive ? 22 : 16,
                        height: isActive ? 22 : 16,
                        color: isActive ? '#fff' : '#94A3B8',
                      }}
                      strokeWidth={1.5}
                    />
                    <div className="flex-1 min-w-0">
                      <span style={{
                        fontSize: isActive ? '1.15rem' : '1rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#fff' : '#CBD5E1',
                      }}>
                        {level.title}
                      </span>
                    </div>
                    <span
                      className="tabular-nums shrink-0"
                      style={{
                        fontSize: '1rem',
                        color: isActive ? 'rgba(255,255,255,0.85)' : '#94A3B8',
                        fontWeight: 600,
                      }}
                    >
                      {level.min}–{level.max}%
                    </span>
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
          <p className="uppercase tracking-[3px] mb-2 text-center" style={T.small}>
            Positionierungsmatrix
          </p>
          <h3 className="text-center mb-2" style={T.large}>
            Ihre Position
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 mb-6">
            <span style={T.base}>
              Strategische Klarheit: <strong className="tabular-nums" style={{ color: '#00ADE0' }}>{clarityScore}%</strong>
            </span>
            <span style={T.base}>
              Umsetzungsstärke: <strong className="tabular-nums" style={{ color: '#00ADE0' }}>{executionScore}%</strong>
            </span>
          </div>

          {/* Y-axis label — separate row above grid */}
          <div className="flex items-center justify-between mb-2 px-1">
            <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 500 }}>Hoch</span>
            <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '3px' }}>
              KLARHEIT
            </span>
            <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 500 }}>Niedrig</span>
          </div>
          <div className="relative">
            <div
              className="grid grid-cols-2 overflow-hidden rounded-xl"
              style={{ border: '1px solid rgba(255,255,255,0.06)', minHeight: '240px' }}
            >
              {quadrantLayout.map((layout) => {
                const quadrant = matrixQuadrants.find(
                  (q) => q.clarityHigh === layout.clarityHigh && q.executionHigh === layout.executionHigh
                )!;
                const isActive =
                  layout.clarityHigh === matrixQuadrant.clarityHigh &&
                  layout.executionHigh === matrixQuadrant.executionHigh;
                const Icon = getIcon(quadrant.icon);
                return (
                  <div
                    key={quadrant.title}
                    className="relative flex flex-col items-center justify-center p-3 sm:p-5 transition-all duration-500"
                    style={{
                      backgroundColor: isActive ? `${quadrant.color}1A` : 'rgba(255,255,255,0.02)',
                      borderRight: layout.col === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      borderBottom: layout.row === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                  >
                    <Icon
                      className="mb-2"
                      style={{
                        width: isActive ? 28 : 20,
                        height: isActive ? 28 : 20,
                        color: isActive ? quadrant.color : '#ffffff',
                      }}
                      strokeWidth={1.5}
                    />
                    <span
                      className="text-center font-semibold"
                      style={{
                        fontSize: isActive ? '1.15rem' : '1rem',
                        color: isActive ? '#F1F5F9' : '#ffffff',
                      }}
                    >
                      {quadrant.title}
                    </span>
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4" style={{ color: quadrant.color }} strokeWidth={2} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* X-axis label */}
            <div className="flex items-center justify-between mt-3 px-1">
              <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 500 }}>Niedrig</span>
              <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '3px' }}>
                UMSETZUNG
              </span>
              <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 500 }}>Hoch</span>
            </div>
          </div>

          {/* Result box */}
          {(() => {
            const ActiveIcon = getIcon(matrixQuadrant.icon);
            return (
              <div
                className="mt-6 rounded-xl p-5"
                style={{
                  backgroundColor: `${matrixQuadrant.color}0D`,
                  border: `1px solid ${matrixQuadrant.color}1A`,
                }}
              >
                <div className="flex items-start gap-3">
                  <ActiveIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: matrixQuadrant.color }} strokeWidth={1.5} />
                  <div>
                    <h4 style={T.medium}>
                      {matrixQuadrant.title}
                    </h4>
                    <p className="mt-2" style={T.base}>
                      {matrixQuadrant.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>

        {/* CTA — Consultation */}
        <motion.div
          className="rounded-2xl p-8 md:p-10"
          style={{ background: 'linear-gradient(135deg, #0A2540, #0E3054)' }}
          initial="hidden" animate="visible" custom={3} variants={stagger}
        >
          {consultSubmitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#39A958' }} strokeWidth={1.5} />
              <h3 style={T.large}>
                Vielen Dank, {consultName.split(' ')[0]}!
              </h3>
              <p className="mt-2" style={T.small}>
                Wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <Calendar className="w-7 h-7" style={{ color: '#E7E44D' }} strokeWidth={1.5} />
                </div>
                <h3 style={T.large}>
                  Lassen Sie uns über Ihr Ergebnis sprechen
                </h3>
                <p className="mt-4 mx-auto max-w-lg" style={T.base}>
                  Auf Basis Ihrer Antworten und ergänzender Recherche durch uns erstellen wir einen erweiterten,
                  kostenfreien Positionierungs-Check für Ihr Unternehmen und besprechen die Ergebnisse in einem
                  persönlichen, 1-stündigen Gespräch.
                </p>
              </div>

              {!consultOpen ? (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setConsultOpen(true)}
                    className="inline-block px-8 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] hover:brightness-110"
                    style={{ backgroundColor: '#E7E44D', color: '#0A2540', fontSize: '1rem' }}
                  >
                    Gespräch vereinbaren
                  </button>
                  <p className="mt-4" style={{ ...T.base, fontWeight: 500 }}>
                    Kostenfrei · Unverbindlich · Persönlich
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="max-w-md mx-auto space-y-4 text-left mt-6">
                  <div>
                    <label htmlFor="fin-c-name" className="block mb-1" style={T.small}>Name *</label>
                    <input id="fin-c-name" type="text" value={consultName} onChange={(e) => setConsultName(e.target.value)}
                      placeholder="Ihr vollständiger Name" required className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label htmlFor="fin-c-email" className="block mb-1" style={T.small}>E-Mail *</label>
                    <input id="fin-c-email" type="email" value={consultEmail} onChange={(e) => setConsultEmail(e.target.value)}
                      placeholder="ihre@email.de" required className={inputClass} style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="fin-c-phone" className="block mb-1" style={T.small}>Telefon</label>
                      <input id="fin-c-phone" type="tel" value={consultPhone} onChange={(e) => setConsultPhone(e.target.value)}
                        placeholder="Optional" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="fin-c-company" className="block mb-1" style={T.small}>Unternehmen</label>
                      <input id="fin-c-company" type="text" value={consultCompany} onChange={(e) => setConsultCompany(e.target.value)}
                        placeholder="Optional" className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="fin-c-msg" className="block mb-1" style={T.small}>Nachricht</label>
                    <textarea id="fin-c-msg" value={consultMessage} onChange={(e) => setConsultMessage(e.target.value)}
                      placeholder="z.B. spezifische Fragen zu meinem Ergebnis" rows={3}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b outline-none transition-colors focus:border-[#00ADE0] resize-none"
                      style={{ borderBottomColor: 'rgba(255,255,255,0.1)', color: '#F1F5F9', fontSize: '1rem' }} />
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={consultDsgvo} onChange={(e) => setConsultDsgvo(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-[#00ADE0]" required />
                    <span style={{ ...T.muted, lineHeight: 1.5 }}>
                      Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                      <a href="https://www.ideenparc.net/elementor-882/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#94A3B8]" style={{ color: '#64748B' }}>Datenschutzerklärung</a>{' '}
                      zu. *
                    </span>
                  </label>
                  <button type="submit"
                    disabled={!consultDsgvo || !consultName.trim() || !consultEmail.trim() || consultSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#E7E44D', color: '#0A2540', fontSize: '1rem' }}
                  >
                    {consultSubmitting ? 'Wird gesendet...' : 'Gespräch vereinbaren'}
                  </button>
                </form>
              )}
            </>
          )}
        </motion.div>

        {/* Reset + Footer */}
        <motion.div
          className="text-center space-y-6 pb-8"
          initial="hidden" animate="visible" custom={4} variants={stagger}
        >
          <button
            onClick={onReset}
            className="underline transition-colors"
            style={{ fontSize: '0.95rem', color: '#CBD5E1' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
          >
            Check wiederholen
          </button>
          <div className="space-y-3">
            <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
              ideenparc GmbH · Mandlstraße 26 · 80802 München
            </p>
            <div className="space-x-4">
              <a href="https://www.ideenparc.net/kontaktseite-deutsch/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CBD5E1] transition-colors" style={{ fontSize: '0.95rem', color: '#94A3B8' }}>Impressum</a>
              <a href="https://www.ideenparc.net/elementor-882/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CBD5E1] transition-colors" style={{ fontSize: '0.95rem', color: '#94A3B8' }}>Datenschutz</a>
              <a href="https://www.ideenparc.net" target="_blank" rel="noopener noreferrer" className="hover:text-[#CBD5E1] transition-colors" style={{ fontSize: '0.95rem', color: '#94A3B8' }}>ideenparc.net</a>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '1.5rem' }}>
              Ein Projekt von GoldenWing Digital
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
