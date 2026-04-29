import { FormState } from './types'

// ── Hilfsfunktionen ──────────────────────────────────────────────────────────
export function calcEGFR(cr: number, age: number, sex: 'male' | 'female'): number {
  const k = sex === 'female' ? 0.7 : 0.9
  const a = sex === 'female' ? -0.241 : -0.302
  return Math.round(142 * Math.pow(Math.min(cr/k,1),a) * Math.pow(Math.max(cr/k,1),-1.2) * Math.pow(0.9938,age) * (sex==='female'?1.012:1))
}

export function calcBMI(w: number, h: number): number {
  return Math.round((w / ((h/100)**2)) * 10) / 10
}

export function calcPackYears(cigPerDay: string, years: string): number | null {
  const c = parseFloat(cigPerDay), y = parseFloat(years)
  if (isNaN(c) || isNaN(y)) return null
  return Math.round((c / 20) * y * 10) / 10
}

export function isAnaemia(hb: number, sex: 'male' | 'female' | ''): boolean {
  return sex === 'male' ? hb < 13.0 : hb < 12.0
}

// ── Atemweg ───────────────────────────────────────────────────────────────────
export function difficultAirwayScore(f: FormState): number {
  let score = 0
  if (f.aw_mallampati === '3' || f.aw_mallampati === '4') score++
  if (f.aw_mouthOpening === '<3cm') score++
  if (f.aw_tmd === '<6cm') score++; else if (f.aw_tmd === '6-6.5cm') score += 0.5
  if (f.aw_reklination === 'very_limited') score++; else if (f.aw_reklination === 'limited') score += 0.5
  if (f.aw_ulbt === '3') score++; else if (f.aw_ulbt === '2') score += 0.5
  if (f.aw_beard) score += 0.5
  if (f.aw_shortNeck) score += 0.5
  if (f.aw_micrognathia) score++
  if (f.aw_previousDifficult) score += 2
  return score
}

export function difficultAirwayLabel(score: number): { level: 'low'|'intermediate'|'high'; text: string } {
  if (score === 0 && !['3','4'].includes('')) return { level: 'low', text: 'Atemweg unauffällig' }
  if (score < 1.5) return { level: 'low', text: 'Atemweg wahrscheinlich unkompliziert' }
  if (score < 3) return { level: 'intermediate', text: 'Schwieriger Atemweg möglich — Vorbereitung empfohlen' }
  return { level: 'high', text: 'Schwieriger Atemweg wahrscheinlich — erweiterte Vorbereitung obligat' }
}

// ── RCRI ──────────────────────────────────────────────────────────────────────
export function calcRCRI(f: FormState): number {
  return [f.rcriHighRiskSurgery, f.rcriIschemicHD, f.rcriHeartFailure,
          f.rcriCerebrovascular, f.rcriDiabetesInsulin, f.rcriCreatinineOver2].filter(Boolean).length
}

export function rcriRisk(s: number): { pct: string; label: string; level: 'low'|'intermediate'|'high' } {
  if (s === 0) return { pct: '~3,9 %', label: 'niedrig', level: 'low' }
  if (s === 1) return { pct: '~6,0 %', label: 'niedrig-moderat', level: 'low' }
  if (s === 2) return { pct: '~10,1 %', label: 'moderat', level: 'intermediate' }
  return { pct: '≥15 %', label: 'hoch', level: 'high' }
}

export function rcriPositiveItems(f: FormState): string[] {
  const i: string[] = []
  if (f.rcriHighRiskSurgery) i.push('Hochrisiko-Eingriff')
  if (f.rcriIschemicHD) i.push('Ischämische Herzerkrankung')
  if (f.rcriHeartFailure) i.push('Herzinsuffizienz')
  if (f.rcriCerebrovascular) i.push('Zerebrovaskuläre Erkrankung')
  if (f.rcriDiabetesInsulin) i.push('Diabetes (Insulin)')
  if (f.rcriCreatinineOver2) i.push('Kreatinin >2,0 mg/dL')
  return i
}

// ── Aktive kardiale Bedingungen ───────────────────────────────────────────────
export function hasActiveCardiacCondition(f: FormState): boolean {
  return f.activeCardiac_unstableAngina || f.activeCardiac_recentMI ||
    f.activeCardiac_decompHF || f.activeCardiac_arrhythmia ||
    f.activeCardiac_severeStenosisAo || f.activeCardiac_severeMitralStenosis
}

export function activeCardiacItems(f: FormState): string[] {
  const i: string[] = []
  if (f.activeCardiac_unstableAngina) i.push('Instabile / schwere Angina pectoris')
  if (f.activeCardiac_recentMI) i.push('Herzinfarkt <60 Tage')
  if (f.activeCardiac_decompHF) i.push('Dekompensierte Herzinsuffizienz')
  if (f.activeCardiac_arrhythmia) i.push('Signifikante Arrhythmie')
  if (f.activeCardiac_severeStenosisAo) i.push('Schwere Aortenstenose')
  if (f.activeCardiac_severeMitralStenosis) i.push('Schwere Mitralklappenstenose')
  return i
}

// ── Stent-Timing ──────────────────────────────────────────────────────────────
export type StentStatus = 'ok' | 'warning' | 'contraindicated' | 'none'

export function evaluateStentTiming(f: FormState): { status: StentStatus; message: string } {
  const months = parseFloat(f.stent_monthsSinceImplant)
  if (!f.stent_hasDES && !f.stent_hasBMS) return { status: 'none', message: '' }
  if (isNaN(months)) return { status: 'warning', message: 'Stent vorhanden — Implantationsdatum klären.' }
  if (f.stent_hasDES) {
    if (months < 6) return { status: 'contraindicated', message: `DES vor ${months} Monat(en) → elektive OP KONTRAINDIZIERT (<6 Monate).` }
    if (months < 12) return { status: 'warning', message: `DES vor ${months} Monat(en) → erhöhtes Risiko, kardiologische Rücksprache.` }
    return { status: 'ok', message: `DES vor ${months} Monat(en) — kein erhöhtes Stent-Thromboserisiko.` }
  }
  if (f.stent_hasBMS) {
    if (months < 1) return { status: 'contraindicated', message: `BMS vor ${months} Monat(en) → elektive OP KONTRAINDIZIERT (<4 Wochen).` }
    return { status: 'ok', message: `BMS vor ${months} Monat(en) — ≥4 Wochen, ASS weiterführen.` }
  }
  return { status: 'none', message: '' }
}

// ── Stresstest-Indikation ─────────────────────────────────────────────────────
export type StressTestIndication = 'none' | 'consider' | 'recommended'

