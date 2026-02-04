export type BlockId = 'markt' | 'wettbewerb' | 'unternehmen';

export interface Question {
  id: string;
  blockId: BlockId;
  text: string;
}

export interface Block {
  id: BlockId;
  title: string;
  subtitle: string;
  color: string;
  questions: Question[];
}

export const blocks: Block[] = [
  {
    id: 'markt',
    title: 'Wie gut verstehen Sie Ihren Markt & Ihre Kunden?',
    subtitle: 'Eine überzeugende Positionierung entsteht nicht im Unternehmen, sondern im Kopf Ihrer Kunden.',
    color: '#00ADE0',
    questions: [
      { id: 'M1', blockId: 'markt', text: 'Ich habe mich ganz bewusst für meinen Zielmarkt entschieden und weiß auch, was nötig ist, um dort erfolgreich zu sein.' },
      { id: 'M2', blockId: 'markt', text: 'Ich kenne die Trends und Entwicklungen im Markt und habe schon eine Idee, wie man darauf reagieren kann.' },
      { id: 'M3', blockId: 'markt', text: 'Ich habe eine klare Entscheidung getroffen, welche Zielkunden ich angehen will und welche nicht.' },
      { id: 'M4', blockId: 'markt', text: 'Ich weiß genau, was Kunden von einem idealen Anbieter und seinen Produkten und Services erwarten.' },
      { id: 'M5', blockId: 'markt', text: 'Ich weiß, was meine Kunden nervt und frustriert: beim Einkauf, bei der Nutzung der Produkte, beim Service.' },
      { id: 'M6', blockId: 'markt', text: 'Meine Kunden wissen sehr gut, welche Kompetenzen mein Unternehmen hat und welchen Mehrwert es ihnen bringt.' },
      { id: 'M7', blockId: 'markt', text: 'Meine Marke und mein gesamtes Unternehmen werden von meinen Kunden genauso wahrgenommen, wie ich es mir vorstelle.' },
      { id: 'M8', blockId: 'markt', text: 'Mir und meinen Mitarbeitern fällt es leicht, einen Kunden in kürzester Zeit von unserem Angebot zu überzeugen.' },
      { id: 'M9', blockId: 'markt', text: 'Ich bin überzeugt, dass mein Unternehmen dem Kundenanspruch an einen idealen Anbieter perfekt entspricht und alle begeistert sind.' },
    ],
  },
  {
    id: 'wettbewerb',
    title: 'Wie klar unterscheiden Sie sich vom Wettbewerb?',
    subtitle: 'Wer nicht weiß, warum er gewinnt, wird irgendwann verlieren.',
    color: '#F39401',
    questions: [
      { id: 'W1', blockId: 'wettbewerb', text: 'Ich kenne meine Wettbewerber genau und weiß, welche Stärken und Schwächen jeder von ihnen besitzt.' },
      { id: 'W2', blockId: 'wettbewerb', text: 'Ich beobachte das Wettbewerbsumfeld genau und weiß schon früh, wenn neue Unternehmen auftauchen und welche Gefahr sie bringen.' },
      { id: 'W3', blockId: 'wettbewerb', text: 'Ich kenne die zentralen Wertversprechen meiner Wettbewerber und weiß, wie ich mich davon differenzieren kann.' },
      { id: 'W4', blockId: 'wettbewerb', text: 'Ich habe eine klare Idee, wie und wo ich jeden meiner Wettbewerber durch meine Produkte und Services schlagen kann.' },
    ],
  },
  {
    id: 'unternehmen',
    title: 'Wie glaubwürdig ist Ihre Positionierung und wie nachhaltig ist sie im Unternehmen verankert?',
    subtitle: 'Eine starke Positionierung wirkt nur, wenn sie intern verstanden und gelebt wird.',
    color: '#39A958',
    questions: [
      { id: 'U1', blockId: 'unternehmen', text: 'Ich kenne genau die Stärken und Fähigkeiten, die mein Unternehmen einzigartig machen. Ich weiß auch um meine Schwächen.' },
      { id: 'U2', blockId: 'unternehmen', text: 'Ich weiß genau, wie ich meine besonderen Kompetenzen am besten einsetze, um meine Kunden und Mitarbeiter langfristig zu begeistern.' },
      { id: 'U3', blockId: 'unternehmen', text: 'Mein Unternehmen hat ein klares, einfach formuliertes Wertversprechen, das jeder versteht – meine Kunden, meine Mitarbeiter und meine Partner.' },
      { id: 'U4', blockId: 'unternehmen', text: 'Ich bin mit der Kommunikation meiner Marke und meines Wertversprechens auf allen Kanälen (z.B. Website, Werbung, LinkedIn) zu 100% zufrieden.' },
      { id: 'U5', blockId: 'unternehmen', text: 'Ich bin überzeugt, dass alles, was ich in Marketing und Vertrieb an Zeit und Geld stecke, auf den Punkt trifft und direkten Erfolg liefert.' },
      { id: 'U6', blockId: 'unternehmen', text: 'Ich habe ein attraktives Image als Arbeitgeber. Es fällt mir leicht, motivierte und gut ausgebildete Mitarbeiter zu gewinnen und zu halten.' },
      { id: 'U7', blockId: 'unternehmen', text: 'Die Ziele meines Unternehmens werden von allen Mitarbeitern verstanden und geteilt. Jeder zieht am selben Strang.' },
      { id: 'U8', blockId: 'unternehmen', text: 'Alle Mitarbeiter stehen voller Engagement und Begeisterung hinter dem Unternehmen und arbeiten auch abteilungsübergreifend gut zusammen.' },
      { id: 'U9', blockId: 'unternehmen', text: 'Auch in schwierigen und unvorhersehbaren Zeiten folgen wir als Unternehmen einer klaren Richtung.' },
    ],
  },
];

export const allQuestions: Question[] = blocks.flatMap((b) => b.questions);
export const totalQuestions = allQuestions.length; // 22
