'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ChevronLeft, ChevronRight, AlertCircle, AlertTriangle, Pill, X, MessageSquare } from 'lucide-react'
import clsx from 'clsx'
import { FormState, defaultFormState } from '@/lib/types'
import {
  calcRCRI, rcriRisk, calcARISCAT, ariscatRisk, calcSTOPBANG, stopBangRisk,
  calcPENFAST, penFastRisk, calcBMI, calcEGFR, isAnaemia,
  CFS_LABELS, CFS_DESCRIPTIONS, cfsRisk,
  hasActiveCardiacCondition, evaluateStentTiming, stressTestIndication,
  needsCoagulationWorkup, calcPackYears,
  difficultAirwayScore, difficultAirwayLabel,
  determineFastingCard, FASTING_CARD_INFO,
  generateProtocolText, buildAssessmentItems,
  calcISAR, delirRisk,
} from '@/lib/scoring'
import MedicationSearch from '@/components/MedicationSearch'

// ── Base UI ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inp = 'w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
const warnInp = 'w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-50'
const sel = inp

function CheckRow({ label, checked, onChange, description, warn }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; description?: string; warn?: boolean
}) {
  return (
    <label className={clsx('flex items-start gap-3 cursor-pointer rounded-xl px-3 py-3 border transition-colors',
      checked
        ? (warn ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300')
        : 'bg-white border-slate-200 hover:border-slate-300'
    )}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className={clsx('mt-0.5 h-4 w-4 rounded', warn ? 'text-red-600' : 'text-blue-600')} />
      <div>
        <span className={clsx('text-sm font-medium', warn ? 'text-red-800' : 'text-slate-800')}>{label}</span>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>}
      </div>
    </label>
  )
}

function RiskBadge({ level, label }: { level: 'low' | 'intermediate' | 'high'; label: string }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      level === 'low' && 'bg-green-100 text-green-800',
      level === 'intermediate' && 'bg-amber-100 text-amber-800',
      level === 'high' && 'bg-red-100 text-red-800',
    )}>{label}</span>
  )
}

function SecHeader({ title, color = 'blue' }: { title: string; color?: string }) {
  const map: Record<string, string> = {
    blue: 'bg-blue-600', red: 'bg-red-600', teal: 'bg-teal-600',
    violet: 'bg-violet-600', amber: 'bg-amber-600', rose: 'bg-rose-600',
    indigo: 'bg-indigo-600', slate: 'bg-slate-600',
  }
  return (
    <div className={clsx('rounded-xl px-4 py-2.5', map[color] ?? map.blue)}>
      <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
    </div>
  )
}

