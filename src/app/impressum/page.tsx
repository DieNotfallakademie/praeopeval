import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum — Präoperative Evaluation',
}

export default function Impressum() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight">Impressum</h1>
            <p className="text-blue-300 text-xs mt-0.5">Präoperative Evaluation · notfallakademie.org</p>
          </div>
          <Link href="/" className="text-blue-200 hover:text-white text-sm transition-colors">
            ← Zurück zur App
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* §5 TMG */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Angaben gemäß §&nbsp;5 TMG
          </h2>
          <div className="text-sm text-slate-700 space-y-0.5">
            <p className="font-bold text-slate-900">Die Notfallakademie UG (haftungsbeschränkt)</p>
            <p>Europaallee 33</p>
            <p>67657 Kaiserslautern</p>
            <p>Deutschland</p>
          </div>
          <div className="text-sm text-slate-700 space-y-1 pt-3 border-t border-slate-100">
            <p>
              <span className="font-medium">Geschäftsführer:</span> Fabian Schmidt
            </p>
            <p>
              <span className="font-medium">Registergericht:</span>{' '}
              Amtsgericht Charlottenburg (Berlin)
            </p>
            <p>
              <span className="font-medium">Registernummer:</span> HRB 34226
            </p>
            <p>
              <span className="font-medium">USt-IdNr.:</span>{' '}
              <span className="bg-amber-100 text-amber-800 px-1 rounded text-xs">
                [USt-IdNr. eintragen, falls vorhanden]
              </span>
            </p>
          </div>
          <div className="text-sm text-slate-700 space-y-1 pt-3 border-t border-slate-100">
            <p>
              <span className="font-medium">Telefon:</span>{' '}
              <a href="tel:+4903028670692" className="hover:text-blue-600 transition-colors">
                030 2867 0692
              </a>
            </p>
            <p>
              <span className="font-medium">E-Mail:</span>{' '}
              <a href="mailto:admin@notfallakademie.org" className="text-blue-600 hover:underline">
                admin@notfallakademie.org
              </a>
            </p>
            <p>
              <span className="font-medium">Website:</span>{' '}
              <a href="https://notfallakademie.org" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                notfallakademie.org
              </a>
            </p>
          </div>
        </section>

        {/* Berufsrechtliche Angaben */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Berufsrechtliche Angaben (§&nbsp;5 Abs.&nbsp;1 Nr.&nbsp;5–8 TMG)
          </h2>
          <div className="text-sm text-slate-700 space-y-1.5 leading-relaxed">
            <p><span className="font-medium">Berufsbezeichnung des Geschäftsführers:</span> Arzt (verliehen in der Bundesrepublik Deutschland)</p>
            <p>
              <span className="font-medium">Zuständige Ärztekammer:</span>{' '}
              Ärztekammer Berlin
            </p>
            <p>
              <span className="font-medium">Berufsrechtliche Regelungen:</span>{' '}
              Berufsordnung der Ärztekammer Berlin sowie die einschlägigen Bestimmungen
              des Berliner Kammergesetzes für die Heilberufe (BlnKaG). Abrufbar unter:{' '}
              <a href="https://www.bundesaerztekammer.de" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline">www.bundesaerztekammer.de</a>.
            </p>
          </div>
        </section>

        {/* Medizinisch-fachlicher Haftungsausschluss */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Medizinisch-fachlicher Haftungsausschluss
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              Dieses Tool dient ausschließlich der <strong>Unterstützung medizinisch ausgebildeter
              Fachkräfte</strong> (Ärztinnen und Ärzte, Anästhesiepflegepersonal) bei der
              leitliniengerechten Dokumentation im Rahmen der präoperativen Evaluation.
              Es richtet sich <strong>nicht</strong> an medizinische Laien.
            </p>
            <p>
              Die berechneten Scores, Risikoeinschätzungen und Empfehlungen basieren auf
              publizierten Leitlinien (ESC/ESA 2022, DGAI/BDA 2024, DGAI Anämie 2023,
              ESAIC 2021) und wissenschaftlichen Quellen zum Zeitpunkt der Implementierung.
              Medizinische Leitlinien unterliegen regelmäßiger Überarbeitung; es obliegt
              dem Anwender, die Aktualität der zugrunde liegenden Empfehlungen zu prüfen.
            </p>
            <p>
              <strong>Das Tool ersetzt in keinem Fall die individuelle ärztliche Beurteilung,
              Untersuchung und Entscheidung.</strong> Für klinische Entscheidungen, die auf
              Basis der Ausgaben dieses Tools getroffen werden, trägt die behandelnde Ärztin
              bzw. der behandelnde Arzt die alleinige fachliche und rechtliche Verantwortung.
            </p>
            <p>
              Eine Haftung für die Richtigkeit, Vollständigkeit, Aktualität oder Zweckmäßigkeit
              der bereitgestellten Informationen und Berechnungen wird ausdrücklich ausgeschlossen,
              soweit nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
            </p>
          </div>
        </section>

        {/* Haftung für Inhalte */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Haftung für Inhalte (§&nbsp;7 TMG)
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Als Diensteanbieter sind wir gemäß §&nbsp;7 Abs.&nbsp;1 TMG für eigene Inhalte auf
            diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Eine Verpflichtung,
            übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen, besteht
            gemäß §§&nbsp;8 bis 10 TMG nicht.
          </p>
        </section>

        {/* Urheberrecht */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Urheberrecht
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Die durch die Notfallakademie UG erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung.
          </p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Die Notfallakademie UG (haftungsbeschränkt) · Alle Rechte vorbehalten.
          </p>
        </section>

        {/* Streitschlichtung */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            Streitschlichtung (§&nbsp;36 VSBG)
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:underline">ec.europa.eu/consumers/odr</a>.
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <div className="flex gap-4 text-sm pb-6">
          <Link href="/datenschutz" className="text-blue-600 hover:underline">Datenschutzerklärung</Link>
          <Link href="/" className="text-blue-600 hover:underline">Zurück zur App</Link>
        </div>

      </main>
    </div>
  )
}
