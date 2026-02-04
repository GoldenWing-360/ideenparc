import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = [
  {
    id: 'variante-a',
    title: 'Card Stepper',
    subtitle: 'App-Feeling',
    description:
      'Eine Frage pro Bildschirm mit Slide-Animationen. Wie eine moderne App – fokussiert und intuitiv.',
    icon: '📱',
    color: '#00ADE0',
    features: ['Eine Frage pro Screen', 'Slide-Animationen', 'Dot-Navigation', 'Tastatur-Support'],
  },
  {
    id: 'variante-b',
    title: 'Scroll Journey',
    subtitle: 'Long-Page',
    description:
      'Klassische Scroll-Seite mit Accordion-Sektionen. Alle Blöcke auf einen Blick – übersichtlich und strukturiert.',
    icon: '📜',
    color: '#006BB6',
    features: ['Alle Blöcke sichtbar', 'Accordion-Sektionen', 'Sticky Fortschritt', 'Smooth Scroll'],
  },
  {
    id: 'variante-c',
    title: 'Multi-Step Wizard',
    subtitle: 'Formular-Stil',
    description:
      'Schrittweiser Durchlauf mit übersichtlichem Step-Indikator. Alle Fragen eines Blocks auf einer Seite.',
    icon: '📋',
    color: '#F39401',
    features: ['5-Schritte-Anzeige', 'Block-weise Bearbeitung', 'Übersichtlich', 'Fade-Animationen'],
  },
  {
    id: 'variante-d',
    title: 'Focus Mode',
    subtitle: 'Typeform-Stil',
    description:
      'Minimalistisch und immersiv. Eine Frage im Fullscreen – maximaler Fokus, dramatische Übergänge.',
    icon: '🎯',
    color: '#39A958',
    features: ['Fullscreen-Layout', 'Farbwechsel', 'Cinematic Reveal', 'Keyboard-First'],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-blue-dark text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              ideenparc GmbH
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Positionierungscheck
              <br />
              <span className="text-primary">4 Varianten zur Auswahl</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Gleiches Assessment, gleiche Auswertung – vier verschiedene Darstellungsformen.
              Wählen Sie die Variante, die am besten zu Ihrer Zielgruppe passt.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Variants Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {variants.map((v, i) => (
            <motion.div
              key={v.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link
                to={`/${v.id}`}
                className="block group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Color bar */}
                <div className="h-2" style={{ backgroundColor: v.color }} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-3xl">{v.icon}</span>
                      <h2 className="text-xl font-bold text-navy mt-2">{v.title}</h2>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: v.color }}
                      >
                        {v.subtitle}
                      </span>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: `${v.color}20` }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: v.color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{v.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {v.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 text-center">
          <h3 className="text-lg font-bold text-navy mb-2">Alle Varianten enthalten:</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>✓ 22 Fragen in 3 Blöcken</span>
            <span>✓ Reifegrad-Auswertung</span>
            <span>✓ Positionierungsmatrix</span>
            <span>✓ Lead-Capture</span>
            <span>✓ Workshop-Reset</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>© ideenparc GmbH · Mandlstraße 26 · 80802 München</span>
          <div className="flex gap-4">
            <Link to="/impressum" className="hover:text-gray-700 transition-colors">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-gray-700 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
