export interface LeadData {
  name: string;
  email: string;
  company?: string;
  type: 'report' | 'consultation' | 'journey';
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
  'https://formsubmit.co/ajax/info@ideenparc.net',
  'https://formsubmit.co/ajax/tschnitzer@ideenparc.net',
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

// Anonymous notification fired when a visitor completes the check without
// submitting the contact form. No personal data — only the evaluation results.
export async function submitJourneyCompletion(
  results: NonNullable<LeadData['results']>
): Promise<boolean> {
  return sendToFormsubmit({
    name: '',
    email: '',
    type: 'journey',
    timestamp: new Date().toISOString(),
    variant: 'final',
    results,
  });
}

async function sendToFormsubmit(data: LeadData): Promise<boolean> {
  const r = data.results;
  const isJourney = data.type === 'journey';

  // Build structured body — each key becomes a row in the table template
  const body: Record<string, string> = {
    _subject: isJourney
      ? 'Positionierungscheck: Check abgeschlossen (anonym, ohne Kontaktdaten)'
      : `Positionierungscheck: ${data.type === 'consultation' ? 'Gesprächsanfrage' : 'Ergebnis'} von ${data.name}`,
    _template: 'table',
    _captcha: 'false',
  };

  // Only set reply-to when we actually have a contact email
  if (data.email) body._replyto = data.email;

  if (isJourney) {
    // No contact form was submitted — make that explicit for the recipient
    body['ℹ️ Hinweis'] = 'Ein Besucher hat den Positionierungscheck vollständig durchlaufen, aber KEIN Kontaktformular ausgefüllt. Es liegen daher keine Kontaktdaten vor.';
    body['📅 Zeitpunkt'] = new Date(data.timestamp).toLocaleString('de-DE');
  } else {
    // Kontaktdaten
    body['👤 Name'] = data.name;
    body['✉️ E-Mail'] = data.email;
    body['📞 Telefon'] = data.phone || '–';
    body['🏢 Unternehmen'] = data.company || '–';
    body['💬 Nachricht'] = data.message || '–';
    body['📅 Zeitpunkt'] = new Date(data.timestamp).toLocaleString('de-DE');
  }

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