export function stressTestIndication(f: FormState, rcri: number): { indication: StressTestIndication; reason: string } {
  const mid = f.surgicalRisk === 'intermediate' || f.surgicalRisk === 'high'
  if (!mid || rcri < 2) return { indication: 'none', reason: '' }
  if (f.functionalCapacity === 'good') return { indication: 'none', reason: '' }
  if (rcri >= 3 && f.functionalCapacity === 'poor')
    return { indication: 'recommended', reason: 'RCRI ≥3 + eingeschränkte Belastungstoleranz + mittleres/hohes OP-Risiko → Nicht-invasiver Stresstest empfohlen (ESC 2022 IIa)' }
  if (rcri === 2 && f.functionalCapacity === 'poor')
    return { indication: 'consider', reason: 'RCRI 2 + eingeschränkte Belastungstoleranz → Stresstest erwägen (ESC 2022 IIb)' }
  return { indication: 'none', reason: '' }
}

// ── ARISCAT ───────────────────────────────────────────────────────────────────
export function calcARISCAT(f: FormState): number | null {
  const age = parseInt(f.age), hb = parseFloat(f.hemoglobin)
  if (!f.surgicalSite || !f.surgeryDuration || !f.ariscat_spo2) return null
  let s = 0
  if (!isNaN(age)) { if (age > 80) s += 16; else if (age >= 51) s += 3 }
  if (f.ariscat_spo2 === '<=90') s += 24; else if (f.ariscat_spo2 === '91-95') s += 8
  if (f.ariscat_respInfection) s += 17
  if (!isNaN(hb) && hb <= 10) s += 11
  if (f.surgicalSite === 'intrathoracic') s += 24; else if (f.surgicalSite === 'upper-abdominal') s += 15
  if (f.surgeryDuration === '>3h') s += 23; else if (f.surgeryDuration === '2-3h') s += 16
  if (f.emergencyClass && f.emergencyClass !== 'elective') s += 8
  return s
}

export function ariscatRisk(s: number): { pct: string; label: string; level: 'low'|'intermediate'|'high' } {
  if (s <= 25) return { pct: '~1,6 %', label: 'niedrig', level: 'low' }
  if (s <= 44) return { pct: '~13,3 %', label: 'mittel', level: 'intermediate' }
  return { pct: '~42 %', label: 'hoch', level: 'high' }
}

// ── STOP-BANG ─────────────────────────────────────────────────────────────────
export function calcSTOPBANG(f: FormState): number {
  const age = parseInt(f.age), w = parseFloat(f.weight), h = parseFloat(f.height)
  const bmi = !isNaN(w) && !isNaN(h) ? calcBMI(w,h) : 0
  return [f.sb_snoring, f.sb_tired, f.sb_observed, f.sb_pressure,
    bmi > 35, !isNaN(age) && age > 50, f.sb_neckOver40, f.sex === 'male'].filter(Boolean).length
}

export function stopBangRisk(s: number): { label: string; level: 'low'|'intermediate'|'high' } {
  if (s <= 2) return { label: 'niedrig', level: 'low' }
  if (s <= 4) return { label: 'mittel', level: 'intermediate' }
  return { label: 'hoch', level: 'high' }
}

// ── PEN-FAST ──────────────────────────────────────────────────────────────────
export function calcPENFAST(f: FormState): number | null {
  if (!f.pf_hasPenicillinAllergy) return null
  let s = 0
  if (f.pf_time === '<5years') s += 2; else if (f.pf_time === '>=5years') s += 1
  if (f.pf_anaphylaxis || f.pf_scar) s += 2
  if (f.pf_treatment) s += 1
  return s
}

export function penFastRisk(s: number): { pct: string; label: string; level: 'low'|'intermediate'|'high' } {
  if (s <= 1) return { pct: '~1 %', label: 'sehr niedrig', level: 'low' }
  if (s === 2) return { pct: '~2 %', label: 'niedrig', level: 'low' }
  if (s === 3) return { pct: '~5 %', label: 'moderat', level: 'intermediate' }
  return { pct: '>20 %', label: 'hoch', level: 'high' }
}

// ── CFS ───────────────────────────────────────────────────────────────────────
export const CFS_LABELS: Record<number, string> = {
  1: 'Sehr fit', 2: 'Fit', 3: 'Gut zurechtkommend',
  4: 'Vulnerabel', 5: 'Leichtgradig gebrechlich',
  6: 'Mittelgradig gebrechlich', 7: 'Schwer gebrechlich',
  8: 'Sehr schwer gebrechlich', 9: 'Terminal erkrankt',
}

export const CFS_DESCRIPTIONS: Record<number, string> = {
  1: 'Robust, aktiv, energetisch, gut motiviert',
  2: 'Keine aktiven Erkrankungen, aber weniger fit als Stufe 1',
  3: 'Medizinische Probleme gut kontrolliert, nicht regelmäßig aktiv',
  4: 'Aktivitäten durch Symptome eingeschränkt, nicht pflegebedürftig',
  5: 'Hilfe bei anspruchsvolleren IADL (Finanzen, Transport)',
  6: 'Hilfe bei allen außerhäuslichen Aktivitäten und Haushalt',
  7: 'Vollständig abhängig für ADL',
  8: 'Vollständig abhängig, nahes Lebensende, erholt sich nicht mehr von Erkrankungen',
  9: 'Lebenserwartung <6 Monate',
}

export function cfsRisk(cfs: number): 'low'|'intermediate'|'high' {
  if (cfs <= 3) return 'low'; if (cfs <= 5) return 'intermediate'; return 'high'
}

// ── Delirium-Risiko (ISAR + kognitive Baseline) ───────────────────────────────

export function calcISAR(f: FormState): number {
  return [f.delir_isar1, f.delir_isar2, f.delir_isar3, f.delir_isar4, f.delir_isar5, f.delir_isar6]
    .filter(Boolean).length
}

export type DelirRiskLevel = 'low' | 'intermediate' | 'high'

