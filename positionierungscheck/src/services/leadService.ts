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

const RECIPIENTS = ['deni@goldenwing.at', 'benedikt@goldenwing.at'];

export async function submitLead(data: LeadData): Promise<boolean> {
  // TODO: Backend-Anbindung
  // Option A: Formspree (formspree.io) – kein eigenes Backend nötig
  // Option B: EmailJS (emailjs.com) – sendet direkt aus dem Browser
  // Option C: Eigene API (z.B. Vercel Serverless Function)

  console.log('Lead submitted:', data);
  console.log('Recipients:', RECIPIENTS);

  return new Promise((resolve) => setTimeout(() => resolve(true), 800));
}

export async function submitConsultation(data: LeadData): Promise<boolean> {
  // TODO: Backend-Anbindung

  console.log('Consultation request submitted:', data);
  console.log('Recipients:', RECIPIENTS);

  return new Promise((resolve) => setTimeout(() => resolve(true), 800));
}
