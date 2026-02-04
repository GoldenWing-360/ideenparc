import { useState } from 'react';

interface LeadCaptureProps {
  onSubmit?: (data: { name: string; email: string }) => void;
}

export default function LeadCapture({ onSubmit }: LeadCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit?.({ name: name.trim(), email: email.trim() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green/10 border border-green/30 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">✉️</div>
        <h3 className="text-lg font-semibold text-green mb-1">Vielen Dank!</h3>
        <p className="text-gray-600 text-sm">
          Ihr Report wird an <strong>{email}</strong> gesendet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="text-center">
        <div className="text-3xl mb-2">📊</div>
        <h3 className="text-lg font-semibold text-navy mb-1">
          Detaillierte Auswertung per E-Mail
        </h3>
        <p className="text-gray-600 text-sm mb-4">
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
                Name
              </label>
              <input
                id="lead-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ihr vollständiger Name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
              />
            </div>
            <p className="text-xs text-gray-400">
              Kein Spam. Ihre Daten werden nur für den Report verwendet.
            </p>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Report anfordern
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