export function delirRisk(f: FormState, isar: number): {
  level: DelirRiskLevel
  label: string
  explanation: string
  recommendations: string[]
} {
  const age = parseInt(f.age)
  const amts = parseInt(f.delir_amts)
  const cogImpaired = f.delir_knownDementia || (!isNaN(amts) && amts <= 6)
  const highRiskSurgery = f.surgicalRisk === 'high' || f.surgicalRisk === 'intermediate'
  const frailty = f.cfs >= 5

  const recs: string[] = []
  let level: DelirRiskLevel = 'low'

  if (f.delir_knownDementia) recs.push('Bekannte Demenz: Angehörige informieren, präoperative Orientierungshilfen (Hörgerät, Brille), Bezugsperson perioperativ einbinden')
  if (f.delir_prevDelirium) recs.push('Vorbekanntes Delir: erhöhte Wachsamkeit postoperativ, strukturiertes Delir-Monitoring (NuDESC oder 4AT)')
  if (isar >= 2 || cogImpaired) recs.push('Geriatrisches Konsil empfohlen (ISAR ≥2 / kognitive Einschränkung)')
  if (isar >= 2 || cogImpaired || frailty) {
    recs.push('Nicht-pharmakologisches Delir-Präventionsbündel: frühe Mobilisation, Schlaf-Wach-Rhythmus, ausreichende Hydration, Orientierungshilfen')
    recs.push('Anticholinergika, Benzodiazepine und Pethidin vermeiden')
    recs.push('Perioperative Schmerztherapie optimieren (schlecht kontrollierter Schmerz = Delir-Trigger)')
  }
  if (highRiskSurgery && (isar >= 2 || cogImpaired)) {
    recs.push('TIVA (Propofolnarkose) erwägen — möglicher Vorteil gegenüber Inhalationsanästhesie bei POD-Risiko (aktuelle Datenlage heterogen, ESAIC 2021)')
    recs.push('Regionale Anästhesieverfahren bevorzugen sofern möglich')
  }

  if (f.delir_knownDementia || (cogImpaired && isar >= 2) || f.delir_prevDelirium) {
    level = 'high'
  } else if (isar >= 2 || cogImpaired || frailty || (!isNaN(age) && age >= 75)) {
    level = 'intermediate'
  }

  const labels: Record<DelirRiskLevel, string> = {
    low: 'Niedriges POD-Risiko',
    intermediate: 'Erhöhtes POD-Risiko',
    high: 'Hohes POD-Risiko',
  }
  const explanations: Record<DelirRiskLevel, string> = {
    low: 'Kein wesentliches erhöhtes Delir-Risiko identifiziert.',
    intermediate: 'Erhöhtes Risiko für postoperatives Delir (POD): ISAR ≥2, Alter ≥75 J. oder Frailty.',
    high: 'Hohes POD-Risiko: Demenz, vorbekanntes Delir oder kognitive Einschränkung + mehrere Risikofaktoren.',
  }
  return { level, label: labels[level], explanation: explanations[level], recommendations: recs }
}

// ── HbA1c ─────────────────────────────────────────────────────────────────────
export function evaluateHbA1c(v: number): { postpone: boolean; label: string } {
  if (v > 10) return { postpone: true, label: `HbA1c ${v} % → stark erhöht: OP-Verschiebung und diabetologische Optimierung dringend empfohlen` }
  if (v > 8.5) return { postpone: true, label: `HbA1c ${v} % → erhöht (>8,5 %): präoperative Optimierung empfohlen, OP-Verschiebung erwägen` }
  if (v > 7.5) return { postpone: false, label: `HbA1c ${v} % → perioperatives Glukosemanagement sicherstellen` }
  return { postpone: false, label: `HbA1c ${v} % → akzeptabel` }
}

// ── Nüchternheitskarte ────────────────────────────────────────────────────────
export type FastingCard = 'red' | 'yellow' | 'green'

export function determineFastingCard(f: FormState): FastingCard {
  const isEmergencyN0N2 = f.emergencyClass === 'N0' || f.emergencyClass === 'N1' || f.emergencyClass === 'N2'
  if (f.fast_ileus || f.fast_giObstruction || f.fast_abdominalEmergency || f.fast_pylorusStenosis || isEmergencyN0N2) return 'red'
  // Diabetische Gastroparese: insulinpflichtiger DM oder schlecht eingestellter DM (HbA1c >8,5 %)
  const hba1cV = parseFloat(f.hba1c)
  const diabGastroparesis = f.rcriDiabetesInsulin || ((f.hxDiabetes || f.rcriDiabetesInsulin) && !isNaN(hba1cV) && hba1cV > 8.5)
  if (f.emergencyClass === 'N3' || f.hxGLP1 || f.fast_ileostomy || f.fast_endoscopy || f.fast_mrcp ||
    f.reflux_atRest || f.reflux_regurgitation || f.reflux_mealIndependent || f.reflux_nocturnalCough ||
    diabGastroparesis) return 'yellow'
  return 'green'
}

