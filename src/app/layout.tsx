import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Präoperative Evaluation',
  description: 'Leitliniengerechte präoperative Risikoabschätzung für elektive, nicht-kardiochirurgische Eingriffe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-slate-50 text-slate-900 font-sans">{children}</body>
    </html>
  )
}
