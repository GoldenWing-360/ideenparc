interface ConsultationCTAProps {
  onReset?: () => void;
}

export default function ConsultationCTA({ onReset }: ConsultationCTAProps) {
  return (
    <div className="space-y-6">
      {/* CTA Card */}
      <div className="bg-gradient-to-br from-navy to-blue-dark rounded-2xl p-8 md:p-10 text-white text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Lassen Sie uns über Ihr Ergebnis sprechen
        </h3>
        <p className="text-white/80 text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed">
          Auf Basis Ihrer Antworten und ergänzender Recherche durch uns erstellen wir einen erweiterten,
          kostenfreien Positionierungs-Check für Ihr Unternehmen und besprechen die Ergebnisse in einem
          persönlichen, 1-stündigen Gespräch. In diesem Austausch ordnen wir Ihre aktuelle Situation ein,
          diskutieren Ihre Zukunftsperspektive und leiten konkrete Handlungsempfehlungen für Marketing,
          Kommunikation und Positionierung ab.
        </p>
        <a
          href="mailto:jbenkovich@ideenparc.net?subject=Beratungsgespr%C3%A4ch%20Positionierungscheck"
          className="inline-block bg-yellow hover:brightness-110 text-navy font-bold px-8 py-4 rounded-xl transition-all text-lg"
        >
          Kostenloses Beratungsgespräch →
        </a>
        <p className="text-white/60 text-sm mt-4">
          Kostenfrei · Unverbindlich · Persönlich
        </p>
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
