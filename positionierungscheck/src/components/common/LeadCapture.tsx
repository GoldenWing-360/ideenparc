import { useState } from 'react';
import { FileBarChart, CheckCircle2 } from 'lucide-react';

interface LeadCaptureProps {
  onSubmit?: (data: { name: string; email: string; company: string }) => void;
}

export default function LeadCapture({ onSubmit }: LeadCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [dsgvo, setDsgvo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !dsgvo) return;
    onSubmit?.({ name: name.trim(), email: email.trim(), company: company.trim() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green/10 border border-green/30 rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-green mx-auto mb-3" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-green mb-1">Vielen Dank, {name.split(' ')[0]}!</h3>
        <p className="text-gray-600" style={{ fontSize: '14px' }}>
          Ihre detaillierte Auswertung wird in Kürze an <strong>{email}</strong> gesendet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <FileBarChart className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-1">
          Detaillierte Auswertung per E-Mail
        </h3>
        <p className="text-gray-600 mb-5" style={{ fontSize: '14px' }}>
          Erhalten Sie einen ausführlichen Report mit personalisierten Handlungsempfehlungen.
        </p>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Kostenlos anfordern
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3 text-left">
            <div>
              <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="lead-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ihr vollständiger Name"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail *
              </label>
              <input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="lead-company" className="block text-sm font-medium text-gray-700 mb-1">
                Unternehmen
              </label>
              <input
                id="lead-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
              />
            </div>
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={dsgvo}
                onChange={(e) => setDsgvo(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-[#00ADE0]"
                required
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                <a href="/datenschutz" className="underline hover:text-gray-700">Datenschutzerklärung</a>{' '}
                zu. *
              </span>
            </label>
            <button
              type="submit"
              disabled={!dsgvo || !name.trim() || !email.trim()}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kostenlos anfordern
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
