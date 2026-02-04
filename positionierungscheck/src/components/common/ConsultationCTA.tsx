import { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { submitConsultation } from '../../services/leadService';

interface ConsultationCTAProps {
  onReset?: () => void;
}

export default function ConsultationCTA({ onReset }: ConsultationCTAProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [dsgvo, setDsgvo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !dsgvo) return;
    setSubmitting(true);
    await submitConsultation({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      message: message.trim() || undefined,
      type: 'consultation',
      timestamp: new Date().toISOString(),
      variant: 'standard',
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* CTA Card */}
      <div className="bg-gradient-to-br from-navy to-blue-dark rounded-2xl p-8 md:p-10 text-white">
        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#39A958' }} strokeWidth={1.5} />
            <h3 className="text-xl font-bold mb-2">Vielen Dank, {name.split(' ')[0]}!</h3>
            <p className="text-white/70" style={{ fontSize: '15px' }}>
              Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                <Calendar className="w-7 h-7 text-yellow" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                Lassen Sie uns über Ihr Ergebnis sprechen
              </h3>
              <p className="text-white/80 text-sm md:text-base mb-6 max-w-xl mx-auto" style={{ lineHeight: 1.7 }}>
                Auf Basis Ihrer Antworten und ergänzender Recherche durch uns erstellen wir einen erweiterten,
                kostenfreien Positionierungs-Check für Ihr Unternehmen und besprechen die Ergebnisse in einem
                persönlichen, 1-stündigen Gespräch.
              </p>
            </div>

            {!formOpen ? (
              <div className="text-center">
                <button
                  onClick={() => setFormOpen(true)}
                  className="inline-block bg-yellow hover:brightness-110 text-navy font-bold px-8 py-4 rounded-xl transition-all text-lg"
                >
                  Gespräch vereinbaren
                </button>
                <p className="text-white/60 text-sm mt-4">
                  Kostenfrei · Unverbindlich · Persönlich
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-left">
                <div>
                  <label htmlFor="consult-name" className="block text-sm font-medium text-white/70 mb-1">
                    Name *
                  </label>
                  <input
                    id="consult-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ihr vollständiger Name"
                    required
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="consult-email" className="block text-sm font-medium text-white/70 mb-1">
                    E-Mail *
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihre@email.de"
                    required
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="consult-phone" className="block text-sm font-medium text-white/70 mb-1">
                      Telefon
                    </label>
                    <input
                      id="consult-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="consult-company" className="block text-sm font-medium text-white/70 mb-1">
                      Unternehmen
                    </label>
                    <input
                      id="consult-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="consult-message" className="block text-sm font-medium text-white/70 mb-1">
                    Nachricht
                  </label>
                  <textarea
                    id="consult-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Optional – z.B. bevorzugte Zeiten oder spezifische Fragen"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                  />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dsgvo}
                    onChange={(e) => setDsgvo(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/30 accent-[#00ADE0]"
                    required
                  />
                  <span className="text-xs text-white/60 leading-relaxed">
                    Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                    <a href="/datenschutz" className="underline hover:text-white/80">Datenschutzerklärung</a>{' '}
                    zu. *
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!dsgvo || !name.trim() || !email.trim() || submitting}
                  className="w-full bg-yellow hover:brightness-110 text-navy font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {submitting ? 'Wird gesendet...' : 'Gespräch vereinbaren'}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {/* Reset Button */}
      {onReset && (
        <div className="text-center">
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700 text-sm underline underline-offset-2 transition-colors"
          >
            Check wiederholen
          </button>
        </div>
      )}
    </div>
  );
}
