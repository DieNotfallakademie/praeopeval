'use client'

import { useState } from 'react'
import { Search, Pill, AlertCircle } from 'lucide-react'
import { searchMedications, URGENCY_LABELS, type Medication } from '@/lib/medications'

export default function MedicationSearch() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Medication | null>(null)
  const results = searchMedications(query)
  const noResults = query.length >= 2 && results.length === 0

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null) }}
          placeholder="Handels- oder Wirkstoffname (min. 2 Zeichen) …"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Results list */}
      {results.length > 0 && !selected && (
        <ul className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {results.map(med => (
            <li key={med.id}>
              <button onClick={() => setSelected(med)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-800 text-sm">{med.genericName}</span>
                    <span className="text-slate-400 text-xs ml-2">({med.drugClass})</span>
                    <p className="text-xs text-slate-500 mt-0.5">{med.tradeNames.join(', ')}</p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Not found */}
      {noResults && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                &quot;{query}&quot; nicht in der Datenbank gefunden
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Bitte melden Sie das Medikament, damit es aufgenommen werden kann.
              </p>
            </div>
          </div>
          <a
            href={`mailto:admin@notfallakademie.org?subject=Medikament%20nicht%20gefunden%3A%20${encodeURIComponent(query)}&body=Hallo%2C%0A%0ADas%20Medikament%20%22${encodeURIComponent(query)}%22%20wurde%20in%20der%20pr%C3%A4operativen%20Evaluations-App%20nicht%20gefunden.%0A%0ABitte%20in%20die%20Datenbank%20aufnehmen.%0A%0ADanke`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Medikament melden
          </a>
        </div>
      )}

      {/* Selected medication detail */}
      {selected && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-slate-800">{selected.genericName}</h4>
              <p className="text-xs text-slate-500">{selected.drugClass}</p>
              <p className="text-xs text-slate-400 mt-0.5">Handelsnamen: {selected.tradeNames.join(', ')}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${URGENCY_LABELS[selected.urgency].color}`}>
              {URGENCY_LABELS[selected.urgency].label}
            </span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Perioperatives Management</p>
              <p className="text-sm text-slate-700 leading-relaxed">{selected.perioperativeManagement}</p>
            </div>
            {selected.renalNote && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Nierenfunktion</p>
                <p className="text-sm text-amber-800 leading-relaxed">{selected.renalNote}</p>
              </div>
            )}
          </div>
          <div className="px-4 pb-3">
            <button onClick={() => { setSelected(null); setQuery('') }}
              className="text-xs text-blue-600 hover:text-blue-800 underline">
              Neue Suche
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
