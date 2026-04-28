'use client'

import { useState, useMemo } from 'react'
import { Copy, Check, RotateCcw, ChevronDown, ChevronUp, AlertTriangle, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import { FormState, defaultFormState } from '@/lib/types'
import {
  calcRCRI, rcriRisk, calcARISCAT, ariscatRisk, calcSTOPBANG, stopBangRisk,
  calcPENFAST, penFastRisk, calcBMI, calcEGFR, isAnaemia, CFS_LABELS, cfsRisk,
  hasActiveCardiacCondition, evaluateStentTiming, stressTestIndication,
  interpretNTproBNP, interpretBNP, evaluateHbA1c, needsCoagulationWorkup,
  generateOutputText,
} from '@/lib/scoring'
import MedicationSearch from '@/components/MedicationSearch'

// ── Basis-UI ─────────────────────────────────────────────────────────────────

function SectionCard({ title, children, accent = 'blue', alert = false }: {
  title: string
  children: React.ReactNode
  accent?: 'blue' | 'teal' | 'violet' | 'rose' | 'amber' | 'indigo' | 'slate' | 'red'
  alert?: boolean
}) {
  const [open, setOpen] = useState(true)
  const colors: Record<string, string> = {
    blue: 'bg-blue-700', teal: 'bg-teal-700', violet: 'bg-violet-700',
    rose: 'bg-rose-700', amber: 'bg-amber-700', indigo: 'bg-indigo-700',
    slate: 'bg-slate-700', red: 'bg-red-700',
  }
  return (
    <div className={clsx('bg-white rounded-xl border shadow-sm overflow-hidden', alert ? 'border-red-400 ring-2 ring-red-300' : 'border-slate-200')}>
      <button
        onClick={() => setOpen(!open)}
        className={clsx('w-full flex items-center justify-between px-5 py-3 text-left', colors[accent])}
      >
        <span className="font-semibold text-white text-sm tracking-wide">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/70" /> : <ChevronDown className="w-4 h-4 text-white/70" />}
      </button>
      {open && <div className="px-5 py-4 space-y-3">{children}</div>}
    </div>
  )
}

function CheckRow({ label, checked, onChange, description, warn }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string; warn?: boolean
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className={clsx('mt-0.5 h-4 w-4 rounded border-slate-300 focus:ring-2', warn ? 'text-red-600 focus:ring-red-500' : 'text-blue-600 focus:ring-blue-500')} />
      <div>
        <span className={clsx('text-sm group-hover:text-slate-900', warn ? 'text-red-800 font-medium' : 'text-slate-800')}>{label}</span>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>}
      </div>
    </label>
  )
}

function RiskBadge({ level, label }: { level: 'low' | 'intermediate' | 'high'; label: string }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      level === 'low' && 'bg-green-100 text-green-800 border-green-200',
      level === 'intermediate' && 'bg-amber-100 text-amber-800 border-amber-200',
      level === 'high' && 'bg-red-100 text-red-800 border-red-200',
    )}>{label}</span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
const selectCls = inputCls
const warnInputCls = 'w-full border border-red-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50'

// ── Hauptseite ────────────────────────────────────────────────────────────────

