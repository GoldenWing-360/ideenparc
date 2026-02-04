import { Link } from 'react-router-dom';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm mb-8 transition-colors"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-bold text-navy mb-8">Impressum</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              ideenparc GmbH
              <br />
              Mandlstraße 26
              <br />
              80802 München
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">Vertreten durch</h2>
            <p>Jürgen Benkovich, Geschäftsführer</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">Kontakt</h2>
            <p>
              Telefon: +49 172 84 27 114
              <br />
              E-Mail: jbenkovich@ideenparc.net
              <br />
              Website:{' '}
              <a
                href="https://www.ideenparc.net"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.ideenparc.net
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              Registereintrag
            </h2>
            <p>
              Eintragung im Handelsregister.
              <br />
              Registergericht: Amtsgericht München
              <br />
              Registernummer: [wird ergänzt]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              [wird ergänzt]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Jürgen Benkovich
              <br />
              Mandlstraße 26
              <br />
              80802 München
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-navy mb-2">Haftungsausschluss</h2>
            <p className="text-sm text-gray-600">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
              keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG
              für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch
              nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
              überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
