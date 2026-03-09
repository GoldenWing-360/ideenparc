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
  };
  phone?: string;
  message?: string;
  timestamp: string;
  variant: string;
}

// FormSubmit endpoint — emails go to jbenkovich@ideenparc.net
// No account needed — first submission triggers email activation
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/jbenkovich@ideenparc.net';

export async function submitLead(data: LeadData): Promise<boolean> {
  return sendToFormspree(data);
}

export async function submitConsultation(data: LeadData): Promise<boolean> {
  return sendToFormspree(data);
}

async function sendToFormspree(data: LeadData): Promise<boolean> {
  const r = data.results;
  const resultsText = r
    ? [
        `\n--- AUSWERTUNG ---`,
        `Gesamtscore: ${r.overallScore}%`,
        `Reifegrad: ${r.reifegrad}`,
        `Matrix-Quadrant: ${r.matrixQuadrant}`,
        ``,
        `Bereiche:`,
        `  Markt & Kunden: ${r.blockScores.markt}%`,
        `  Wettbewerb: ${r.blockScores.wettbewerb}%`,
        `  Mein Unternehmen: ${r.blockScores.unternehmen}%`,
        ``,
        `Strategische Klarheit: ${r.strategischeKlarheit}%`,
        `Umsetzungsstärke: ${r.umsetzungsstaerke}%`,
      ].join('\n')
    : '';

  const body = {
    _replyto: data.email,
    _subject: `Positionierungscheck: ${data.type === 'consultation' ? 'Gesprächsanfrage' : 'Ergebnis'} von ${data.name}`,
    _template: 'box',
    _captcha: 'false',
    Name: data.name,
    'E-Mail': data.email,
    Telefon: data.phone || '–',
    Unternehmen: data.company || '–',
    Nachricht: data.message || '–',
    Typ: data.type === 'consultation' ? 'Gesprächsanfrage' : 'Report',
    Zeitpunkt: new Date(data.timestamp).toLocaleString('de-DE'),
    Auswertung: resultsText || 'Keine Auswertung angehängt',
  };

  try {
    const res = await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    console.error('Formspree submission failed');
    return false;
  }
}