export default function PraeopEval() {
  const [form, setForm] = useState<FormState>(defaultFormState)
  const [copied, setCopied] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Berechnete Werte
  const age = parseInt(form.age)
  const weight = parseFloat(form.weight)
  const height = parseFloat(form.height)
  const cr = parseFloat(form.creatinine)
  const hb = parseFloat(form.hemoglobin)
  const hba1c = parseFloat(form.hba1c)
  const ntprobnp = parseFloat(form.ntprobnp)
  const bnp = parseFloat(form.bnp)
  const bmi = !isNaN(weight) && !isNaN(height) ? calcBMI(weight, height) : null
  const egfr = !isNaN(cr) && !isNaN(age) && form.sex ? calcEGFR(cr, age, form.sex) : null

  const rcri = useMemo(() => calcRCRI(form), [form])
  const rcriR = useMemo(() => rcriRisk(rcri), [rcri])
  const ariscat = useMemo(() => calcARISCAT(form), [form])
  const ariscatR = useMemo(() => ariscat !== null ? ariscatRisk(ariscat) : null, [ariscat])
  const sbScore = useMemo(() => calcSTOPBANG(form), [form])
  const sbR = useMemo(() => stopBangRisk(sbScore), [sbScore])
  const penFast = useMemo(() => calcPENFAST(form), [form])
  const penFastR = useMemo(() => penFast !== null ? penFastRisk(penFast) : null, [penFast])
  const activeCardiac = useMemo(() => hasActiveCardiacCondition(form), [form])
  const stent = useMemo(() => evaluateStentTiming(form), [form])
  const stressTest = useMemo(() => stressTestIndication(form, rcri), [form, rcri])
  const coag = useMemo(() => needsCoagulationWorkup(form), [form])
  const hba1cEval = useMemo(() => !isNaN(hba1c) ? evaluateHbA1c(hba1c) : null, [hba1c])
  const outputText = useMemo(() => generateOutputText(form), [form])

  const autoBmiOver35 = bmi !== null && bmi > 35
  const autoAgeOver50 = !isNaN(age) && age > 50
  const autoMale = form.sex === 'male'

  async function copyOutput() {
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function reset() {
    if (confirm('Alle Eingaben zurücksetzen?')) setForm(defaultFormState)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-800 text-white px-6 py-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Präoperative Evaluation</h1>
            <p className="text-blue-200 text-xs mt-0.5">Elektive, nicht-kardiochirurgische Eingriffe · ESC 2022 / DGAI 2024</p>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Zurücksetzen
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* ── LINKE SPALTE ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* 1. Patientendaten */}
          <SectionCard title="1. Patientendaten" accent="blue">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Alter (Jahre)">
                <input type="number" min={18} max={120} value={form.age}
                  onChange={e => set('age', e.target.value)} placeholder="z.B. 72" className={inputCls} />
              </Field>
              <Field label="Geschlecht">
                <select value={form.sex} onChange={e => set('sex', e.target.value as FormState['sex'])} className={selectCls}>
                  <option value="">– wählen –</option>
                  <option value="male">Männlich</option>
                  <option value="female">Weiblich</option>
                </select>
              </Field>
              <Field label="Gewicht (kg)">
                <input type="number" min={30} max={300} value={form.weight}
                  onChange={e => set('weight', e.target.value)} placeholder="z.B. 80" className={inputCls} />
              </Field>
              <Field label="Größe (cm)">
                <input type="number" min={100} max={220} value={form.height}
                  onChange={e => set('height', e.target.value)} placeholder="z.B. 175" className={inputCls} />
              </Field>
              <Field label="Kreatinin (mg/dL)">
                <input type="number" step={0.1} min={0.3} value={form.creatinine}
                  onChange={e => set('creatinine', e.target.value)} placeholder="z.B. 1.1" className={inputCls} />
              </Field>
              <Field label="Hämoglobin (g/dL)">
                <input type="number" step={0.1} min={3} value={form.hemoglobin}
                  onChange={e => set('hemoglobin', e.target.value)} placeholder="z.B. 13.5" className={clsx(inputCls, !isNaN(hb) && form.sex && isAnaemia(hb, form.sex) ? 'border-red-400 bg-red-50' : '')} />
              </Field>
              <Field label="HbA1c (%) — falls bekannt">
                <input type="number" step={0.1} min={4} max={20} value={form.hba1c}
                  onChange={e => set('hba1c', e.target.value)} placeholder="z.B. 7.2"
                  className={clsx(inputCls, !isNaN(hba1c) && hba1c > 8.5 ? 'border-amber-400 bg-amber-50' : '')} />
              </Field>
              <Field label="ASA-Klasse">
                <select value={form.asa} onChange={e => set('asa', e.target.value as FormState['asa'])} className={selectCls}>
                  <option value="">– wählen –</option>
                  <option value="1">ASA I – gesund</option>
                  <option value="2">ASA II – leichte Systemerkrankung</option>
                  <option value="3">ASA III – schwere Systemerkrankung</option>
                  <option value="4">ASA IV – lebensbedrohlich</option>
                  <option value="5">ASA V – moribund</option>
                </select>
              </Field>
            </div>

            {/* Biomarker */}
            <div className="mt-1 grid grid-cols-2 gap-3">
              <Field label="NT-proBNP (ng/L) — falls vorliegend">
                <input type="number" min={0} value={form.ntprobnp}
                  onChange={e => set('ntprobnp', e.target.value)} placeholder="Schwelle ≥300"
                  className={clsx(inputCls, !isNaN(ntprobnp) && ntprobnp >= 300 ? 'border-red-400 bg-red-50' : '')} />
              </Field>
              <Field label="BNP (ng/L) — falls vorliegend">
                <input type="number" min={0} value={form.bnp}
                  onChange={e => set('bnp', e.target.value)} placeholder="Schwelle ≥92"
                  className={clsx(inputCls, !isNaN(bnp) && bnp >= 92 ? 'border-red-400 bg-red-50' : '')} />
              </Field>
            </div>

            {/* Auto-Badges */}
            {(bmi || egfr || (!isNaN(hb) && form.sex)) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {bmi && <span className={clsx('text-xs px-2 py-1 rounded-full font-medium border',
                  bmi < 18.5 || bmi > 30 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-green-100 text-green-800 border-green-200'
                )}>BMI: {bmi}</span>}
                {egfr && <span className={clsx('text-xs px-2 py-1 rounded-full font-medium border',
                  egfr >= 60 ? 'bg-green-100 text-green-800 border-green-200' :
                  egfr >= 30 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-red-100 text-red-800 border-red-200'
                )}>eGFR: {egfr} ml/min</span>}
                {!isNaN(hb) && form.sex && isAnaemia(hb, form.sex) && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium border bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Anämie
                  </span>
                )}
                {!isNaN(ntprobnp) && ntprobnp >= 300 && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium border bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> NT-proBNP ≥300
                  </span>
                )}
                {!isNaN(bnp) && bnp >= 92 && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium border bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> BNP ≥92
                  </span>
                )}
                {hba1cEval && hba1cEval.postpone && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium border bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> HbA1c {'>'} 8,5 %
                  </span>
                )}
              </div>
            )}
          </SectionCard>

          {/* 2. Aktive kardiale Bedingungen — STOPP-Kriterien */}
          <SectionCard title="2. Aktive kardiale Bedingungen (Stopp-Kriterien ESC 2022)" accent="red" alert={activeCardiac}>
            {activeCardiac && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800 font-medium">
                  Aktive kardiale Bedingung → Elektiver Eingriff erst nach kardiologischer Behandlung und Stabilisierung! (ESC 2022 Klasse I)
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 -mt-1">
              Diese Konditionen müssen VOR der RCRI-Bewertung ausgeschlossen/behandelt werden.
            </p>
            <div className="space-y-2">
              <CheckRow label="Instabile oder schwere Angina pectoris" checked={form.activeCardiac_unstableAngina}
                onChange={v => set('activeCardiac_unstableAngina', v)} warn
                description="CCS III–IV oder Angina in Ruhe" />
              <CheckRow label="Herzinfarkt vor <60 Tagen" checked={form.activeCardiac_recentMI}
                onChange={v => set('activeCardiac_recentMI', v)} warn
                description="STEMI oder NSTEMI innerhalb der letzten 60 Tage" />
              <CheckRow label="Dekompensierte Herzinsuffizienz" checked={form.activeCardiac_decompHF}
                onChange={v => set('activeCardiac_decompHF', v)} warn
                description="NYHA IV oder neu aufgetretene Dekompensation / Lungenödem" />
              <CheckRow label="Signifikante Arrhythmie" checked={form.activeCardiac_arrhythmia}
                onChange={v => set('activeCardiac_arrhythmia', v)} warn
                description="AV-Block Grad III, symptomatische ventrikuläre Arrhythmien, unkontrollierte SVT (HF >100/min), neu entdeckte VT" />
              <CheckRow label="Schwere Aortenstenose" checked={form.activeCardiac_severeStenosisAo}
                onChange={v => set('activeCardiac_severeStenosisAo', v)} warn
                description="Klappenöffnungsfläche <1,0 cm² und/oder mittlerer Gradient >40 mmHg" />
              <CheckRow label="Schwere Mitralklappenstenose" checked={form.activeCardiac_severeMitralStenosis}
                onChange={v => set('activeCardiac_severeMitralStenosis', v)} warn
                description="Klappenöffnungsfläche <1,5 cm²" />
            </div>
          </SectionCard>

          {/* 3. Koronarer Stent */}
          <SectionCard title="3. Koronarer Stent (Timing)" accent="red">
            <div className="space-y-2">
              <CheckRow label="Drug-eluting Stent (DES) vorhanden" checked={form.stent_hasDES}
                onChange={v => set('stent_hasDES', v)}
                description="Mindestabstand: 6 Monate bis zur elektiven OP (ESC 2022)" />
              <CheckRow label="Bare-metal Stent (BMS) vorhanden" checked={form.stent_hasBMS}
                onChange={v => set('stent_hasBMS', v)}
                description="Mindestabstand: 4 Wochen bis zur elektiven OP" />
            </div>
            {(form.stent_hasDES || form.stent_hasBMS) && (
              <Field label="Monate seit Stent-Implantation">
                <input type="number" step={0.5} min={0} value={form.stent_monthsSinceImplant}
                  onChange={e => set('stent_monthsSinceImplant', e.target.value)} placeholder="z.B. 4"
                  className={clsx(stent.status === 'contraindicated' ? warnInputCls : inputCls)} />
              </Field>
            )}
            {stent.status !== 'none' && (
              <div className={clsx('mt-1 rounded-lg px-3 py-2 text-sm border',
                stent.status === 'contraindicated' ? 'bg-red-50 border-red-300 text-red-800' :
                stent.status === 'warning' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                'bg-green-50 border-green-300 text-green-800'
              )}>
                {stent.message}
              </div>
            )}
          </SectionCard>

          {/* 4. Geplanter Eingriff */}
          <SectionCard title="4. Geplanter Eingriff" accent="teal">
            <Field label="Beschreibung">
              <input type="text" value={form.surgeryDescription}
                onChange={e => set('surgeryDescription', e.target.value)}
                placeholder="z.B. Hüft-TEP links, Sigmaresektion, Aorta-Bypass…" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Eingriffsbezogenes MACE-Risiko">
                <select value={form.surgicalRisk} onChange={e => set('surgicalRisk', e.target.value as FormState['surgicalRisk'])} className={selectCls}>
                  <option value="">– wählen –</option>
                  <option value="low">Niedrig (&lt;1 %)</option>
                  <option value="intermediate">Mittel (1–5 %)</option>
                  <option value="high">Hoch (&gt;5 %)</option>
                </select>
              </Field>
              <Field label="OP-Dauer (geplant)">
                <select value={form.surgeryDuration} onChange={e => set('surgeryDuration', e.target.value as FormState['surgeryDuration'])} className={selectCls}>
                  <option value="">– wählen –</option>
                  <option value="<2h">&lt;2 Stunden</option>
                  <option value="2-3h">2–3 Stunden</option>
                  <option value=">3h">&gt;3 Stunden</option>
                </select>
              </Field>
              <Field label="Operationsort (ARISCAT)">
                <select value={form.surgicalSite} onChange={e => set('surgicalSite', e.target.value as FormState['surgicalSite'])} className={selectCls}>
                  <option value="">– wählen –</option>
                  <option value="peripheral">Peripher / Oberflächlich</option>
                  <option value="upper-abdominal">Oberbauch / Intraperitoneal</option>
                  <option value="intrathoracic">Intrathorakal</option>
                </select>
              </Field>
              <Field label="Funktionelle Kapazität (METs)">
                <select value={form.functionalCapacity} onChange={e => set('functionalCapacity', e.target.value as FormState['functionalCapacity'])} className={selectCls}>
                  <option value="">– wählen –</option>
                  <option value="good">≥4 METs (Treppensteigen, flotte Gehstrecke)</option>
                  <option value="poor">&lt;4 METs (Dyspnoe / Angina bei leichter Belastung)</option>
                </select>
              </Field>
            </div>
            <CheckRow label="Notfalleingriff" checked={form.emergency} onChange={v => set('emergency', v)}
              description="Zeitlich dringlich — präoperative Evaluation eingeschränkt" />

            {/* Stresstest-Indikation live anzeigen */}
            {stressTest.indication !== 'none' && (
              <div className={clsx('mt-1 rounded-lg px-3 py-2 text-xs border',
                stressTest.indication === 'recommended' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-yellow-50 border-yellow-300 text-yellow-800'
              )}>
                <strong>Stresstest:</strong> {stressTest.reason}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-0.5">
              <p className="font-semibold mb-1">Eingriffs-Risikoklassen (ESC 2022):</p>
              <p><span className="font-medium text-green-700">Niedrig (&lt;1 %):</span> Oberflächlich, Katarakt, Endoskopie, Schilddrüse, Mamma, ambulant</p>
              <p><span className="font-medium text-amber-700">Mittel (1–5 %):</span> Intraperitoneal, Orthopädie (Hüfte/Wirbelsäule), Urologie, HNO, Prostatektomie, endovaskuläre Aortenreparatur</p>
              <p><span className="font-medium text-red-700">Hoch (&gt;5 %):</span> Aortenchirurgie, periphere Gefäßchirurgie, große Gefäßeingriffe</p>
            </div>
          </SectionCard>

          {/* 5. RCRI */}
          <SectionCard title="5. RCRI nach Lee (Revised Cardiac Risk Index)" accent="indigo">
            <div className="space-y-2">
              <CheckRow label="1. Hochrisiko-Eingriff (für den RCRI)" checked={form.rcriHighRiskSurgery}
                onChange={v => set('rcriHighRiskSurgery', v)}
                description="Intraperitoneal, intrathorakal oder suprainguinaler Gefäßeingriff (nicht identisch mit OP-Risikoklassen oben)" />
              <CheckRow label="2. Ischämische Herzerkrankung" checked={form.rcriIschemicHD}
                onChange={v => set('rcriIschemicHD', v)}
                description="Herzinfarkt-Anamnese, Angina pectoris, Nitratbedarf, positiver Belastungstest, EKG mit Q-Zacken" />
              <CheckRow label="3. Herzinsuffizienz" checked={form.rcriHeartFailure}
                onChange={v => set('rcriHeartFailure', v)}
                description="Lungenödem, bilaterale Rasselgeräusche, S3-Galopp, paroxysmale nächtliche Dyspnoe" />
              <CheckRow label="4. Zerebrovaskuläre Erkrankung" checked={form.rcriCerebrovascular}
                onChange={v => set('rcriCerebrovascular', v)}
                description="Schlaganfall oder TIA in der Anamnese" />
              <CheckRow label="5. Diabetes mellitus mit Insulintherapie" checked={form.rcriDiabetesInsulin}
                onChange={v => set('rcriDiabetesInsulin', v)} />
              <CheckRow label="6. Präoperatives Kreatinin >2,0 mg/dL (177 µmol/L)" checked={form.rcriCreatinineOver2}
                onChange={v => set('rcriCreatinineOver2', v)} />
            </div>
            <div className="mt-3 flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-3xl font-bold text-slate-800">{rcri}</span>
                <span className="text-slate-500 text-sm">/6</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-700">MACE-Risiko: {rcriR.pct}</span>
                  <RiskBadge level={rcriR.level} label={rcriR.label} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Lee et al. 1999 · ESC 2022</p>
              </div>
            </div>
          </SectionCard>

          {/* 6. Clinical Frailty Scale */}
          <SectionCard title="6. Clinical Frailty Scale (CFS)" accent="violet">
            <div className="space-y-1">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <label key={n} className={clsx('flex items-start gap-3 cursor-pointer rounded-lg px-3 py-2 border transition-colors',
                  form.cfs === n ? 'border-violet-400 bg-violet-50' : 'border-transparent hover:bg-slate-50'
                )}>
                  <input type="radio" name="cfs" value={n} checked={form.cfs === n}
                    onChange={() => set('cfs', n)}
                    className="mt-0.5 h-4 w-4 text-violet-600 border-slate-300 focus:ring-violet-500" />
                  <div>
                    <span className={clsx('text-sm font-bold mr-1.5',
                      n <= 3 ? 'text-green-700' : n <= 5 ? 'text-amber-700' : 'text-red-700')}>{n}</span>
                    <span className="text-sm text-slate-700">{CFS_LABELS[n]}</span>
                  </div>
                </label>
              ))}
              <label className={clsx('flex items-start gap-3 cursor-pointer rounded-lg px-3 py-2 border transition-colors',
                form.cfs === 0 ? 'border-slate-300 bg-slate-50' : 'border-transparent'
              )}>
                <input type="radio" name="cfs" value={0} checked={form.cfs === 0}
                  onChange={() => set('cfs', 0)}
                  className="mt-0.5 h-4 w-4 text-slate-400 border-slate-300" />
                <span className="text-sm text-slate-400 italic">Nicht bewertet</span>
              </label>
            </div>
            {form.cfs > 0 && (
              <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <RiskBadge level={cfsRisk(form.cfs)} label={`CFS ${form.cfs}/9`} />
                {form.cfs >= 5 && <span className="text-xs text-red-700 font-medium">Geriatrisches Konsil + Prehabilitation empfohlen</span>}
                {form.cfs >= 4 && form.cfs < 5 && <span className="text-xs text-amber-700">Erhöhtes Frailty-Risiko</span>}
              </div>
            )}
          </SectionCard>

          {/* 7. ARISCAT */}
          <SectionCard title="7. ARISCAT-Score (Pulmonales Komplikationsrisiko)" accent="teal">
            <p className="text-xs text-slate-500 -mt-1">Alter, Hb, OP-Ort, OP-Dauer und Notfall werden aus den vorherigen Abschnitten übernommen.</p>
            <Field label="Präoperative SpO₂ (Raumluft)">
              <select value={form.ariscat_spo2} onChange={e => set('ariscat_spo2', e.target.value as FormState['ariscat_spo2'])} className={selectCls}>
                <option value="">– wählen –</option>
                <option value=">=96">≥96 % (0 Punkte)</option>
                <option value="91-95">91–95 % (8 Punkte)</option>
                <option value="<=90">≤90 % (24 Punkte)</option>
              </select>
            </Field>
            <CheckRow label="Respiratorische Infektion im letzten Monat (URTI/LRTI)" checked={form.ariscat_respInfection}
              onChange={v => set('ariscat_respInfection', v)} description="17 Punkte" />
            <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border border-slate-200 space-y-0.5">
              <p className="font-semibold">Automatisch übernommene Werte:</p>
              <p>Alter: {!isNaN(age) ? `${age} J. → ${age > 80 ? '16' : age >= 51 ? '3' : '0'} Pkt.` : 'nicht eingegeben'}</p>
              <p>Hb: {!isNaN(hb) ? `${hb} g/dL → ${hb <= 10 ? '11 Pkt. (Anämie ≤10 g/dL)' : '0 Pkt.'}` : 'nicht eingegeben'}</p>
              <p>OP-Ort: {form.surgicalSite === 'intrathoracic' ? 'Intrathorakal → 24 Pkt.' : form.surgicalSite === 'upper-abdominal' ? 'Oberbauch → 15 Pkt.' : form.surgicalSite === 'peripheral' ? 'Peripher → 0 Pkt.' : 'nicht gewählt'}</p>
              <p>OP-Dauer: {form.surgeryDuration === '>3h' ? '>3h → 23 Pkt.' : form.surgeryDuration === '2-3h' ? '2–3h → 16 Pkt.' : form.surgeryDuration === '<2h' ? '<2h → 0 Pkt.' : 'nicht gewählt'}</p>
              <p>Notfall: {form.emergency ? 'Ja → 8 Pkt.' : 'Nein → 0 Pkt.'}</p>
            </div>
            {ariscat !== null && ariscatR && (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-3xl font-bold text-slate-800">{ariscat}</span>
                  <span className="text-slate-500 text-sm"> Pkt.</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">Pulmonales Risiko: {ariscatR.pct}</span>
                    <RiskBadge level={ariscatR.level} label={ariscatR.label} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">≤25 niedrig · 26–44 mittel · ≥45 hoch (Canet et al. 2010)</p>
                </div>
              </div>
            )}
          </SectionCard>

          {/* 8. STOP-BANG */}
          <SectionCard title="8. STOP-BANG (Obstruktive Schlafapnoe)" accent="rose">
            <p className="text-xs text-slate-500 -mt-1">BMI, Alter und Geschlecht werden automatisch berechnet.</p>
            <div className="space-y-2">
              <CheckRow label="S – Schnarchen" checked={form.sb_snoring} onChange={v => set('sb_snoring', v)}
                description="Laut schnarchen (lauter als Gespräch oder durch geschlossene Tür hörbar)" />
              <CheckRow label="T – Tired (Müdigkeit)" checked={form.sb_tired} onChange={v => set('sb_tired', v)}
                description="Oft tagsüber müde, erschöpft oder einschlafend" />
              <CheckRow label="O – Observed (beobachtet)" checked={form.sb_observed} onChange={v => set('sb_observed', v)}
                description="Atemstillstände beim Schlafen beobachtet" />
              <CheckRow label="P – Pressure (Bluthochdruck)" checked={form.sb_pressure} onChange={v => set('sb_pressure', v)}
                description="Bekannte Hypertonie oder in antihypertensiver Behandlung" />
              <CheckRow label="N – Neck (Halsumfang >40 cm)" checked={form.sb_neckOver40} onChange={v => set('sb_neckOver40', v)} />
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border border-slate-200 space-y-0.5">
              <p className="font-semibold">Auto-Kriterien:</p>
              <p className={autoBmiOver35 ? 'font-medium text-slate-800' : ''}>B – BMI: {bmi ?? '?'} {autoBmiOver35 ? '→ >35 ✓' : '→ ≤35'}</p>
              <p className={autoAgeOver50 ? 'font-medium text-slate-800' : ''}>A – Alter: {!isNaN(age) ? age : '?'} {autoAgeOver50 ? '→ >50 ✓' : '→ ≤50'}</p>
              <p className={autoMale ? 'font-medium text-slate-800' : ''}>G – Geschlecht: {form.sex === 'male' ? 'Männlich ✓' : form.sex === 'female' ? 'Weiblich' : 'nicht angegeben'}</p>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-3xl font-bold text-slate-800">{sbScore}</span>
                <span className="text-slate-500 text-sm">/8</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">OSA-Risiko</span>
                  <RiskBadge level={sbR.level} label={sbR.label} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">0–2 niedrig · 3–4 mittel · 5–8 hoch</p>
              </div>
            </div>
          </SectionCard>

          {/* 9. PEN-FAST */}
          <SectionCard title="9. PEN-FAST (Penicillin-Allergie-Risiko)" accent="amber">
            <CheckRow label="Penicillin-Allergie oder -Unverträglichkeit in der Anamnese" checked={form.pf_hasPenicillinAllergy}
              onChange={v => set('pf_hasPenicillinAllergy', v)} />
            {form.pf_hasPenicillinAllergy && (
              <div className="mt-2 space-y-3 pl-6 border-l-2 border-amber-200">
                <Field label="P – Zeitpunkt der Reaktion">
                  <select value={form.pf_time} onChange={e => set('pf_time', e.target.value as FormState['pf_time'])} className={selectCls}>
                    <option value="">– wählen –</option>
                    <option value="<5years">Vor &lt;5 Jahren (2 Punkte)</option>
                    <option value=">=5years">Vor ≥5 Jahren oder unbekannt (1 Punkt)</option>
                  </select>
                </Field>
                <CheckRow label="E – Anaphylaxie oder Angioödem" checked={form.pf_anaphylaxis}
                  onChange={v => set('pf_anaphylaxis', v)}
                  description="Urtikaria + Kreislauf-/Bronchospasmus oder Schleimhautschwellung (2 Punkte)" />
                <CheckRow label="E – Schwere Hautreaktion (SCAR)" checked={form.pf_scar}
                  onChange={v => set('pf_scar', v)}
                  description="Stevens-Johnson, TEN, DRESS — alternativ zu Anaphylaxie (2 Punkte)" />
                <CheckRow label="T – Medizinische Behandlung erforderlich" checked={form.pf_treatment}
                  onChange={v => set('pf_treatment', v)}
                  description="Arztbesuch, Medikament oder Hospitalisierung nötig (1 Punkt)" />
                {penFast !== null && penFastR && (
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-3xl font-bold text-slate-800">{penFast}</span>
                      <span className="text-slate-500 text-sm">/5</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">IgE-vermittelt: {penFastR.pct}</span>
                        <RiskBadge level={penFastR.level} label={penFastR.label} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {penFast <= 1 ? 'Penicillin mit Vorsicht vertretbar' :
                         penFast === 2 ? 'Allergologische Abklärung erwägen' :
                         penFast === 3 ? 'Allergologische Testung empfohlen' :
                         'Penicillin-Gruppe meiden → Allergologie'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SectionCard>

          {/* 10. Blutungsanamnese & Gerinnungsdiagnostik */}
          <SectionCard title="10. Blutungsanamnese / Gerinnungsdiagnostik" accent="rose">
            <p className="text-xs text-slate-500 -mt-1">Routinemäßige Gerinnungsdiagnostik ist NICHT indiziert (DGAI 2024). Indikation nur bei klinischem Anhalt.</p>
            <div className="space-y-2">
              <CheckRow label="Antikoagulanzientherapie (VKA, DOAK, NMH)" checked={form.bleeding_anticoagulant}
                onChange={v => set('bleeding_anticoagulant', v)} />
              <CheckRow label="Spontanblutungen in der Anamnese" checked={form.bleeding_spontaneous}
                onChange={v => set('bleeding_spontaneous', v)}
                description="Haut, Schleimhäute, Gelenke — ohne adäquates Trauma" />
              <CheckRow label="Verlängerte Blutung nach Eingriffen / Zahnextraktion" checked={form.bleeding_prolonged}
                onChange={v => set('bleeding_prolonged', v)}
                description="Länger als erwartet, transfusionspflichtig oder erneuter Eingriff nötig" />
              <CheckRow label="Positive Familienanamnese (Blutungsneigung)" checked={form.bleeding_familyHistory}
                onChange={v => set('bleeding_familyHistory', v)} />
            </div>
            <div className={clsx('mt-2 rounded-lg px-3 py-2 text-sm border',
              coag.needed ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-green-50 border-green-300 text-green-800'
            )}>
              {coag.needed ? `[X] Gerinnungsdiagnostik indiziert: ${coag.reason}` : '[ ] Keine Routine-Gerinnungsdiagnostik (DGAI 2024)'}
            </div>
          </SectionCard>

          {/* 11. Anamnese & Medikation */}
          <SectionCard title="11. Aktuelle Medikation & Anamnese (für Empfehlungen)" accent="slate">
            <div className="grid grid-cols-1 gap-1.5">
              <CheckRow label="ACE-Hemmer oder Sartan" checked={form.hxACEorARB} onChange={v => set('hxACEorARB', v)} />
              <CheckRow label="Beta-Blocker" checked={form.hxBetablocker} onChange={v => set('hxBetablocker', v)} />
              <CheckRow label="Diuretikum" checked={form.hxDiuretic} onChange={v => set('hxDiuretic', v)} />
              <CheckRow label="SGLT-2-Inhibitor (Jardiance, Forxiga, Invokana)" checked={form.hxSGLT2}
                onChange={v => set('hxSGLT2', v)} description="⚠ 3–4 Tage präoperativ absetzen (euDKA-Risiko)" />
              <CheckRow label="GLP-1-Agonist (Ozempic, Victoza, Byetta)" checked={form.hxGLP1}
                onChange={v => set('hxGLP1', v)} description="⚠ Gastroparese → Aspirationsrisiko; wöchentlich: 1 Woche vor OP absetzen" />
              <CheckRow label="Statin" checked={form.hxStatin} onChange={v => set('hxStatin', v)} />
              <CheckRow label="Antikoagulanzien (VKA, DOAK, NMH)" checked={form.hxAnticoagulant} onChange={v => set('hxAnticoagulant', v)} />
              <CheckRow label="Thrombozytenaggregationshemmer (ASS, P2Y12-Hemmer)" checked={form.hxAntiplatelet} onChange={v => set('hxAntiplatelet', v)} />
              <CheckRow label="Arterielle Hypertonie" checked={form.hxHypertension} onChange={v => set('hxHypertension', v)} />
              <CheckRow label="Diabetes mellitus (auch nicht-insulinpflichtig)" checked={form.hxDiabetes} onChange={v => set('hxDiabetes', v)} />
              <CheckRow label="COPD" checked={form.hxCOPD} onChange={v => set('hxCOPD', v)} />
              <CheckRow label="Bekannte obstruktive Schlafapnoe (OSA)" checked={form.hxOSA} onChange={v => set('hxOSA', v)} />
              <CheckRow label="Valvuläre Herzerkrankung" checked={form.hxValvularDisease} onChange={v => set('hxValvularDisease', v)} />
              <CheckRow label="Reduzierte LV-Funktion bekannt" checked={form.hxPoorLVFunction} onChange={v => set('hxPoorLVFunction', v)} />
              <CheckRow label="Lebererkrankung" checked={form.hxLiverDisease} onChange={v => set('hxLiverDisease', v)} />
            </div>
          </SectionCard>

          {/* 12. Medikamenten-Suche */}
          <SectionCard title="12. Medikamenten-Suche (perioperatives Management)" accent="teal">
            <MedicationSearch />
          </SectionCard>

        </div>

        {/* ── RECHTE SPALTE: Ergebnis ──────────────────────────────────── */}
        <div className="xl:sticky xl:top-20 space-y-4">

          {/* Warn-Banner aktive kardiale Bedingung */}
          {activeCardiac && (
            <div className="bg-red-600 text-white rounded-xl px-5 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Aktive kardiale Bedingung!</p>
                <p className="text-xs text-red-100 mt-0.5">Elektiver Eingriff erst nach kardiologischer Behandlung und Stabilisierung zulässig (ESC 2022 Klasse I).</p>
              </div>
            </div>
          )}

          {/* Stent-Warnung */}
          {stent.status === 'contraindicated' && (
            <div className="bg-red-600 text-white rounded-xl px-5 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Stent-Kontraindikation!</p>
                <p className="text-xs text-red-100 mt-0.5">{stent.message}</p>
              </div>
            </div>
          )}

          {/* Output */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
              <span className="font-semibold text-white text-sm">Befundbericht (Copy & Paste)</span>
              <button onClick={copyOutput}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg">
                {copied ? <><Check className="w-3.5 h-3.5" /> Kopiert!</> : <><Copy className="w-3.5 h-3.5" /> Kopieren</>}
              </button>
            </div>
            <pre className="px-5 py-4 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[80vh]">
              {outputText}
            </pre>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Hinweis:</strong> Dieses Tool unterstützt leitliniengerechte Dokumentation und ersetzt nicht die individuelle ärztliche Beurteilung. Alle Eingaben sind anonymisiert zu halten. Keine Haftung für klinische Entscheidungen.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
