'use client'

import clsx from 'clsx'
import { CheckCircle2, XCircle } from 'lucide-react'
import { FormState } from '@/lib/types'
import { buildDiagnostics, isAnaemia, anaemiaLines } from '@/lib/scoring'

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: 'Labor',
    items: [
      'Blutbild',
      'Kreatinin / eGFR',
      'Blutzucker / HbA1c',
      'Elektrolyte (Na⁺, K⁺)',
      'Gerinnungsstatus (INR, aPTT)',
      'Leberwerte',
    ],
  },
  {
    title: 'Kardiale Diagnostik',
    items: [
      'EKG (12-Kanal)',
      'hsTroponin I/T (prä- und postoperativ 24h+48h)',
      'BNP / NT-proBNP',
      'Echokardiographie (TTE)',
      'Nicht-invasiver Stresstest',
    ],
  },
  {
    title: 'Pulmonal',
    items: [
      'Spirometrie / Lungenfunktion',
      'Röntgen Thorax',
    ],
  },
]

export default function DiagnosticsGuide({ form, rcri, ariscat }: {
  form: FormState
  rcri: number
  ariscat: number | null
}) {
  const hasInputs = !!(form.surgicalRisk || form.age || form.rcriIschemicHD || form.rcriHeartFailure)

  if (!hasInputs) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-slate-400 text-sm leading-relaxed">
          Fülle zunächst Patientendaten und Eingriff aus (Schritt 1), um patientenspezifische Empfehlungen zu erhalten.
        </p>
      </div>
    )
  }

  const diags = buildDiagnostics(form, rcri, ariscat)
  const hb = parseFloat(form.hemoglobin)
  const hasAnemia = !isNaN(hb) && !!form.sex && isAnaemia(hb, form.sex)
  const anLines = hasAnemia ? anaemiaLines(hb, form.sex) : []

  return (
    <div className="space-y-5">
      {GROUPS.map(group => (
        <div key={group.title}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
            {group.title}
          </h3>
          <div className="space-y-1.5">
            {group.items.map(name => {
              const diag = diags.find(d => d.name === name)
              if (!diag) return null
              return (
                <div key={name} className={clsx('rounded-xl px-3 py-2.5 border',
                  diag.recommended ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'
                )}>
                  <div className="flex items-start gap-2">
                    {diag.recommended
                      ? <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    }
                    <div className="min-w-0">
                      <p className={clsx('text-sm leading-snug',
                        diag.recommended ? 'font-semibold text-blue-800' : 'text-slate-400'
                      )}>
                        {name}
                      </p>
                      <p className={clsx('text-xs mt-0.5 leading-snug',
                        diag.recommended ? 'text-blue-700' : 'text-slate-400'
                      )}>
                        {diag.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Anämie-Algorithmus — nur wenn Anämie vorliegt */}
      {hasAnemia && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2 px-1">
            Anämie-Algorithmus (PBM · DGAI 2023)
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-2">
            {anLines.map((line, i) => (
              <p key={i} className={clsx('text-xs leading-snug',
                i === 0 ? 'font-semibold text-red-800' : 'text-red-700'
              )}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center pb-2">
        ESC/ESA 2022 · DGAI/BDA 2024 · DGAI Anämie 2023
      </p>
    </div>
  )
}
