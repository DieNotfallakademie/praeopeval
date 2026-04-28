import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — Präoperative Evaluation',
}

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight">Datenschutzerklärung</h1>
            <p className="text-blue-300 text-xs mt-0.5">Präoperative Evaluation · notfallakademie.org</p>
          </div>
          <Link href="/" className="text-blue-200 hover:text-white text-sm transition-colors">
            ← Zurück zur App
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            1. Verantwortlicher (Art.&nbsp;4 Nr.&nbsp;7 DSGVO)
          </h2>
          <div className="text-sm text-slate-700 space-y-0.5">
            <p className="font-bold text-slate-900">Die Notfallakademie UG (haftungsbeschränkt)</p>
            <p>Europaallee 33</p>
            <p>67657 Kaiserslautern</p>
            <p>Registergericht: Amtsgericht Charlottenburg (Berlin), HRB 34226</p>
            <p>Geschäftsführer: Fabian Schmidt</p>
            <p>Telefon: <a href="tel:+4903028670692" className="text-blue-600 hover:underline">030 2867 0692</a></p>
            <p>E-Mail: <a href="mailto:admin@notfallakademie.org" className="text-blue-600 hover:underline">admin@notfallakademie.org</a></p>
            <p>Web: <a href="https://notfallakademie.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">notfallakademie.org</a></p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            2. Keine Speicherung personenbezogener Daten
          </h2>
          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              Diese Webanwendung ist als <strong>rein clientseitiges Tool</strong> konzipiert. Es werden
              <strong> keine Patientendaten, Anwenderdaten oder sonstige personenbezogene Daten
              auf Servern gespeichert, übertragen oder verarbeitet</strong>.
            </p>
            <p>
              Alle Berechnungen und Eingaben finden ausschließlich im lokalen Arbeitsspeicher
              (RAM) des Browsers statt. Mit dem Schließen oder Neuladen der Seite werden alle
              eingegebenen Daten unwiderruflich gelöscht. Es findet keinerlei Persistenz statt.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 font-medium text-green-800">
              Es werden keine Cookies gesetzt, kein Tracking durchgeführt und keine
              Analyse- oder Werbedienste (z.&nbsp;B. Google Analytics) eingesetzt.
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            3. Server-Logfiles (Hosting)
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Beim Aufruf der Seite speichert der Webserver technisch notwendige Daten in
            Server-Logfiles. Diese umfassen:
          </p>
          <ul className="text-sm text-slate-700 list-disc list-inside space-y-0.5 ml-2">
            <li>IP-Adresse des zugreifenden Endgeräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Aufgerufene URL / Seite</li>
            <li>Browser-Typ und -Version (User Agent)</li>
            <li>Referrer-URL (sofern übermittelt)</li>
            <li>Übertragene Datenmenge</li>
          </ul>
          <p className="text-sm text-slate-700 leading-relaxed">
            Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und dienen
            ausschließlich der Sicherstellung des technischen Betriebs sowie der Abwehr
            von Angriffen. Rechtsgrundlage: Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO
            (berechtigtes Interesse). Speicherdauer: maximal 14 Tage, danach automatische Löschung.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            4. Medizinische Daten — Hinweis für Anwender
          </h2>
          <div className="text-sm text-slate-700 leading-relaxed space-y-2">
            <p>
              Obwohl serverseitig keine Patientendaten verarbeitet werden, weisen wir auf
              Folgendes hin:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Es dürfen <strong>keine identifizierenden Patientendaten</strong> (Name,
                Geburtsdatum, Versicherungsnummer o.&nbsp;ä.) in die Anwendung eingegeben werden.
              </li>
              <li>
                Die Anwendung ist für <strong>anonymisierte klinische Parameter</strong> konzipiert.
              </li>
              <li>
                Die Verantwortung für die Einhaltung der ärztlichen Schweigepflicht
                (§&nbsp;203 StGB) und der DSGVO beim konkreten Einsatz verbleibt beim
                anwendenden Arzt bzw. der anwendenden Einrichtung.
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            5. Ihre Betroffenenrechte (Art.&nbsp;15–22 DSGVO)
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Da diese Anwendung keine personenbezogenen Anwenderdaten speichert, sind die
            Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
            und Datenübertragbarkeit (Art.&nbsp;15–20 DSGVO) in der Praxis nicht anwendbar.
            Im Zusammenhang mit den Server-Logfiles können Sie Ihre Rechte unter{' '}
            <a href="mailto:admin@notfallakademie.org" className="text-blue-600 hover:underline">
              admin@notfallakademie.org
            </a>{' '}geltend machen.
          </p>
          <p className="text-sm text-slate-700">
            Beschwerden können an die zuständige Datenschutz-Aufsichtsbehörde gerichtet werden.
            Für in Berlin ansässige Unternehmen ist dies:{' '}
            <a href="https://www.datenschutz-berlin.de" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:underline">
              Berliner Beauftragte für Datenschutz und Informationsfreiheit
            </a>.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
            6. Aktualität
          </h2>
          <p className="text-sm text-slate-700">
            Stand: {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}.
            Diese Erklärung wird bei wesentlichen Änderungen des Dienstes oder der Rechtslage
            aktualisiert.
          </p>
        </section>

        <div className="flex gap-4 text-sm pb-6">
          <Link href="/impressum" className="text-blue-600 hover:underline">Impressum</Link>
          <Link href="/" className="text-blue-600 hover:underline">Zurück zur App</Link>
        </div>

      </main>
    </div>
  )
}
