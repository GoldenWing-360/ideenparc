export interface LeadData {
  name: string;
  email: string;
  company?: string;
  type: 'report' | 'consultation';
  results?: {
    overallScore: number;
    reifegrad: string;
    matrixQuadrant: string;
    blockScores: {
      markt: number;
      wettbewerb: number;
      unternehmen: number;
    };
    strategischeKlarheit: number;
    umsetzungsstaerke: number;
    einzelantworten?: Array<{
      frage: string;
      block: string;
      prozent: number;
    }>;
  };
  phone?: string;
  message?: string;
  timestamp: string;
  variant: string;
}

// FormSubmit endpoints — each recipient needs separate activation
const FORMSUBMIT_URLS = [
  'https://formsubmit.co/ajax/benedikt@goldenwing.at',
  'https://formsubmit.co/ajax/deni@goldenwing.at',
  'https://formsubmit.co/ajax/jbenkovich@ideenparc.net',
];

const BLOCK_NAMES: Record<string, string> = {
  markt: 'Markt & Kunden',
  wettbewerb: 'Wettbewerb',
  unternehmen: 'Mein Unternehmen',
};

export async function submitLead(data: LeadData): Promise<boolean> {
  return sendToFormsubmit(data);
}

export async function submitConsultation(data: LeadData): Promise<boolean> {
  return sendToFormsubmit(data);
}

async function sendToFormsubmit(data: LeadData): Promise<boolean> {
  const r = data.results;

  // Build structured body — each key becomes a row in the table template
  const body: Record<string, string> = {
    _replyto: data.email,
    _subject: `Positionierungscheck: ${data.type === 'consultation' ? 'Gesprächsanfrage' : 'Ergebnis'} von ${data.name}`,
    _template: 'table',
    _captcha: 'false',

    // Kontaktdaten
    '👤 Name': data.name,
    '✉️ E-Mail': data.email,
    '📞 Telefon': data.phone || '–',
    '🏢 Unternehmen': data.company || '–',
    '💬 Nachricht': data.message || '–',
    '📅 Zeitpunkt': new Date(data.timestamp).toLocaleString('de-DE'),
  };

  if (r) {
    // Gesamtergebnis
    body['━━━━━━━━━━━━━━━━━━'] = '━━━ AUSWERTUNG ━━━';
    body['🎯 Gesamtscore'] = `${r.overallScore}%`;
    body['📊 Reifegrad'] = r.reifegrad;
    body['🧭 Matrix-Quadrant'] = r.matrixQuadrant;
    body['💡 Strategische Klarheit'] = `${r.strategischeKlarheit}%`;
    body['⚡ Umsetzungsstärke'] = `${r.umsetzungsstaerke}%`;

    // Bereichs-Scores
    body['━━━━━━━━━━━━━━━━'] = '━━━ BEREICHE ━━━';
    body['🔵 Markt & Kunden'] = `${r.blockScores.markt}%`;
    body['🟠 Wettbewerb'] = `${r.blockScores.wettbewerb}%`;
    body['🟢 Mein Unternehmen'] = `${r.blockScores.unternehmen}%`;

    // Einzelantworten
    if (r.einzelantworten && r.einzelantworten.length > 0) {
      body['━━━━━━━━━━━━━━'] = `━━━ EINZELANTWORTEN (${r.einzelantworten.length}) ━━━`;
      let currentBlock = '';
      r.einzelantworten.forEach((a, i) => {
        if (a.block !== currentBlock) {
          currentBlock = a.block;
          body[`── ${BLOCK_NAMES[a.block] || a.block} ──`] = '────────';
        }
        body[`${i + 1}. ${a.frage.substring(0, 80)}${a.frage.length > 80 ? '...' : ''}`] = `${a.prozent}%`;
      });
    }
  }

  try {
    const results = await Promise.all(
      FORMSUBMIT_URLS.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        }).then((res) => res.ok).catch(() => false)
      )
    );
    return results.some(Boolean);
  } catch {
    console.error('FormSubmit submission failed');
    return false;
  }
}