export const FASTING_CARD_INFO: Record<FastingCard, { label: string; color: string; bg: string; description: string }> = {
  red: { label: 'Rote Nüchternheitskarte', color: 'text-red-800', bg: 'bg-red-100 border-red-400', description: 'Erhöhtes Aspirationsrisiko / Notfall — spezielle Nüchternheitsmaßnahmen erforderlich' },
  yellow: { label: 'Gelbe Nüchternheitskarte', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-400', description: 'Erhöhte Vorsicht — modifizierte Nüchternheitsregeln beachten' },
  green: { label: 'Grüne Nüchternheitskarte', color: 'text-green-800', bg: 'bg-green-100 border-green-400', description: 'Standardnüchternheit — keine besonderen Maßnahmen erforderlich' },
}

// ── Gerinnungsindikation ──────────────────────────────────────────────────────
export function needsCoagulationWorkup(f: FormState): { needed: boolean; reason: string } {
  const r: string[] = []
  if (f.bleeding_anticoagulant || f.hxAnticoagulant) r.push('Antikoagulanzientherapie')
  if (f.bleeding_spontaneous) r.push('Spontanblutungen in Eigenanamnese')
  if (f.bleeding_prolonged) r.push('Verlängerte Blutung nach Eingriffen')
  if (f.bleeding_familyHistory) r.push('Positive Familienanamnese')
  if (f.hxLiverDisease) r.push('Lebererkrankung')
  return { needed: r.length > 0, reason: r.length > 0 ? r.join(', ') : 'Anamnese bland — keine Routineindikation (DGAI 2024)' }
}

// ── Empfohlene Diagnostik ─────────────────────────────────────────────────────
export interface DiagnosticRec { name: string; recommended: boolean; reason: string }

export function buildDiagnostics(f: FormState, rcri: number, ariscat: number | null): DiagnosticRec[] {
  const age = parseInt(f.age)
  const hb = parseFloat(f.hemoglobin)
  const cr = parseFloat(f.creatinine)
  const w = parseFloat(f.weight), h = parseFloat(f.height)
  const bmi = !isNaN(w) && !isNaN(h) ? calcBMI(w, h) : null

  const hasDM = f.rcriDiabetesInsulin || f.hxDiabetes
  const highRisk = f.surgicalRisk === 'high'
  const mid = f.surgicalRisk === 'intermediate' || highRisk

  // Organ disease categories (Table 7, DGAI 2024)
  const hasCardiacDisease = f.rcriIschemicHD || f.rcriHeartFailure || f.hxValvularDisease ||
    f.hxPoorLVFunction || f.activeCardiac_decompHF || f.activeCardiac_severeStenosisAo
  const hasRenalDisease = f.rcriCreatinineOver2 || (!isNaN(cr) && cr > 2.0) || f.hxHypertension
  const hasLungDisease = f.hxCOPD || f.hxOSA
  const hasBloodDisease = !isNaN(hb) && !!f.sex && isAnaemia(hb, f.sex)
  const hasOrganDisease = hasCardiacDisease || f.hxLiverDisease || hasRenalDisease || hasLungDisease

  const hasCVRiskFactor = rcri >= 1 || hasDM || f.hxHypertension || f.nox_smoking ||
    (bmi !== null && bmi >= 30)

  // EKG: cardiac disease always; CV risk factor + medium/high-risk surgery (E27, DGAI 2024)
  const ekgIndication = hasCardiacDisease || f.activeCardiac_arrhythmia || (hasCVRiskFactor && mid)
  const ekgReason = hasCardiacDisease ? 'Bekannte kardiovaskuläre Erkrankung (E27 DGAI 2024)' :
    f.activeCardiac_arrhythmia ? 'Arrhythmie' :
    'Kardiovaskulärer Risikofaktor + mittleres/hohes OP-Risiko (E27 DGAI 2024)'

  // Biomarker: CV disease/RF + medium/high risk; NOT low-risk patients in low/medium-risk surgery (E24–E26)
  const biomarkerIndication = mid && (hasCVRiskFactor || hasCardiacDisease || (!isNaN(age) && age >= 65))
  const biomarkerReason = biomarkerIndication
    ? `Kardiovaskuläres Risiko + ${f.surgicalRisk === 'high' ? 'hohes' : 'mittleres'} OP-Risiko → MINS-Monitoring prä+24h+48h postop (E24 DGAI 2024)`
    : 'Keine Indikation (low-risk Patient bei low/medium-risk OP, E26 DGAI 2024)'

  // Blutbild: NOT routine for everyone — only with organ disease, high surgical bleeding risk, or known anemia
  // E21 DGAI 2024: Routine-Blutuntersuchung SOLL NICHT durchgeführt werden
  // Hb only when: organ disease (Table 7) OR high-risk surgery (>10% transfusion risk) OR known anemia
  const blutbildIndication = hasOrganDisease || highRisk || hasBloodDisease || f.nox_alcohol
  const blutbildReason = blutbildIndication
    ? (hasOrganDisease ? 'Organerkrankung (Minimalstandard, Tab. 7 DGAI 2024)' :
       highRisk ? 'Hochrisiko-Eingriff (Bluttransfusionsrisiko >10 %)' :
       hasBloodDisease ? 'Bekannte Anämie — Verlaufskontrolle' :
       'Alkohol — Leberfunktionsrisiko')
    : 'Keine Routineindikation (E21 DGAI 2024) — nur bei Organerkrankung oder Hochrisiko-Eingriff'

  // Kreatinin: organ disease (Table 7) + high-risk surgery (E23) + DM + hypertension
  const creatEgfr = hasOrganDisease || highRisk || hasDM || f.hxHypertension
  const creatReason = creatEgfr
    ? [hasCardiacDisease && 'Herzerkrankung', f.hxLiverDisease && 'Lebererkrankung',
       hasRenalDisease && 'Nierenerkrankung', highRisk && 'Hochrisiko-OP (E23 DGAI 2024)',
       hasDM && 'Diabetes', f.hxHypertension && 'Hypertonie'].filter(Boolean).join(', ')
    : 'Keine Indikation'

  // HbA1c/BZ: known DM (always), OR high-risk surgery + BMI≥30 + CV risk (DGAI 2024 B.1.1)
  const hba1cIndication = hasDM || (highRisk && bmi !== null && bmi >= 30)
  const hba1cReason = hba1cIndication
    ? hasDM ? 'Diabetes: HbA1c für OP-Verschiebungsentscheidung (>8,5 % → Optimierung)' :
      'Hochrisiko-OP + Adipositas: Screening auf unerkannten Diabetes'
    : 'Keine Indikation'

  // Elektrolyte: cardiac/renal disease, relevant medications
  const elektrolyteIndication = hasCardiacDisease || hasRenalDisease || f.hxACEorARB || f.hxDiuretic || f.hxSGLT2
  const coag = needsCoagulationWorkup(f)

  // TTE: specific indications only — NOT routine, NOT stable HF/KHK alone (E28–E31 DGAI 2024)
  const ntpV = parseFloat(f.ntprobnp), bnpV = parseFloat(f.bnp)
  const elevatedBNP = (!isNaN(ntpV) && ntpV >= 300) || (!isNaN(bnpV) && bnpV >= 92)
  const tteIndication = f.hxValvularDisease || f.hxPoorLVFunction ||
    f.activeCardiac_severeStenosisAo || f.activeCardiac_severeMitralStenosis ||
    (f.activeCardiac_decompHF && f.functionalCapacity === 'poor') ||
    (elevatedBNP && mid && hasCVRiskFactor)
  const tteReason = tteIndication
    ? (f.hxValvularDisease || f.activeCardiac_severeStenosisAo || f.activeCardiac_severeMitralStenosis
        ? 'Valvuläre Herzerkrankung (E28 DGAI 2024)'
        : f.hxPoorLVFunction ? 'Eingeschränkte LV-Funktion (E31)'
        : elevatedBNP ? `Erhöhtes BNP/NT-proBNP + mittleres/hohes OP-Risiko (E31)`
        : 'Dekompensierte HF + eingeschränkte Belastbarkeit')
    : 'Keine Routineindikation (E30 DGAI 2024) — nur bei valvulärer Erkrankung, eingeschränkter LV-Funktion oder erhöhtem BNP'

  const stress = stressTestIndication(f, rcri)

  // Spirometrie: NOT routine (E41 DGAI 2024) — only known/suspected COPD before upper-abdominal or thoracic surgery
  const spirometrieIndication = f.hxCOPD && (f.surgicalSite === 'upper-abdominal' || f.surgicalSite === 'intrathoracic')
  const spirometrieReason = spirometrieIndication
    ? 'COPD + Oberbauch-/intrathorakaler Eingriff (individuell erwägen, E41 DGAI 2024)'
    : f.hxCOPD ? 'COPD bekannt — Spirometrie nur bei Oberbauch/intrathorakalem Eingriff indiziert (E41)' : 'Keine Indikation (E41 DGAI 2024)'

  // Röntgen Thorax: only specific suspicion with management consequence (E42 DGAI 2024)
  const rontgenIndication = f.activeCardiac_decompHF || f.ariscat_respInfection
  const rontgenReason = rontgenIndication
    ? (f.activeCardiac_decompHF ? 'Dekompensierte Herzinsuffizienz — klinisch indiziert' : 'Respiratorischer Infekt — Pneumonie ausschließen')
    : 'Keine Routineindikation (E42 DGAI 2024) — nur bei klinischer Verdachtsdiagnose mit OP-Konsequenz'

  return [
    { name: 'EKG (12-Kanal)', recommended: ekgIndication, reason: ekgIndication ? ekgReason : 'Keine Indikation' },
    { name: 'hsTroponin I/T (prä- und postoperativ 24h+48h)', recommended: biomarkerIndication, reason: biomarkerReason },
    { name: 'BNP / NT-proBNP', recommended: biomarkerIndication, reason: biomarkerIndication ? 'Risikostratifizierung + postop. Monitoring (E25 DGAI 2024)' : 'Keine Indikation' },
    { name: 'Blutbild', recommended: blutbildIndication, reason: blutbildReason },
    { name: 'Kreatinin / eGFR', recommended: creatEgfr, reason: creatReason },
    { name: 'Blutzucker / HbA1c', recommended: hba1cIndication, reason: hba1cReason },
    { name: 'Elektrolyte (Na⁺, K⁺)', recommended: elektrolyteIndication, reason: elektrolyteIndication ? 'Herzerkrankung, Nierenerkrankung oder elektrolytrelevante Medikation' : 'Keine Indikation' },
    { name: 'Gerinnungsstatus (INR, aPTT)', recommended: coag.needed, reason: coag.reason },
    { name: 'Leberwerte', recommended: f.hxLiverDisease, reason: f.hxLiverDisease ? 'Lebererkrankung: Synthesefunktion prüfen' : 'Keine Indikation' },
    { name: 'Echokardiographie (TTE)', recommended: tteIndication, reason: tteReason },
    { name: 'Nicht-invasiver Stresstest', recommended: stress.indication !== 'none', reason: stress.reason || 'Keine Indikation' },
    { name: 'Spirometrie / Lungenfunktion', recommended: spirometrieIndication, reason: spirometrieReason },
    { name: 'Röntgen Thorax', recommended: rontgenIndication, reason: rontgenReason },
  ]
}

// ── Anämie-Empfehlungen ───────────────────────────────────────────────────────
export function anaemiaLines(hb: number, sex: 'male'|'female'|''): string[] {
  const thr = sex === 'male' ? 13.0 : 12.0
  const sl = sex === 'male' ? '♂' : '♀'
  if (hb >= thr) return []
  const lines = [
    `Hb ${hb.toFixed(1)} g/dL → Präoperative Anämie (Schwellenwert ${sl} ${thr.toFixed(1)} g/dL)`,
    'Workup: Ferritin, Transferrinsättigung, CRP, Retikulozyten-Hb, Vit. B12, Folsäure',
    'Eisenmangel absolut (Ferritin <30): orales Eisen ≥6 Wo.; i.v. Eisen <6 Wo. vor OP',
    'Eisenmangel funktionell (Ferritin 30–100 + TSAT <20 %): i.v. Eisen bevorzugen',
    `Ziel-Hb: ≥${thr.toFixed(1)} g/dL (${sl}) — OP ggf. verschieben`,
    'Transfusionstrigger perioperativ: Hb 7–8 g/dL (restriktiv); bei KHK: 8–9 g/dL',
  ]
  if (hb < 10) lines.push('Hb <10 g/dL: Hämatologe einbeziehen, EPO erwägen')
  return lines
}

// ── Klinische Empfehlungen ────────────────────────────────────────────────────
export function buildRecommendations(f: FormState, rcri: number, ariscat: number|null, sb: number): string[] {
  const recs: string[] = []
  const mid = f.surgicalRisk === 'intermediate' || f.surgicalRisk === 'high'

  if (hasActiveCardiacCondition(f)) recs.push('⚠ AKTIVE KARDIALE BEDINGUNG: elektive OP erst nach kardiologischer Behandlung (ESC 2022 I)')
  const stent = evaluateStentTiming(f)
  if (stent.status === 'contraindicated') recs.push(`⚠ STENT: ${stent.message}`)
  else if (stent.status !== 'none' && stent.status !== 'ok') recs.push(`Stent: ${stent.message}`)

  if (rcri >= 3 && mid) recs.push('Kardiologisches Konsil dringend empfohlen (RCRI ≥3 + mittleres/hohes OP-Risiko)')
  else if (rcri >= 2 && mid) recs.push('Kardiologisches Konsil empfohlen (RCRI ≥2; ESC 2022 IIa)')

  const st = stressTestIndication(f, rcri)
  if (st.indication !== 'none') recs.push(st.reason)

  const ntpVal = parseFloat(f.ntprobnp), bnpVal = parseFloat(f.bnp)
  if (!isNaN(ntpVal) && ntpVal >= 300) recs.push(`NT-proBNP ${ntpVal} ≥300 ng/L → postoperatives Troponin-Monitoring obligat (24h + 48h)`)
  if (!isNaN(bnpVal) && bnpVal >= 92) recs.push(`BNP ${bnpVal} ≥92 ng/L → postoperatives Troponin-Monitoring empfohlen`)

  if (f.hxBetablocker) recs.push('Beta-Blocker weiterführen — abruptes Absetzen kontraindiziert (E46 DGAI 2024)')
  if (f.hxStatin) recs.push('Statin weiterführen — Absetzen erhöht kardiales Risiko (E53 DGAI 2024)')
  if (f.hxACEorARB) {
    if (f.hxPoorLVFunction) recs.push('ACE-Hemmer/Sartan: bei eingeschränkter LV-Funktion WEITERFÜHREN (E48 Ausnahme DGAI 2024)')
    else recs.push('ACE-Hemmer/Sartan: am OP-Morgen pausieren — Hypotonie-Risiko (E48 DGAI 2024)')
  }
  if (f.hxSGLT2) {
    const sglt2Pause = f.surgicalRisk === 'high' || f.surgicalRisk === 'intermediate'
      ? '≥72 h (3 Tage)' : '24–48 h'
    recs.push(`SGLT-2-Inhibitor: ${sglt2Pause} präoperativ absetzen (euDKA-Risiko! E49 DGAI 2024)`)
  }
  if (f.hxGLP1) recs.push('GLP-1-Agonist: wöchentliche Form 1 Woche vor OP; täglich am OP-Tag absetzen — verzögerte Magenentleerung → Aspirationsrisiko (E50 DGAI 2024)')
  if (f.hxAnticoagulant || f.bleeding_anticoagulant) recs.push('Antikoagulation: individuelles Bridging-Konzept erforderlich (C.4 DGAI 2024)')
  if (f.hxAntiplatelet) recs.push('Thrombozytenaggregationshemmer: Pausierungsstrategie individuell — bei Stent keine Unterbrechung ohne kardiologische Freigabe (C.4.3 DGAI 2024)')

  const hasDM = f.rcriDiabetesInsulin || f.hxDiabetes
  const hba1cV = parseFloat(f.hba1c)
  if (hasDM && !isNaN(hba1cV)) {
    const ev = evaluateHbA1c(hba1cV)
    recs.push(ev.label)
    if (ev.postpone) recs.push('Diabetologisches Konsil für präoperative Optimierung')
    if (f.rcriDiabetesInsulin) recs.push('Insulintherapie: Basalinsulin OP-Abend/Morgen um ≤50 % reduzieren, kein Bolusinsulin bei NPO; BZ-Kontrollen alle 1–2 h perioperativ')
  } else if (hasDM) {
    recs.push('Diabetes: HbA1c bestimmen, perioperativer Ziel-BZ 140–180 mg/dL (7,8–10 mmol/L)')
    if (f.rcriDiabetesInsulin) recs.push('Insulintherapie: Basisrate aufrechterhalten, kein Bolusinsulin bei Nüchternheit')
  }
  const hba1cVcheck = parseFloat(f.hba1c)
  const diabGastroparesis = f.rcriDiabetesInsulin || (hasDM && !isNaN(hba1cVcheck) && hba1cVcheck > 8.5)
  if (diabGastroparesis && !f.hxGLP1) recs.push('Diabetische Gastroparese möglich (insulinpflichtiger/schlecht eingestellter DM) → gelbe Nüchternheitskarte, Aspirationsrisiko beachten')

  if (sb >= 5) recs.push('STOP-BANG ≥5 → Hohes OSA-Risiko: schlafmedizinische Abklärung, CPAP perioperativ sicherstellen, erhöhte postop. Überwachung')
  else if (sb >= 3) recs.push('STOP-BANG 3–4 → Mittleres OSA-Risiko: Abklärung empfehlen, CPAP bei bekannter OSA sicherstellen')

  if (ariscat !== null && ariscat >= 45) recs.push('ARISCAT ≥45: Regionale Anästhesie bevorzugen, intensive Atemphysiotherapie, lungenprotektive Beatmung (VT 6–8 ml/kg, PEEP)')
  else if (ariscat !== null && ariscat >= 26) recs.push('ARISCAT ≥26: Atemphysiotherapie präoperativ, regionale Anästhesieverfahren erwägen')

  if (f.cfs >= 5) recs.push(`CFS ${f.cfs}/9: Geriatrisches Konsil, Prehabilitation, interdisziplinäre Optimierung`)
  if (f.hxValvularDisease) recs.push('Valvuläre Herzerkrankung: TTE + kardiologische Clearance erforderlich')
  if (f.hxCOPD) recs.push('COPD: Inhalationstherapie optimieren, Raucherentwöhnung ≥4 Wochen vor OP')

  if (f.prev_familyMH) recs.push('⚠ MALIGNE HYPERTHERMIE: Familienanamnese positiv — triggerfreie Anästhesie obligat, Dantrolene verfügbar halten, MH-Zentrum informieren')
  if (f.prev_difficultAirway || f.aw_previousDifficult) recs.push('⚠ Vorbekannter schwieriger Atemweg: erweiterte Atemwegs-Vorbereitung obligat (Videolaryngoskopie, fiberoptische Intubation bereithalten, Awake-Intubation erwägen)')

  return recs
}

// ── Protokolltext (copy-paste) ────────────────────────────────────────────────
export function generateProtocolText(f: FormState): string {
  const today = new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' })
  const age = parseInt(f.age), w = parseFloat(f.weight), h = parseFloat(f.height)
  const cr = parseFloat(f.creatinine), hb = parseFloat(f.hemoglobin)
  const bmi = !isNaN(w) && !isNaN(h) ? calcBMI(w, h) : null
  const egfr = !isNaN(cr) && !isNaN(age) && f.sex ? calcEGFR(cr, age, f.sex) : null
  const py = calcPackYears(f.nox_cigPerDay, f.nox_smokingYears)
  const rcri = calcRCRI(f)
  const rcriR = rcriRisk(rcri)
  const ariscat = calcARISCAT(f)
  const sb = calcSTOPBANG(f)
  const pf = calcPENFAST(f)
  const recs = buildRecommendations(f, rcri, ariscat, sb)
  const coag = needsCoagulationWorkup(f)
  const fc = determineFastingCard(f)
  const awScore = difficultAirwayScore(f)
  const awLabel = difficultAirwayLabel(awScore)
  const sx = f.sex === 'male' ? '♂' : f.sex === 'female' ? '♀' : ''
  const isar = calcISAR(f)
  const dr = delirRisk(f, isar)
  const amtsV = parseInt(f.delir_amts)
  const sep = '─'.repeat(48)
  const L: string[] = []

  L.push('PRÄMEDIKATIONSPROTOKOLL')
  L.push(`Datum: ${today}`)
  L.push(sep)

  // Patient (kompakt, eine Zeile)
  const patParts = [
    f.age && `${f.age} J.`, sx,
    !isNaN(w) && `${w} kg`, !isNaN(h) && `${h} cm`,
    bmi && `BMI ${bmi}`, f.asa && `ASA ${f.asa}`,
  ].filter(Boolean)
  L.push(patParts.join(' | '))
  const labParts = [
    !isNaN(cr) && `Krea ${cr} mg/dL`,
    egfr && `eGFR ${egfr} ml/min`,
    !isNaN(hb) && `Hb ${hb.toFixed(1)} g/dL${f.sex && isAnaemia(hb, f.sex) ? ' ⚠ Anämie' : ''}`,
    f.hba1c && `HbA1c ${f.hba1c} %`,
    f.ntprobnp && `NT-proBNP ${f.ntprobnp} ng/L`,
    f.bnp && `BNP ${f.bnp} ng/L`,
  ].filter(Boolean)
  if (labParts.length) L.push(labParts.join(' | '))
  L.push('')

  // Eingriff
  L.push(f.surgeryDescription || 'Eingriff nicht angegeben')
  const riskLabel = f.surgicalRisk === 'low' ? 'NIEDRIG (<1 %)' :
    f.surgicalRisk === 'intermediate' ? 'MITTEL (1–5 %)' :
    f.surgicalRisk === 'high' ? 'HOCH (>5 %)' : ''
  const surParts = [
    riskLabel && `Risiko: ${riskLabel}`,
    f.functionalCapacity === 'poor' && 'METs <4 (eingeschränkt)',
    f.emergencyClass && f.emergencyClass !== 'elective' && `Dringlichkeit: ${f.emergencyClass}`,
  ].filter(Boolean)
  if (surParts.length) L.push(surParts.join(' · '))
  L.push('')

  // Anästhesie-Vorgeschichte — nur wenn relevant
  const hasPrevRelevant = f.prev_hadGA || f.prev_familyMH || f.prev_familyPseudocholin || f.prev_familyOther
  if (hasPrevRelevant) {
    L.push('ANÄSTHESIE-VORGESCHICHTE')
    if (f.prev_hadGA) {
      const comps = [
        f.prev_ponv && 'PONV',
        f.prev_difficultAirway && 'Schwieriger Atemweg',
        f.prev_awareness && 'Awareness',
        f.prev_otherComplication,
      ].filter(Boolean).join(', ')
      L.push(`Vorige Narkose (${f.prev_year || 'Jahr unbek.'}): ${f.prev_wellTolerated ? 'komplikationslos' : 'Komplikationen — ' + comps}`)
    }
    if (f.prev_familyMH) L.push('⚠ Familienanamnese: MALIGNE HYPERTHERMIE — triggerfreie Anästhesie obligat!')
    if (f.prev_familyPseudocholin) L.push('Familienanamnese: Pseudocholinesterasemangel')
    if (f.prev_familyOther) L.push(`Familienanamnese: ${f.prev_familyOther}`)
    L.push('')
  }

  // Atemweg — nur wenn Befunde vorhanden
  const hasAirwayFindings = f.aw_mallampati || f.aw_mouthOpening || f.aw_tmd || f.aw_reklination ||
    f.aw_ulbt || f.aw_beard || f.aw_shortNeck || f.aw_micrognathia || f.aw_obese ||
    f.aw_previousDifficult || f.aw_notes
  if (hasAirwayFindings) {
    L.push('ATEMWEG')
    const awParts = [
      f.aw_mallampati && `Mallampati ${f.aw_mallampati}`,
      f.aw_mouthOpening && f.aw_mouthOpening !== '>4cm' && `Mundöffnung ${f.aw_mouthOpening}`,
      f.aw_tmd && f.aw_tmd !== '>6.5cm' && `TMA ${f.aw_tmd}`,
      f.aw_reklination && f.aw_reklination !== 'normal' &&
        `Reklination ${f.aw_reklination === 'limited' ? 'eingeschränkt' : 'stark eingeschränkt'}`,
      f.aw_ulbt && f.aw_ulbt !== '1' && `ULBT ${f.aw_ulbt}`,
    ].filter(Boolean)
    if (awParts.length) L.push(awParts.join(' · '))
    const physSigns = [
      f.aw_beard && 'Bart',
      f.aw_shortNeck && 'Kurzer Hals',
      f.aw_micrognathia && 'Mikrognathie',
      f.aw_obese && 'Adipositas',
      f.aw_previousDifficult && '⚠ Vorbekannter schwieriger AW',
    ].filter(Boolean)
    if (physSigns.length) L.push(physSigns.join(', '))
    L.push(`→ ${awLabel.text}`)
    if (f.aw_notes) L.push(`Notiz: ${f.aw_notes}`)
    L.push('')
  }

  // Noxen — nur wenn positiv
  if (f.nox_smoking || f.nox_exSmoker || f.nox_alcohol || f.nox_drugs) {
    L.push('NOXEN')
    if (f.nox_smoking && py !== null) L.push(`Raucher: ${f.nox_cigPerDay} Zig/Tag, ${f.nox_smokingYears} J. = ${py} py`)
    else if (f.nox_exSmoker) L.push(`Ex-Raucher seit ${f.nox_exSmokerSince || 'unbekannt'}`)
    if (f.nox_alcohol) L.push(`Alkohol: ${f.nox_alcoholGPerWeek || 'n.a.'} g/Woche`)
    if (f.nox_drugs) L.push(`Drogen: ${f.nox_drugsText || 'vorhanden, n.a.'}`)
    L.push('')
  }

  // Reflux — nur wenn positiv
  if (f.reflux_heartburn || f.reflux_atRest || f.reflux_regurgitation) {
    const rf = [
      f.reflux_heartburn && 'Sodbrennen/GERD',
      f.reflux_mealIndependent && 'mahlzeitenunabhängig',
      f.reflux_nocturnalCough && 'nächtliche Hustenanfälle',
      f.reflux_atRest && 'Reflux im Flachliegen',
      f.reflux_regurgitation && 'Regurgitation',
    ].filter(Boolean)
    L.push(`REFLUX: ${rf.join(', ')}`)
    L.push('')
  }

  // Blutung / Gerinnung — nur wenn relevant
  if (coag.needed) {
    L.push(`BLUTUNG / GERINNUNG: ${coag.reason}`)
    L.push('')
  }

  // Risikostratifizierung
  L.push('RISIKOSTRATIFIZIERUNG')
  const rcriPos = rcriPositiveItems(f)
  L.push(`RCRI ${rcri}/6 → MACE ${rcriR.pct} (${rcriR.label})${rcriPos.length ? ' | ' + rcriPos.join(', ') : ''}`)
  if (f.cfs > 0) L.push(`CFS ${f.cfs}/9 — ${CFS_LABELS[f.cfs]}`)
  if (ariscat !== null) { const ar = ariscatRisk(ariscat); L.push(`ARISCAT ${ariscat} Pkt. → pulm. Risiko ${ar.pct} (${ar.label})`) }
  if (sb >= 3) L.push(`STOP-BANG ${sb}/8 → OSA-Risiko ${stopBangRisk(sb).label}`)
  if (pf !== null) { const pfR = penFastRisk(pf); L.push(`PEN-FAST ${pf}/5 → Penicillin-IgE ${pfR.pct} (${pfR.label})`) }

  // Delirium-Screening — nur bei Alter ≥65 J. oder vorhandenen Risikofaktoren
  const showDelirium = (!isNaN(age) && age >= 65) || f.cfs >= 5 || isar > 0 ||
    f.delir_knownDementia || f.delir_prevDelirium || (!isNaN(amtsV) && amtsV <= 6)
  if (showDelirium) {
    const delirParts = [`ISAR ${isar}/6`]
    if (!isNaN(amtsV)) delirParts.push(`AMTS ${amtsV}/10${amtsV <= 6 ? ' ⚠' : ''}`)
    if (f.delir_knownDementia) delirParts.push('Demenz')
    if (f.delir_prevDelirium) delirParts.push('Delir-Anamnese')
    L.push(`POD-Risiko: ${dr.label} | ${delirParts.join(', ')}`)
  }
  L.push('')

  // Nüchternheitskarte
  L.push(`NÜCHTERNHEITSKARTE: ${FASTING_CARD_INFO[fc].label}`)
  L.push('')

  // Empfehlungen
  if (recs.length) {
    L.push('EMPFEHLUNGEN')
    recs.forEach(r => L.push(`• ${r}`))
    L.push('')
  }

  L.push(sep)
  L.push('ESC/ESA 2022 · DGAI/BDA 2024 · DGAI Anämie 2023 · notfallakademie.org')

  return L.join('\n')
}

// ── Assessment-Items (strukturierte Checkliste) ───────────────────────────────
export interface AssessmentItem {
  category: string
  text: string
  urgency: 'critical' | 'high' | 'medium' | 'info'
}

export function buildAssessmentItems(f: FormState, rcri: number, ariscat: number|null, sb: number): AssessmentItem[] {
  const items: AssessmentItem[] = []
  const diags = buildDiagnostics(f, rcri, ariscat)
  const recs = buildRecommendations(f, rcri, ariscat, sb)
  const hb = parseFloat(f.hemoglobin)

  if (hasActiveCardiacCondition(f)) items.push({ category: 'Kardial', text: 'AKTIVE KARDIALE BEDINGUNG: Kardiologie SOFORT konsultieren — elektive OP pausieren', urgency: 'critical' })
  const stent = evaluateStentTiming(f)
  if (stent.status === 'contraindicated') items.push({ category: 'Kardial', text: stent.message, urgency: 'critical' })
  if (f.prev_familyMH) items.push({ category: 'Anästhesie', text: 'MH-Familienanamnese: TRIGGERFREIE Anästhesie — Dantrolene bereitstellen', urgency: 'critical' })

  const awScore = difficultAirwayScore(f)
  if (awScore >= 3) items.push({ category: 'Atemweg', text: 'Schwieriger Atemweg erwartet: Videolaryngoskopie + fiberoptische Reserve + Awake-Intubation erwägen', urgency: 'critical' })
  else if (awScore >= 1.5) items.push({ category: 'Atemweg', text: 'Schwieriger Atemweg möglich: Videolaryngoskopie bereithalten', urgency: 'high' })

  diags.filter(d => d.recommended).forEach(d => items.push({ category: 'Diagnostik', text: d.name, urgency: 'medium' }))

  if (!isNaN(hb) && f.sex && isAnaemia(hb, f.sex)) items.push({ category: 'Anämie (PBM)', text: `Hb ${hb.toFixed(1)} g/dL → Anämie-Workup: Ferritin, TSAT, CRP, Reti-Hb`, urgency: 'high' })

  if (sb >= 5) items.push({ category: 'OSA', text: 'STOP-BANG ≥5: Schlafmedizin-Abklärung + CPAP perioperativ', urgency: 'high' })
  else if (sb >= 3) items.push({ category: 'OSA', text: 'STOP-BANG ≥3: OSA-Screening empfehlen', urgency: 'medium' })

  if (f.cfs >= 5) items.push({ category: 'Frailty', text: `CFS ${f.cfs}/9: Geriatrisches Konsil + Prehabilitation`, urgency: 'high' })

  const isar = calcISAR(f)
  const dr = delirRisk(f, isar)
  if (dr.level === 'high') {
    items.push({ category: 'Delirium-Prävention', text: `Hohes POD-Risiko (ISAR ${isar}/6): ${dr.explanation}`, urgency: 'high' })
    dr.recommendations.forEach(r => items.push({ category: 'Delirium-Prävention', text: r, urgency: 'medium' }))
  } else if (dr.level === 'intermediate') {
    items.push({ category: 'Delirium-Prävention', text: `Erhöhtes POD-Risiko (ISAR ${isar}/6): ${dr.explanation}`, urgency: 'medium' })
    dr.recommendations.forEach(r => items.push({ category: 'Delirium-Prävention', text: r, urgency: 'medium' }))
  }

  if (f.hxSGLT2) {
    const sglt2Pause = f.surgicalRisk === 'high' || f.surgicalRisk === 'intermediate' ? '≥72 h' : '24–48 h'
    items.push({ category: 'Medikation', text: `SGLT-2-Inhibitor: ${sglt2Pause} präoperativ ABSETZEN (euDKA-Risiko!)`, urgency: 'high' })
  }
  if (f.hxGLP1) items.push({ category: 'Medikation', text: 'GLP-1-Agonist: 1 Woche (wöchentl.) bzw. OP-Tag (tägl.) ABSETZEN — Gastroparese → Aspirationsrisiko!', urgency: 'high' })
  if (f.hxACEorARB) {
    if (f.hxPoorLVFunction) items.push({ category: 'Medikation', text: 'ACE-Hemmer/Sartan: bei LV-Dysfunktion WEITERFÜHREN (Ausnahme E48)', urgency: 'medium' })
    else items.push({ category: 'Medikation', text: 'ACE-Hemmer/Sartan: am OP-Morgen PAUSIEREN (Hypotonie-Risiko)', urgency: 'medium' })
  }
  if (f.hxAnticoagulant || f.bleeding_anticoagulant) items.push({ category: 'Medikation', text: 'Antikoagulation: Bridging-Konzept erstellen', urgency: 'high' })
  if (f.hxAntiplatelet && (f.stent_hasDES || f.stent_hasBMS)) items.push({ category: 'Medikation', text: 'TAH bei Stent: keine Pause ohne kardiologische Freigabe!', urgency: 'critical' })

  const fc = determineFastingCard(f)
  const fcInfo = FASTING_CARD_INFO[fc]
  items.push({ category: 'Nüchternheitskarte', text: `${fcInfo.label}: ${fcInfo.description}`, urgency: fc === 'red' ? 'critical' : fc === 'yellow' ? 'high' : 'info' })

  return items
}