const STEP_TITLES = [
  'Patient & Eingriff',
  'Kardiales Risiko',
  'RCRI & Gebrechlichkeit',
  'Vorgeschichte & Atemweg',
  'Noxen & Reflux',
  'Blutung & Medikation',
  'Pulmonales Risiko & Allergie',
  'Nüchternheitskarte',
]

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PraeopEval() {
  const [form, setForm] = useState<FormState>(defaultFormState)
  const [step, setStep] = useState(0)
  const [resultTab, setResultTab] = useState<'assessment' | 'protocol'>('assessment')
  const [copied, setCopied] = useState(false)
  const [medOpen, setMedOpen] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function reset() {
    if (confirm('Alle Eingaben zurücksetzen?')) { setForm(defaultFormState); setStep(0) }
  }

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
  const packYears = calcPackYears(form.nox_cigPerDay, form.nox_smokingYears)

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
  const isar = useMemo(() => calcISAR(form), [form])
  const delirResult = useMemo(() => delirRisk(form, isar), [form, isar])
  const awScore = useMemo(() => difficultAirwayScore(form), [form])
  const awLabel = useMemo(() => difficultAirwayLabel(awScore), [awScore])
  const fastingCard = useMemo(() => determineFastingCard(form), [form])
  const protocolText = useMemo(() => generateProtocolText(form), [form])
  const assessmentItems = useMemo(() => buildAssessmentItems(form, rcri, ariscat, sbScore), [form, rcri, ariscat, sbScore])

  async function copyProtocol() {
    await navigator.clipboard.writeText(protocolText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const isResult = step === 8

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Header */}
      <header className="bg-blue-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div>
          <h1 className="text-base font-bold tracking-tight">Präoperative Evaluation</h1>
          <p className="text-blue-300 text-xs">ESC 2022 · DGAI 2024</p>
        </div>
        <button onClick={reset} className="text-blue-300 hover:text-white transition-colors p-1" title="Neue Evaluation">
          <RotateCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Progress bar */}
      {!isResult && (
        <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-200 sticky top-[57px] z-40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">{STEP_TITLES[step]}</span>
            <span className="text-xs text-slate-400">Schritt {step + 1} / 8</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 8) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5 pb-28 space-y-4">

          {/* ── STEP 0: Patient + Eingriff ───────────────────────────────── */}
          {step === 0 && <>
            <SecHeader title="Patientendaten" color="blue" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Alter (Jahre)">
                  <input type="number" inputMode="numeric" min={18} max={120} value={form.age}
                    onChange={e => set('age', e.target.value)} placeholder="72" className={inp} />
                </Field>
                <Field label="Geschlecht">
                  <select value={form.sex} onChange={e => set('sex', e.target.value as FormState['sex'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="male">Männlich</option>
                    <option value="female">Weiblich</option>
                  </select>
                </Field>
                <Field label="Gewicht (kg)">
                  <input type="number" inputMode="numeric" min={30} max={300} value={form.weight}
                    onChange={e => set('weight', e.target.value)} placeholder="80" className={inp} />
                </Field>
                <Field label="Größe (cm)">
                  <input type="number" inputMode="numeric" min={100} max={220} value={form.height}
                    onChange={e => set('height', e.target.value)} placeholder="175" className={inp} />
                </Field>
              </div>
              {bmi && (
                <div className={clsx('rounded-xl px-3 py-2 text-xs font-medium',
                  bmi < 18.5 || bmi >= 35 ? 'bg-amber-100 text-amber-800' :
                  bmi >= 30 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                )}>BMI: {bmi} kg/m²</div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kreatinin (mg/dL)">
                  <input type="number" inputMode="decimal" step={0.1} min={0.3} value={form.creatinine}
                    onChange={e => set('creatinine', e.target.value)} placeholder="1.1" className={inp} />
                </Field>
                <Field label="Hämoglobin (g/dL)">
                  <input type="number" inputMode="decimal" step={0.1} min={3} value={form.hemoglobin}
                    onChange={e => set('hemoglobin', e.target.value)} placeholder="13.5"
                    className={!isNaN(hb) && form.sex && isAnaemia(hb, form.sex) ? warnInp : inp} />
                </Field>
                <Field label="HbA1c (%)">
                  <input type="number" inputMode="decimal" step={0.1} min={4} max={20} value={form.hba1c}
                    onChange={e => set('hba1c', e.target.value)} placeholder="7.2"
                    className={!isNaN(hba1c) && hba1c > 8.5 ? warnInp : inp} />
                </Field>
                <Field label="ASA-Klasse">
                  <select value={form.asa} onChange={e => set('asa', e.target.value as FormState['asa'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="1">I – gesund</option>
                    <option value="2">II – leichte Systemerkrankung</option>
                    <option value="3">III – schwere Systemerkrankung</option>
                    <option value="4">IV – lebensbedrohlich</option>
                    <option value="5">V – moribund</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="NT-proBNP (ng/L)">
                  <input type="number" inputMode="numeric" min={0} value={form.ntprobnp}
                    onChange={e => set('ntprobnp', e.target.value)} placeholder="Schwelle ≥300"
                    className={!isNaN(ntprobnp) && ntprobnp >= 300 ? warnInp : inp} />
                </Field>
                <Field label="BNP (ng/L)">
                  <input type="number" inputMode="numeric" min={0} value={form.bnp}
                    onChange={e => set('bnp', e.target.value)} placeholder="Schwelle ≥92"
                    className={!isNaN(bnp) && bnp >= 92 ? warnInp : inp} />
                </Field>
              </div>
              {egfr !== null && (
                <div className={clsx('rounded-xl px-3 py-2 text-xs font-medium',
                  egfr >= 60 ? 'bg-green-100 text-green-800' :
                  egfr >= 30 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                )}>eGFR: {egfr} ml/min (CKD-EPI 2021)</div>
              )}
              {!isNaN(hb) && form.sex && isAnaemia(hb, form.sex) && (
                <div className="bg-red-100 text-red-800 rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  Anämie ({form.sex === 'male' ? '♂ <13,0' : '♀ <12,0'} g/dL)
                </div>
              )}
              {!isNaN(ntprobnp) && ntprobnp >= 300 && (
                <div className="bg-red-100 text-red-800 rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />NT-proBNP ≥300 ng/L → erhöhtes perioperatives Risiko
                </div>
              )}
              {!isNaN(hba1c) && hba1c > 8.5 && (
                <div className="bg-amber-100 text-amber-800 rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />HbA1c &gt;8,5 % → präoperative Optimierung empfohlen
                </div>
              )}
            </div>

            <SecHeader title="Geplanter Eingriff" color="teal" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <Field label="Eingriff / Beschreibung">
                <input type="text" value={form.surgeryDescription}
                  onChange={e => set('surgeryDescription', e.target.value)}
                  placeholder="z.B. Hüft-TEP links, Sigmaresektion …" className={inp} />
              </Field>
              <Field label="MACE-Risiko des Eingriffs (ESC 2022)">
                <select value={form.surgicalRisk} onChange={e => set('surgicalRisk', e.target.value as FormState['surgicalRisk'])} className={sel}>
                  <option value="">– wählen –</option>
                  <option value="low">Niedrig &lt;1 % — Katheter, Endoskopie, Katarakt, ambulant</option>
                  <option value="intermediate">Mittel 1–5 % — Orthopädie, Bauch-OP, Urologie, HNO</option>
                  <option value="high">Hoch &gt;5 % — Aorta, periphere Gefäße, große Gefäßeingriffe</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Operationsort (ARISCAT)">
                  <select value={form.surgicalSite} onChange={e => set('surgicalSite', e.target.value as FormState['surgicalSite'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="peripheral">Peripher / Oberflächlich</option>
                    <option value="upper-abdominal">Oberbauch / Intraperitoneal</option>
                    <option value="intrathoracic">Intrathorakal</option>
                  </select>
                </Field>
                <Field label="Geplante OP-Dauer">
                  <select value={form.surgeryDuration} onChange={e => set('surgeryDuration', e.target.value as FormState['surgeryDuration'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="<2h">&lt;2 Stunden</option>
                    <option value="2-3h">2–3 Stunden</option>
                    <option value=">3h">&gt;3 Stunden</option>
                  </select>
                </Field>
              </div>
              <Field label="Funktionelle Kapazität (METs)">
                <select value={form.functionalCapacity} onChange={e => set('functionalCapacity', e.target.value as FormState['functionalCapacity'])} className={sel}>
                  <option value="">– wählen –</option>
                  <option value="good">≥4 METs — Treppensteigen, flotte Gehstrecke, leichte Hausarbeit</option>
                  <option value="poor">&lt;4 METs — Dyspnoe oder Angina bei leichter Belastung</option>
                </select>
              </Field>
              <Field label="Dringlichkeit">
                <select value={form.emergencyClass} onChange={e => set('emergencyClass', e.target.value as FormState['emergencyClass'])} className={sel}>
                  <option value="">– wählen –</option>
                  <option value="elective">Elektiv</option>
                  <option value="N4">N4 – Eilig (innerhalb von Tagen)</option>
                  <option value="N3">N3 – Dringlich (≤6 h)</option>
                  <option value="N2">N2 – Notfalldringlich (1–6 h)</option>
                  <option value="N1">N1 – Sofortoperation (&lt;1 h)</option>
                  <option value="N0">N0 – Vitale Indikation / Reanimation</option>
                </select>
              </Field>
            </div>
          </>}

          {/* ── STEP 1: Kardiales Risiko ─────────────────────────────────── */}
          {step === 1 && <>
            {activeCardiac && (
              <div className="bg-red-600 text-white rounded-2xl px-4 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">Aktive kardiale Bedingung!</p>
                  <p className="text-xs text-red-100 mt-0.5">Elektiver Eingriff erst nach kardiologischer Stabilisierung (ESC 2022 Klasse I)</p>
                </div>
              </div>
            )}
            <SecHeader title="Aktive kardiale Bedingungen — Stopp-Kriterien ESC 2022" color="red" />
            <div className="space-y-2">
              <CheckRow label="Instabile / schwere Angina pectoris" checked={form.activeCardiac_unstableAngina}
                onChange={v => set('activeCardiac_unstableAngina', v)} warn
                description="CCS III–IV oder Angina in Ruhe" />
              <CheckRow label="Herzinfarkt vor <60 Tagen" checked={form.activeCardiac_recentMI}
                onChange={v => set('activeCardiac_recentMI', v)} warn
                description="STEMI oder NSTEMI innerhalb der letzten 60 Tage" />
              <CheckRow label="Dekompensierte Herzinsuffizienz" checked={form.activeCardiac_decompHF}
                onChange={v => set('activeCardiac_decompHF', v)} warn
                description="NYHA IV oder neu aufgetretenes Lungenödem" />
              <CheckRow label="Signifikante Arrhythmie" checked={form.activeCardiac_arrhythmia}
                onChange={v => set('activeCardiac_arrhythmia', v)} warn
                description="AV-Block Grad III, VT, SVT mit HF >100/min" />
              <CheckRow label="Schwere Aortenstenose" checked={form.activeCardiac_severeStenosisAo}
                onChange={v => set('activeCardiac_severeStenosisAo', v)} warn
                description="KÖF <1,0 cm² und/oder Gradient >40 mmHg" />
              <CheckRow label="Schwere Mitralklappenstenose" checked={form.activeCardiac_severeMitralStenosis}
                onChange={v => set('activeCardiac_severeMitralStenosis', v)} warn
                description="Klappenöffnungsfläche <1,5 cm²" />
            </div>

            <SecHeader title="Koronarer Stent (Timing)" color="red" />
            <div className="space-y-2">
              <CheckRow label="Drug-eluting Stent (DES) vorhanden" checked={form.stent_hasDES}
                onChange={v => set('stent_hasDES', v)}
                description="Mindestabstand 6 Monate vor elektiver OP (ESC 2022)" />
              <CheckRow label="Bare-metal Stent (BMS) vorhanden" checked={form.stent_hasBMS}
                onChange={v => set('stent_hasBMS', v)}
                description="Mindestabstand 4 Wochen vor elektiver OP" />
            </div>
            {(form.stent_hasDES || form.stent_hasBMS) && (
              <div className="bg-white rounded-2xl p-4 space-y-2 shadow-sm">
                <Field label="Monate seit Stent-Implantation">
                  <input type="number" inputMode="decimal" step={0.5} min={0} value={form.stent_monthsSinceImplant}
                    onChange={e => set('stent_monthsSinceImplant', e.target.value)} placeholder="z.B. 4"
                    className={stent.status === 'contraindicated' ? warnInp : inp} />
                </Field>
                {stent.status !== 'none' && (
                  <div className={clsx('rounded-xl px-3 py-2 text-sm',
                    stent.status === 'contraindicated' ? 'bg-red-100 text-red-800' :
                    stent.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  )}>{stent.message}</div>
                )}
              </div>
            )}
          </>}

          {/* ── STEP 2: RCRI + CFS ──────────────────────────────────────── */}
          {step === 2 && <>
            <SecHeader title="RCRI nach Lee (Revised Cardiac Risk Index)" color="indigo" />
            <div className="space-y-2">
              <CheckRow label="Hochrisiko-Eingriff (RCRI)" checked={form.rcriHighRiskSurgery}
                onChange={v => set('rcriHighRiskSurgery', v)}
                description="Intraperitoneal, intrathorakal oder suprainguinaler Gefäßeingriff" />
              <CheckRow label="Ischämische Herzerkrankung" checked={form.rcriIschemicHD}
                onChange={v => set('rcriIschemicHD', v)}
                description="Herzinfarkt-Anamnese, Angina pectoris, Nitratbedarf, Q-Zacken im EKG" />
              <CheckRow label="Herzinsuffizienz" checked={form.rcriHeartFailure}
                onChange={v => set('rcriHeartFailure', v)}
                description="Lungenödem, S3-Galopp, paroxysmale nächtliche Dyspnoe" />
              <CheckRow label="Zerebrovaskuläre Erkrankung" checked={form.rcriCerebrovascular}
                onChange={v => set('rcriCerebrovascular', v)}
                description="Schlaganfall oder TIA in der Anamnese" />
              <CheckRow label="Diabetes mellitus mit Insulintherapie" checked={form.rcriDiabetesInsulin}
                onChange={v => set('rcriDiabetesInsulin', v)} />
              <CheckRow label="Präoperatives Kreatinin >2,0 mg/dL (177 µmol/L)" checked={form.rcriCreatinineOver2}
                onChange={v => set('rcriCreatinineOver2', v)} />
            </div>
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="text-center">
                <span className="text-4xl font-bold text-slate-800">{rcri}</span>
                <span className="text-slate-400 text-sm">/6</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700">MACE: {rcriR.pct}</span>
                  <RiskBadge level={rcriR.level} label={rcriR.label} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Lee et al. 1999 · ESC 2022</p>
              </div>
            </div>
            {stressTest.indication !== 'none' && (
              <div className={clsx('rounded-2xl px-4 py-3 text-sm',
                stressTest.indication === 'recommended' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
              )}>
                <strong>Stresstest:</strong> {stressTest.reason}
              </div>
            )}

            <SecHeader title="Clinical Frailty Scale (CFS)" color="violet" />
            <div className="bg-white rounded-2xl p-3 space-y-1 shadow-sm">
              {([1,2,3,4,5,6,7,8,9] as const).map(n => (
                <label key={n} className={clsx('flex items-start gap-3 cursor-pointer rounded-xl px-3 py-2.5 border transition-colors',
                  form.cfs === n
                    ? (n <= 3 ? 'border-green-400 bg-green-50' : n <= 5 ? 'border-amber-400 bg-amber-50' : 'border-red-400 bg-red-50')
                    : 'border-transparent hover:bg-slate-50'
                )}>
                  <input type="radio" name="cfs" value={n} checked={form.cfs === n}
                    onChange={() => set('cfs', n)} className="mt-0.5 h-4 w-4 text-violet-600" />
                  <div>
                    <span className={clsx('text-sm font-bold mr-2',
                      n <= 3 ? 'text-green-700' : n <= 5 ? 'text-amber-700' : 'text-red-700'
                    )}>{n}</span>
                    <span className="text-sm text-slate-700">{CFS_LABELS[n]}</span>
                    {form.cfs === n && CFS_DESCRIPTIONS[n] && (
                      <p className="text-xs text-slate-500 mt-0.5">{CFS_DESCRIPTIONS[n]}</p>
                    )}
                  </div>
                </label>
              ))}
              <label className={clsx('flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2 border transition-colors',
                form.cfs === 0 ? 'border-slate-300 bg-slate-50' : 'border-transparent'
              )}>
                <input type="radio" name="cfs" value={0} checked={form.cfs === 0}
                  onChange={() => set('cfs', 0)} className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400 italic">Nicht bewertet</span>
              </label>
            </div>

            <SecHeader title="Postoperatives Delirium-Risiko (ISAR-Screening)" color="amber" />
            <p className="text-xs text-slate-500 px-1">
              ISAR = Identification of Seniors At Risk. Empfohlen für Patienten ≥65 Jahre oder mit kognitiven Auffälligkeiten.
              Score ≥2 von 6 Punkten = erhöhtes Risiko. (Inouye et al. / ESAIC 2021)
            </p>
            <div className="space-y-2">
              <CheckRow label="Benötigte vor der Erkrankung regelmäßig Hilfe bei alltäglichen Aktivitäten (ADL)?"
                checked={form.delir_isar1} onChange={v => set('delir_isar1', v)} />
              <CheckRow label="War in den letzten 6 Monaten ≥1 Nacht im Krankenhaus?"
                checked={form.delir_isar2} onChange={v => set('delir_isar2', v)} />
              <CheckRow label="Erhebliche Sehprobleme (trotz Brille / Korrektionshilfe)?"
                checked={form.delir_isar3} onChange={v => set('delir_isar3', v)} />
              <CheckRow label="Erhebliche Hörprobleme (trotz Hörgerät)?"
                checked={form.delir_isar4} onChange={v => set('delir_isar4', v)} />
              <CheckRow label="Hat in letzter Zeit mehr Gedächtnisschwierigkeiten (vom Patienten berichtet)?"
                checked={form.delir_isar5} onChange={v => set('delir_isar5', v)} />
              <CheckRow label="Nimmt täglich ≥5 Medikamente ein?"
                checked={form.delir_isar6} onChange={v => set('delir_isar6', v)} />
            </div>

            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ISAR-Score</span>
                <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold',
                  isar >= 2 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                )}>{isar}/6 — {isar >= 2 ? 'erhöhtes Risiko' : 'niedriges Risiko'}</span>
              </div>
              <CheckRow label="Bekannte Demenz" checked={form.delir_knownDementia}
                onChange={v => set('delir_knownDementia', v)} warn />
              <CheckRow label="Vorbekanntes Delir (frühere Episode)" checked={form.delir_prevDelirium}
                onChange={v => set('delir_prevDelirium', v)} warn />
              <Field label="AMTS (Abbreviated Mental Test Score) 0–10 — leer lassen wenn nicht getestet">
                <input type="number" inputMode="numeric" min={0} max={10} value={form.delir_amts}
                  onChange={e => set('delir_amts', e.target.value)} placeholder="0–10 (≤6 = eingeschränkt)"
                  className={inp} />
              </Field>
              <p className="text-xs text-slate-400 leading-snug">
                AMTS-Kurzfragen: Alter, Geburtsdatum, Uhrzeit (nahe Stunde), aktuelles Jahr, Klinikname,
                zwei Personen erkennen, Adresse merken/wiederholen, 1. WK oder 2. WK Jahreszahl,
                aktueller Kanzler/Bundespräsident (10 Fragen, 1 Punkt je korrekte Antwort)
              </p>
            </div>

            <div className={clsx('rounded-2xl px-4 py-3 text-sm',
              delirResult.level === 'high' ? 'bg-red-100 text-red-800' :
              delirResult.level === 'intermediate' ? 'bg-amber-100 text-amber-800' :
              'bg-green-100 text-green-800'
            )}>
              <strong>{delirResult.label}</strong>
              <p className="text-xs mt-0.5 opacity-90">{delirResult.explanation}</p>
            </div>
          </>}

          {/* ── STEP 3: Vorgeschichte + Atemweg ─────────────────────────── */}
          {step === 3 && <>
            <SecHeader title="Anästhesiologische Vorgeschichte" color="blue" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <CheckRow label="Vorherige Allgemein- oder Regionalanästhesie" checked={form.prev_hadGA}
                onChange={v => set('prev_hadGA', v)} />
              {form.prev_hadGA && (
                <div className="pl-4 border-l-2 border-blue-200 space-y-3">
                  <Field label="Jahr der letzten Narkose">
                    <input type="number" inputMode="numeric" min={1950} max={2025} value={form.prev_year}
                      onChange={e => set('prev_year', e.target.value)} placeholder="z.B. 2019" className={inp} />
                  </Field>
                  <CheckRow label="Gut vertragen / komplikationslos" checked={form.prev_wellTolerated}
                    onChange={v => set('prev_wellTolerated', v)} />
                  {!form.prev_wellTolerated && (
                    <div className="space-y-2">
                      <CheckRow label="PONV (Übelkeit / Erbrechen)" checked={form.prev_ponv}
                        onChange={v => set('prev_ponv', v)} />
                      <CheckRow label="Schwieriger Atemweg" checked={form.prev_difficultAirway}
                        onChange={v => set('prev_difficultAirway', v)} warn />
                      <CheckRow label="Awareness (Wachheit unter Narkose)" checked={form.prev_awareness}
                        onChange={v => set('prev_awareness', v)} />
                      <Field label="Sonstige Komplikationen">
                        <input type="text" value={form.prev_otherComplication}
                          onChange={e => set('prev_otherComplication', e.target.value)}
                          placeholder="Beschreibung …" className={inp} />
                      </Field>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Familienanamnese — Anästhesie</p>
              <CheckRow label="Maligne Hyperthermie (MH) in der Familie" checked={form.prev_familyMH}
                onChange={v => set('prev_familyMH', v)} warn
                description="Triggerfreie Anästhesie obligat — Dantrolene bereitstellen" />
              <CheckRow label="Pseudocholinesterasemangel in der Familie" checked={form.prev_familyPseudocholin}
                onChange={v => set('prev_familyPseudocholin', v)} />
              <Field label="Sonstige familiäre Besonderheiten">
                <input type="text" value={form.prev_familyOther}
                  onChange={e => set('prev_familyOther', e.target.value)}
                  placeholder="Freitext …" className={inp} />
              </Field>
            </div>

            <SecHeader title="Atemweg-Evaluation" color="blue" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="grid grid-cols-1 gap-3">
                <Field label="Mallampati-Klasse">
                  <select value={form.aw_mallampati} onChange={e => set('aw_mallampati', e.target.value as FormState['aw_mallampati'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="1">I – Uvula + Gaumenbögen vollständig sichtbar</option>
                    <option value="2">II – Uvula teilweise durch Zunge verdeckt</option>
                    <option value="3">III – nur weicher Gaumen sichtbar</option>
                    <option value="4">IV – nur harter Gaumen sichtbar</option>
                  </select>
                </Field>
                <Field label="Mundöffnung">
                  <select value={form.aw_mouthOpening} onChange={e => set('aw_mouthOpening', e.target.value as FormState['aw_mouthOpening'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value=">4cm">&gt;4 cm — normal</option>
                    <option value="3-4cm">3–4 cm — eingeschränkt</option>
                    <option value="<3cm">&lt;3 cm — kritisch</option>
                  </select>
                </Field>
                <Field label="Thyreomentalabstand (TMA / TMD)">
                  <select value={form.aw_tmd} onChange={e => set('aw_tmd', e.target.value as FormState['aw_tmd'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value=">6.5cm">&gt;6,5 cm — normal</option>
                    <option value="6-6.5cm">6–6,5 cm — grenzwertig</option>
                    <option value="<6cm">&lt;6 cm — reduziert</option>
                  </select>
                </Field>
                <Field label="Reklination HWS">
                  <select value={form.aw_reklination} onChange={e => set('aw_reklination', e.target.value as FormState['aw_reklination'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="normal">Frei — normal</option>
                    <option value="limited">Eingeschränkt</option>
                    <option value="very_limited">Stark eingeschränkt</option>
                  </select>
                </Field>
                <Field label="ULBT (Upper Lip Bite Test)">
                  <select value={form.aw_ulbt} onChange={e => set('aw_ulbt', e.target.value as FormState['aw_ulbt'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="1">I – Unterkiefer bedeckt Oberlippe vollständig</option>
                    <option value="2">II – Unterkiefer bedeckt Oberlippe teilweise</option>
                    <option value="3">III – Unterkiefer erreicht Oberlippe nicht</option>
                  </select>
                </Field>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-1">Anatomische Besonderheiten</p>
              <div className="space-y-2">
                <CheckRow label="Bart (Maskenprobleme)" checked={form.aw_beard} onChange={v => set('aw_beard', v)} />
                <CheckRow label="Kurzer Hals" checked={form.aw_shortNeck} onChange={v => set('aw_shortNeck', v)} />
                <CheckRow label="Mikrognathie / Retrognathie" checked={form.aw_micrognathia} onChange={v => set('aw_micrognathia', v)} />
                <CheckRow label="Adipositas (BMI >35)" checked={form.aw_obese} onChange={v => set('aw_obese', v)} />
                <CheckRow label="Vorbekannter schwieriger Atemweg" checked={form.aw_previousDifficult}
                  onChange={v => set('aw_previousDifficult', v)} warn
                  description="Z.n. Intubationsschwierigkeit oder Awake-Intubation" />
              </div>
              <Field label="Notizen Atemweg">
                <input type="text" value={form.aw_notes}
                  onChange={e => set('aw_notes', e.target.value)} placeholder="Freitext …" className={inp} />
              </Field>
              <div className={clsx('rounded-xl px-3 py-2.5 text-sm font-medium',
                awLabel.level === 'low' ? 'bg-green-100 text-green-800' :
                awLabel.level === 'intermediate' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              )}>
                Atemweg-Prognose: {awLabel.text}
              </div>
            </div>
          </>}

          {/* ── STEP 4: Noxen + Reflux ──────────────────────────────────── */}
          {step === 4 && <>
            <SecHeader title="Noxen" color="rose" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <CheckRow label="Aktiver Raucher" checked={form.nox_smoking}
                onChange={v => set('nox_smoking', v)} />
              {form.nox_smoking && (
                <div className="pl-4 border-l-2 border-rose-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Zigaretten / Tag">
                      <input type="number" inputMode="numeric" min={1} max={100} value={form.nox_cigPerDay}
                        onChange={e => set('nox_cigPerDay', e.target.value)} placeholder="20" className={inp} />
                    </Field>
                    <Field label="Rauchjahre">
                      <input type="number" inputMode="numeric" min={1} max={80} value={form.nox_smokingYears}
                        onChange={e => set('nox_smokingYears', e.target.value)} placeholder="30" className={inp} />
                    </Field>
                  </div>
                  {packYears !== null && (
                    <div className="bg-amber-100 text-amber-800 rounded-xl px-3 py-2 text-sm font-medium">
                      Pack Years: {packYears} py
                    </div>
                  )}
                </div>
              )}
              {!form.nox_smoking && (
                <CheckRow label="Ex-Raucher" checked={form.nox_exSmoker}
                  onChange={v => set('nox_exSmoker', v)} />
              )}
              {form.nox_exSmoker && !form.nox_smoking && (
                <div className="pl-4 border-l-2 border-rose-200">
                  <Field label="Ex-Raucher seit (Jahr oder Angabe)">
                    <input type="text" value={form.nox_exSmokerSince}
                      onChange={e => set('nox_exSmokerSince', e.target.value)}
                      placeholder="z.B. 2015" className={inp} />
                  </Field>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <CheckRow label="Regelmäßiger Alkoholkonsum" checked={form.nox_alcohol}
                onChange={v => set('nox_alcohol', v)} />
              {form.nox_alcohol && (
                <div className="pl-4 border-l-2 border-rose-200">
                  <Field label="Gramm Alkohol pro Woche">
                    <input type="number" inputMode="numeric" min={0} value={form.nox_alcoholGPerWeek}
                      onChange={e => set('nox_alcoholGPerWeek', e.target.value)} placeholder="z.B. 100" className={inp} />
                  </Field>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <CheckRow label="Drogenkonsum" checked={form.nox_drugs}
                onChange={v => set('nox_drugs', v)} />
              {form.nox_drugs && (
                <div className="pl-4 border-l-2 border-rose-200">
                  <Field label="Substanz(en)">
                    <input type="text" value={form.nox_drugsText}
                      onChange={e => set('nox_drugsText', e.target.value)}
                      placeholder="z.B. Cannabis, Kokain …" className={inp} />
                  </Field>
                </div>
              )}
            </div>

            <SecHeader title="Reflux / GERD / Aspirationsrisiko" color="amber" />
            <div className="space-y-2">
              <CheckRow label="Sodbrennen / bekannte GERD" checked={form.reflux_heartburn}
                onChange={v => set('reflux_heartburn', v)}
                description="Ja → Bitte folgende Fragen beantworten" />
              {form.reflux_heartburn && (
                <div className="pl-4 border-l-2 border-amber-200 space-y-2">
                  <CheckRow label="Auch unabhängig von Mahlzeiten / in Ruhe?"
                    checked={form.reflux_mealIndependent}
                    onChange={v => set('reflux_mealIndependent', v)} warn
                    description="Nahrungsunabhängiger Reflux → erhöhtes Aspirationsrisiko → Gelbe Karte" />
                  <CheckRow label="Nächtliche Hustenanfälle oder Erwachen durch Reflux?"
                    checked={form.reflux_nocturnalCough}
                    onChange={v => set('reflux_nocturnalCough', v)} warn
                    description="Nächtliche Symptome → erhöhtes Aspirationsrisiko → Gelbe Karte" />
                  <CheckRow label="Reflux im Flachliegen (z. B. beim Umlagern)" checked={form.reflux_atRest}
                    onChange={v => set('reflux_atRest', v)} warn
                    description="Lageabhängiger Reflux → erhöhtes Aspirationsrisiko → Gelbe Karte" />
                  <CheckRow label="Regurgitation (spontaner Rückfluss in Mund / Rachen)" checked={form.reflux_regurgitation}
                    onChange={v => set('reflux_regurgitation', v)} warn
                    description="Hohes Aspirationsrisiko → Gelbe Karte" />
                </div>
              )}
              {!form.reflux_heartburn && (
                <>
                  <CheckRow label="Reflux im Flachliegen" checked={form.reflux_atRest}
                    onChange={v => set('reflux_atRest', v)} warn
                    description="Erhöhtes Aspirationsrisiko → Gelbe Nüchternheitskarte" />
                  <CheckRow label="Regurgitation (spontaner Rückfluss)" checked={form.reflux_regurgitation}
                    onChange={v => set('reflux_regurgitation', v)} warn
                    description="Erhöhtes Aspirationsrisiko → Gelbe Nüchternheitskarte" />
                </>
              )}
            </div>
          </>}

          {/* ── STEP 5: Blutung + Medikation ────────────────────────────── */}
          {step === 5 && <>
            <SecHeader title="Blutungsanamnese / Gerinnungsdiagnostik" color="rose" />
            <p className="text-xs text-slate-500 px-1">Routinemäßige Gerinnungsdiagnostik ist nicht indiziert (DGAI 2024). Indikation nur bei klinischem Anhalt.</p>
            <div className="space-y-2">
              <CheckRow label="Antikoagulanzientherapie (VKA, DOAK, NMH)" checked={form.bleeding_anticoagulant}
                onChange={v => set('bleeding_anticoagulant', v)} />
              <CheckRow label="Spontanblutungen in der Anamnese" checked={form.bleeding_spontaneous}
                onChange={v => set('bleeding_spontaneous', v)}
                description="Ohne adäquates Trauma — Haut, Schleimhäute, Gelenke" />
              <CheckRow label="Verlängerte Blutung nach Eingriffen / Zahnextraktion" checked={form.bleeding_prolonged}
                onChange={v => set('bleeding_prolonged', v)} />
              <CheckRow label="Positive Blutungs-Familienanamnese" checked={form.bleeding_familyHistory}
                onChange={v => set('bleeding_familyHistory', v)} />
            </div>
            <div className={clsx('rounded-2xl px-4 py-3 text-sm',
              coag.needed ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
            )}>
              {coag.needed
                ? <><strong>Gerinnungsdiagnostik indiziert:</strong> {coag.reason}</>
                : 'Blutungsanamnese bland — keine Routine-Gerinnungsdiagnostik (DGAI 2024)'}
            </div>

            <SecHeader title="Aktuelle Medikation & Diagnosen" color="slate" />
            <div className="space-y-2">
              <CheckRow label="ACE-Hemmer oder Sartan" checked={form.hxACEorARB} onChange={v => set('hxACEorARB', v)}
                description="Am OP-Morgen pausieren (Hypotonie-Risiko)" />
              <CheckRow label="Beta-Blocker" checked={form.hxBetablocker} onChange={v => set('hxBetablocker', v)}
                description="Weiterführen — kein abruptes Absetzen!" />
              <CheckRow label="Diuretikum" checked={form.hxDiuretic} onChange={v => set('hxDiuretic', v)}
                description="Elektrolyte präoperativ prüfen" />
              <CheckRow label="SGLT-2-Inhibitor (Jardiance, Forxiga u.a.)" checked={form.hxSGLT2}
                onChange={v => set('hxSGLT2', v)} warn
                description="3–4 Tage präoperativ absetzen — euDKA-Risiko!" />
              <CheckRow label="GLP-1-Agonist (Ozempic, Victoza u.a.)" checked={form.hxGLP1}
                onChange={v => set('hxGLP1', v)} warn
                description="Wöchentlich: 1 Woche pausieren; täglich: OP-Tag pausieren — Aspirationsrisiko!" />
              <CheckRow label="Statin" checked={form.hxStatin} onChange={v => set('hxStatin', v)}
                description="Weiterführen — Absetzen erhöht kardiales Risiko" />
              <CheckRow label="Antikoagulanzien (VKA, DOAK, NMH)" checked={form.hxAnticoagulant}
                onChange={v => set('hxAnticoagulant', v)} />
              <CheckRow label="Thrombozytenaggregationshemmer (ASS, P2Y12)" checked={form.hxAntiplatelet}
                onChange={v => set('hxAntiplatelet', v)} />
              <CheckRow label="Arterielle Hypertonie" checked={form.hxHypertension} onChange={v => set('hxHypertension', v)} />
              <CheckRow label="Diabetes mellitus" checked={form.hxDiabetes} onChange={v => set('hxDiabetes', v)} />
              <CheckRow label="COPD" checked={form.hxCOPD} onChange={v => set('hxCOPD', v)} />
              <CheckRow label="Bekannte obstruktive Schlafapnoe (OSA)" checked={form.hxOSA} onChange={v => set('hxOSA', v)} />
              <CheckRow label="Valvuläre Herzerkrankung" checked={form.hxValvularDisease} onChange={v => set('hxValvularDisease', v)} />
              <CheckRow label="Reduzierte LV-Funktion" checked={form.hxPoorLVFunction} onChange={v => set('hxPoorLVFunction', v)} />
              <CheckRow label="Lebererkrankung" checked={form.hxLiverDisease} onChange={v => set('hxLiverDisease', v)} />
            </div>

          </>}

          {/* ── STEP 6: Pulmonales + STOP-BANG + PEN-FAST ───────────────── */}
          {step === 6 && <>
            <SecHeader title="ARISCAT-Score (Pulmonales Komplikationsrisiko)" color="teal" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <p className="text-xs text-slate-500">Alter, Hb, OP-Ort, OP-Dauer und Dringlichkeit werden aus den Eingaben übernommen.</p>
              <Field label="Präoperative SpO₂ (Raumluft)">
                <select value={form.ariscat_spo2} onChange={e => set('ariscat_spo2', e.target.value as FormState['ariscat_spo2'])} className={sel}>
                  <option value="">– wählen –</option>
                  <option value=">=96">≥96 % (0 Punkte)</option>
                  <option value="91-95">91–95 % (8 Punkte)</option>
                  <option value="<=90">≤90 % (24 Punkte)</option>
                </select>
              </Field>
              <CheckRow label="Respiratorische Infektion im letzten Monat" checked={form.ariscat_respInfection}
                onChange={v => set('ariscat_respInfection', v)} description="URTI oder LRTI (17 Punkte)" />
              {ariscat !== null && ariscatR && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-slate-800">{ariscat}</span>
                    <span className="text-slate-400 text-sm"> Pkt.</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-700">Pulm. Risiko: {ariscatR.pct}</span>
                      <RiskBadge level={ariscatR.level} label={ariscatR.label} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">≤25 niedrig · 26–44 mittel · ≥45 hoch (Canet et al. 2010)</p>
                  </div>
                </div>
              )}
            </div>

            <SecHeader title="STOP-BANG (Obstruktive Schlafapnoe)" color="rose" />
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="space-y-2">
                <CheckRow label="Schnarchen (laut, durch geschlossene Tür hörbar)" checked={form.sb_snoring}
                  onChange={v => set('sb_snoring', v)} />
                <CheckRow label="Müdigkeit tagsüber / Einschlafen" checked={form.sb_tired}
                  onChange={v => set('sb_tired', v)} />
                <CheckRow label="Atemstillstände beim Schlafen beobachtet" checked={form.sb_observed}
                  onChange={v => set('sb_observed', v)} />
                <CheckRow label="Bluthochdruck bekannt oder behandelt" checked={form.sb_pressure}
                  onChange={v => set('sb_pressure', v)} />
                <CheckRow label="Halsumfang >40 cm" checked={form.sb_neckOver40}
                  onChange={v => set('sb_neckOver40', v)} />
              </div>
              <div className="bg-slate-50 rounded-xl p-3 space-y-1 text-sm text-slate-600">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Automatisch berechnet</p>
                <p className={bmi && bmi > 35 ? 'font-semibold text-slate-800' : ''}>
                  BMI: {bmi ?? '?'} {bmi && bmi > 35 ? '→ >35 ✓' : bmi ? '→ ≤35' : ''}
                </p>
                <p className={!isNaN(age) && age > 50 ? 'font-semibold text-slate-800' : ''}>
                  Alter: {!isNaN(age) ? age : '?'} {!isNaN(age) && age > 50 ? '→ >50 ✓' : !isNaN(age) ? '→ ≤50' : ''}
                </p>
                <p className={form.sex === 'male' ? 'font-semibold text-slate-800' : ''}>
                  Geschlecht: {form.sex === 'male' ? 'Männlich ✓' : form.sex === 'female' ? 'Weiblich' : 'nicht angegeben'}
                </p>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-center">
                  <span className="text-3xl font-bold text-slate-800">{sbScore}</span>
                  <span className="text-slate-400 text-sm">/8</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700">OSA-Risiko</span>
                  <RiskBadge level={sbR.level} label={sbR.label} />
                </div>
              </div>
            </div>

            <SecHeader title="PEN-FAST (Penicillin-Allergie-Risiko)" color="amber" />
            <div className="space-y-2">
              <CheckRow label="Penicillin-Allergie oder -Unverträglichkeit in der Anamnese"
                checked={form.pf_hasPenicillinAllergy} onChange={v => set('pf_hasPenicillinAllergy', v)} />
            </div>
            {form.pf_hasPenicillinAllergy && (
              <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
                <Field label="P – Zeitpunkt der Reaktion">
                  <select value={form.pf_time} onChange={e => set('pf_time', e.target.value as FormState['pf_time'])} className={sel}>
                    <option value="">– wählen –</option>
                    <option value="<5years">Vor &lt;5 Jahren (2 Punkte)</option>
                    <option value=">=5years">Vor ≥5 Jahren oder unbekannt (1 Punkt)</option>
                  </select>
                </Field>
                <CheckRow label="E – Anaphylaxie oder Angioödem (2 Pkt.)" checked={form.pf_anaphylaxis}
                  onChange={v => set('pf_anaphylaxis', v)} warn
                  description="Urtikaria + Kreislaufreaktionen oder Schleimhautschwellung" />
                <CheckRow label="E – Schwere Hautreaktion / SCAR (2 Pkt.)" checked={form.pf_scar}
                  onChange={v => set('pf_scar', v)} warn
                  description="Stevens-Johnson, TEN, DRESS" />
                <CheckRow label="T – Medizinische Behandlung erforderlich (1 Pkt.)" checked={form.pf_treatment}
                  onChange={v => set('pf_treatment', v)} />
                {penFast !== null && penFastR && (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-slate-800">{penFast}</span>
                      <span className="text-slate-400 text-sm">/5</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">IgE-vermittelt: {penFastR.pct}</span>
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
          </>}

          {/* ── STEP 7: Nüchternheitskarte ──────────────────────────────── */}
          {step === 7 && <>
            <SecHeader title="Nüchternheitskarte" color="teal" />
            <p className="text-xs text-slate-500 px-1">
              Die Klassifikation erfolgt automatisch. Hier können weitere Kriterien ergänzt werden.
            </p>

            <div className="space-y-2">
              <CheckRow label="Ileus / Subileus" checked={form.fast_ileus}
                onChange={v => set('fast_ileus', v)} warn description="→ Rote Karte" />
              <CheckRow label="GI-Obstruktion" checked={form.fast_giObstruction}
                onChange={v => set('fast_giObstruction', v)} warn description="→ Rote Karte" />
              <CheckRow label="Abdominelle Notfall-OP" checked={form.fast_abdominalEmergency}
                onChange={v => set('fast_abdominalEmergency', v)} warn description="→ Rote Karte" />
              <CheckRow label="Pylorusstenose" checked={form.fast_pylorusStenosis}
                onChange={v => set('fast_pylorusStenosis', v)} warn description="→ Rote Karte" />
              <CheckRow label="Ileostomie" checked={form.fast_ileostomy}
                onChange={v => set('fast_ileostomy', v)} description="→ Gelbe Karte" />
              <CheckRow label="Gastroskopie / Endoskopie geplant" checked={form.fast_endoscopy}
                onChange={v => set('fast_endoscopy', v)} description="→ Gelbe Karte" />
              <CheckRow label="MRCP / EUS mit Sedierung" checked={form.fast_mrcp}
                onChange={v => set('fast_mrcp', v)} description="→ Gelbe Karte" />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Automatisch berücksichtigt</p>
              {[
                { label: 'Notfall N0–N2', active: ['N0','N1','N2'].includes(form.emergencyClass), note: `${form.emergencyClass} → Rot`, color: 'text-red-700' },
                { label: 'Notfall N3', active: form.emergencyClass === 'N3', note: 'N3 → Gelb', color: 'text-amber-700' },
                { label: 'GLP-1-Agonist', active: form.hxGLP1, note: 'Ja → Gelb', color: 'text-amber-700' },
                { label: 'Reflux mahlzeitenunabhängig', active: form.reflux_mealIndependent, note: 'Ja → Gelb', color: 'text-amber-700' },
                { label: 'Nächtliche Hustenanfälle', active: form.reflux_nocturnalCough, note: 'Ja → Gelb', color: 'text-amber-700' },
                { label: 'Reflux im Flachliegen', active: form.reflux_atRest, note: 'Ja → Gelb', color: 'text-amber-700' },
                { label: 'Regurgitation', active: form.reflux_regurgitation, note: 'Ja → Gelb', color: 'text-amber-700' },
              ].map(({ label, active, note, color }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className={clsx('font-semibold text-xs', active ? color : 'text-slate-400')}>
                    {active ? note : 'Nein'}
                  </span>
                </div>
              ))}
            </div>

            <div className={clsx('rounded-2xl p-5 border-2 text-center', FASTING_CARD_INFO[fastingCard].bg)}>
              <p className={clsx('text-2xl font-bold', FASTING_CARD_INFO[fastingCard].color)}>
                {FASTING_CARD_INFO[fastingCard].label}
              </p>
              <p className={clsx('text-sm mt-1', FASTING_CARD_INFO[fastingCard].color)}>
                {FASTING_CARD_INFO[fastingCard].description}
              </p>
            </div>
          </>}

          {/* ── STEP 8: Result ───────────────────────────────────────────── */}
          {step === 8 && <>
            {activeCardiac && (
              <div className="bg-red-600 text-white rounded-2xl px-4 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">Aktive kardiale Bedingung!</p>
                  <p className="text-xs text-red-100 mt-0.5">Elektiver Eingriff erst nach kardiologischer Stabilisierung (ESC 2022 Klasse I).</p>
                </div>
              </div>
            )}
            {stent.status === 'contraindicated' && (
              <div className="bg-red-600 text-white rounded-2xl px-4 py-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">Stent-Kontraindikation!</p>
                  <p className="text-xs text-red-100 mt-0.5">{stent.message}</p>
                </div>
              </div>
            )}

            {/* Tab switcher */}
            <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm">
              <button onClick={() => setResultTab('assessment')}
                className={clsx('flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  resultTab === 'assessment' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                )}>
                Assessment
              </button>
              <button onClick={() => setResultTab('protocol')}
                className={clsx('flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  resultTab === 'protocol' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                )}>
                Protokolltext
              </button>
            </div>

            {/* Assessment tab */}
            {resultTab === 'assessment' && (() => {
              if (assessmentItems.length === 0) return (
                <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-8 text-center">
                  <p className="text-green-800 font-semibold text-lg">Keine kritischen Befunde</p>
                  <p className="text-green-700 text-sm mt-1">Standard-Protokoll — keine besonderen Maßnahmen erforderlich.</p>
                </div>
              )
              const grouped: Record<string, typeof assessmentItems> = {}
              assessmentItems.forEach(item => {
                if (!grouped[item.category]) grouped[item.category] = []
                grouped[item.category].push(item)
              })
              return (
                <div className="space-y-3">
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-4 py-2.5 bg-slate-700">
                        <p className="text-white text-xs font-bold uppercase tracking-wide">{cat}</p>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {items.map((item, i) => (
                          <div key={i} className={clsx('px-4 py-3 flex items-start gap-3',
                            item.urgency === 'critical' ? 'bg-red-50' :
                            item.urgency === 'high' ? 'bg-amber-50' :
                            item.urgency === 'medium' ? 'bg-blue-50' : 'bg-slate-50'
                          )}>
                            <span className={clsx('w-2 h-2 rounded-full flex-shrink-0 mt-1.5',
                              item.urgency === 'critical' ? 'bg-red-500' :
                              item.urgency === 'high' ? 'bg-amber-500' :
                              item.urgency === 'medium' ? 'bg-blue-500' : 'bg-slate-400'
                            )} />
                            <span className={clsx('text-sm leading-snug',
                              item.urgency === 'critical' ? 'text-red-800 font-semibold' :
                              item.urgency === 'high' ? 'text-amber-800 font-medium' :
                              item.urgency === 'medium' ? 'text-blue-800' : 'text-slate-700'
                            )}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* Protocol tab */}
            {resultTab === 'protocol' && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800">
                  <span className="text-white text-sm font-semibold">Protokolltext (Copy & Paste)</span>
                  <button onClick={copyProtocol}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">
                    {copied ? <><Check className="w-3.5 h-3.5" /> Kopiert!</> : <><Copy className="w-3.5 h-3.5" /> Kopieren</>}
                  </button>
                </div>
                <pre className="px-4 py-4 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                  {protocolText}
                </pre>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Hinweis:</strong> Dieses Tool unterstützt leitliniengerechte Dokumentation und ersetzt nicht die individuelle ärztliche Beurteilung. Alle Eingaben sind anonymisiert zu halten.
              </p>
            </div>
          </>}

          {/* Copyright footer */}
          <div className="border-t border-slate-200 pt-4 mt-2 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>© {new Date().getFullYear()} Die Notfallakademie UG (haftungsbeschränkt)</span>
              <Link href="/impressum" className="hover:text-blue-600 transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-blue-600 transition-colors">Datenschutz</Link>
            </div>
            <div className="flex justify-center">
              <a
                href={`mailto:admin@notfallakademie.org?subject=${encodeURIComponent('PräopEval Feedback')}&body=${encodeURIComponent('Mein Verbesserungsvorschlag:\n\n')}`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors border border-slate-200 rounded-full px-3 py-1 hover:border-blue-300"
              >
                <MessageSquare className="w-3 h-3" />
                Verbesserungsvorschlag einreichen
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Floating medication search button */}
      <button onClick={() => setMedOpen(true)}
        className="fixed bottom-20 right-3 z-50 bg-teal-600 text-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
        title="Medikamenten-Suche">
        <Pill className="w-4 h-4 flex-shrink-0" />
        <span>Medikamente</span>
      </button>

      {/* Medication search drawer */}
      {medOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMedOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-xl">
            <div className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-sm">Medikamenten-Suche</span>
              <button onClick={() => setMedOpen(false)} className="text-teal-200 hover:text-white p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <MedicationSearch />
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex gap-3 z-50">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Zurück
          </button>
        )}
        {step < 8 && (
          <button onClick={() => setStep(s => s + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            {step === 7 ? 'Ergebnis anzeigen' : 'Weiter'}
            {step < 7 && <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {step === 8 && (
          <button onClick={reset}
            className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Neue Evaluation
          </button>
        )}
      </div>

    </div>
  )
}
