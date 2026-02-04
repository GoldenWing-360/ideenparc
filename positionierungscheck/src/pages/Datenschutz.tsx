import { Link } from 'react-router-dom';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm mb-8 transition-colors"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-bold text-navy mb-8">Datenschutzerklärung</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="font-medium text-navy mb-1">Allgemeine Hinweise</h3>
            <p className="text-sm text-gray-600">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
              Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
              Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
              identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              2. Verantwortliche Stelle
            </h2>
            <p className="text-sm text-gray-600">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website
              ist:
            </p>
            <p className="text-sm text-gray-600 mt-2">
              ideenparc GmbH
              <br />
              Mandlstraße 26
              <br />
              80802 München
              <br />
              <br />
              Telefon: +49 172 84 27 114
              <br />
              E-Mail: jbenkovich@ideenparc.net
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              3. Datenerfassung auf dieser Website
            </h2>
            <h3 className="font-medium text-navy mb-1">
              Positionierungscheck (Assessment)
            </h3>
            <p className="text-sm text-gray-600">
              Bei der Durchführung des Positionierungschecks werden Ihre Antworten
              ausschließlich lokal in Ihrem Browser verarbeitet. Es werden keine
              Assessment-Daten an unsere Server übertragen, solange Sie nicht
              ausdrücklich den Report per E-Mail anfordern.
            </p>

            <h3 className="font-medium text-navy mb-1 mt-4">
              Report-Anforderung (Lead-Formular)
            </h3>
            <p className="text-sm text-gray-600">
              Wenn Sie den detaillierten Report per E-Mail anfordern, erheben wir
              folgende Daten:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Diese Daten werden ausschließlich zur Zusendung des Reports verwendet.
              Es erfolgt kein Newsletter-Versand ohne gesonderte Einwilligung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              4. Ihre Rechte
            </h2>
            <p className="text-sm text-gray-600">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und
              den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder
              Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema
              personenbezogene Daten können Sie sich jederzeit an uns wenden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              5. Cookies
            </h2>
            <p className="text-sm text-gray-600">
              Diese Website verwendet derzeit keine Cookies. Sollten in Zukunft
              Cookies eingesetzt werden, werden Sie darüber informiert und um Ihre
              Einwilligung gebeten.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
