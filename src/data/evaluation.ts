export interface MaturityLevel {
  min: number;
  max: number;
  title: string;
  icon: string;
  text: string;
}

export const maturityLevels: MaturityLevel[] = [
  {
    min: 0,
    max: 39,
    title: 'Positionierungseinsteiger',
    icon: '🌱',
    text: 'Ihre Positionierung ist aktuell noch nicht klar genug greifbar. Vieles wirkt eher wie ein grober Entwurf, der noch geschärft werden muss. Dadurch wird es schwer, konsistent zu kommunizieren und die richtigen Zielgruppen effizient zu erreichen. Es kann zu vielen Streuverlusten kommen. Die gute Nachricht: Hier steckt viel Potenzial. Wenn Sie Kernnutzen, Zielbild und Abgrenzung schärfen, entstehen schnell messbar mehr Fokus und Wirkung.',
  },
  {
    min: 40,
    max: 59,
    title: 'Entwicklungsaspirant',
    icon: '🔧',
    text: 'Sie haben bereits wichtige Elemente Ihrer Positionierung entwickelt, aber sie greifen noch nicht überall sauber ineinander. Das führt dazu, dass Aussagen teils inkonsistent wahrgenommen werden und Wirkung verschenkt wird. Mit etwas Struktur und Priorisierung können Sie aus vorhandenen Bausteinen ein klares Gesamtbild formen. Der nächste Schritt ist, wenige starke Botschaften konsequent zu halten, statt vieles gleichzeitig zu versuchen.',
  },
  {
    min: 60,
    max: 74,
    title: 'Optimierungskandidat',
    icon: '📈',
    text: 'Ihre Positionierung ist grundsätzlich tragfähig und im Alltag nutzbar. Gleichzeitig gibt es Bereiche, in denen noch Reibung entsteht und die Marketingmaschine nicht perfekt laufen lässt. Wenn Sie jetzt noch mehr Wissen sammeln und einen Fokus auf Klarheit und Stringenz legen, wird die Positionierung deutlich stärker. Der Wiedererkennungswert wird steigen und der Marketing-Impact sich verbessern.',
  },
  {
    min: 75,
    max: 89,
    title: 'Profil-Perfektionierer',
    icon: '💎',
    text: 'Ihre Positionierung ist klar und überzeugend – mit erkennbarem Profil, relevantem Kundenbezug und guter Umsetzung. Das schafft Vertrauen und macht Kommunikation effizient. Weiteres Potential liegt jetzt vor allem in der konsequenten Aktivierung und Umsetzung über die gesamte Organisation hinweg: dieselbe Klarheit über mehr Situationen, Teams und Touchpoints hinweg stabil halten. Wenn Sie hier konsequent bleiben, wird aus einem starken Image ein wiederholbarer, belastbarer Erfolgsfaktor.',
  },
  {
    min: 90,
    max: 100,
    title: 'Positionierungschampion',
    icon: '🏆',
    text: 'Sie spielen auf Benchmark-Niveau: Ihre Positionierung ist sehr klar, konsistent, relevant und wirkt wie ein roter Faden. Jetzt geht es weniger darum die Positionierung neu zu gestalten, sondern um Feinschliff und langfristige Relevanz im Markt: Präzision erhöhen, Verwässerung vermeiden, Updates bewusst steuern. So bleibt die Positionierung immer relevant, differenzierend und glaubwürdig, auch wenn Angebote sich verändern, neue Kundenbedürfnisse aufkommen oder der Markt sich bewegt.',
  },
];

export interface MatrixQuadrant {
  clarityHigh: boolean;
  executionHigh: boolean;
  title: string;
  icon: string;
  text: string;
}

export const matrixQuadrants: MatrixQuadrant[] = [
  {
    clarityHigh: true,
    executionHigh: true,
    title: 'Klar & Konsequent',
    icon: '⭐',
    text: 'Ihre Positionierung ist klar und wird konsequent umgesetzt. Das sorgt für Wiedererkennung, Effizienz und messbare Wirkung. Halten Sie diesen Kurs, schärfen Sie Details und sorgen Sie dafür, dass Wachstum die Differenzierung nicht verwässert.',
  },
  {
    clarityHigh: true,
    executionHigh: false,
    title: 'Strategie vor Umsetzung',
    icon: '💡',
    text: 'Die Richtung stimmt, aber sie kommt noch nicht verlässlich in die Umsetzung. Die Priorität sollte in der Aktivierung der Positionierung liegen. Übersetzen Sie die Kernthemen in wiederholbare Routinen, Botschaften und Assets, um Mitarbeitern und Kunden an allen Touchpoints ein klares Bild zu geben.',
  },
  {
    clarityHigh: false,
    executionHigh: true,
    title: 'Aktiv ohne Leitplanken',
    icon: '💪',
    text: 'Sie setzen viel um und sind sichtbar, doch ohne klare Leitplanken entsteht Streuverlust. Der Hebel liegt in einer klaren Fokussierung: Ziel definieren, Abgrenzung schärfen, Kernbotschaften festlegen. Dann wird aus Aktivität echte Wirkung.',
  },
  {
    clarityHigh: false,
    executionHigh: false,
    title: 'Neustart mit Potenzial',
    icon: '❓',
    text: 'Es fehlt aktuell an Orientierung und an konsequenter Umsetzung. Das ist kein Nachteil, sondern ein guter Ausgangspunkt für einen sauberen Aufbau. Starten Sie mit einem klaren Kernprofil und leiten Sie daraus einfache, konsistente Basics ab.',
  },
];

// Question IDs that map to each axis
export const clarityQuestionIds = ['M1', 'M2', 'M3', 'M4', 'M5', 'W1', 'W3', 'W4', 'U1', 'U2', 'U9'];
export const executionQuestionIds = ['M6', 'M7', 'M8', 'M9', 'W2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8'];

export function getMaturityLevel(score: number): MaturityLevel {
  return maturityLevels.find((l) => score >= l.min && score <= l.max) || maturityLevels[0];
}

export function getMatrixQuadrant(clarityHigh: boolean, executionHigh: boolean): MatrixQuadrant {
  return matrixQuadrants.find((q) => q.clarityHigh === clarityHigh && q.executionHigh === executionHigh)!;
}
