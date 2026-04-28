import { FormState } from './types'

// ── CKD-EPI 2021 ─────────────────────────────────────────────────────────────
export function calcEGFR(creatinine: number, age: number, sex: 'male' | 'female'): number {
  const kappa = sex === 'female' ? 0.7 : 0.9
  const alpha = sex === 'female' ? -0.241 : -0.302
  const sexFactor = sex === 'female' ? 1.012 : 1.0
  const ratio = creatinine / kappa
  const eGFR =
    142 *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, age) *
    sexFactor
  return Math.round(eGFR)
}

export function calcBMI(weight: number, height: number): number {
  return Math.round((weight / ((height / 100) * (height / 100))) * 10) / 10
}

// ── Aktive kardiale Bedingungen (ESC 2022, Klasse I) ─────────────────────────
// Müssen VOR RCRI geprüft werden → sofortige kardiologische Behandlung vor OP
export function hasActiveCardiacCondition(f: FormState): boolean {
  return (
    f.activeCardiac_unstableAngina ||
    f.activeCardiac_recentMI ||
    f.activeCardiac_decompHF ||
    f.activeCardiac_arrhythmia ||
    f.activeCardiac_severeStenosisAo ||
    f.activeCardiac_severeMitralStenosis
  )
}

export function activeCardiacItems(f: FormState): string[] {
  const items: string[] = []
  if (f.activeCardiac_unstableAngina) items.push('Instabile / schwere Angina pectoris')
  if (f.activeCardiac_recentMI) items.push('Herzinfarkt <60 Tage')
  if (f.activeCardiac_decompHF) items.push('Dekompensierte Herzinsuffizienz')
  if (f.activeCardiac_arrhythmia) items.push('Signifikante Arrhythmie (AV-Block III, symptomatische VT, SVT >100/min unkontrolliert)')
  if (f.activeCardiac_severeStenosisAo) items.push('Schwere Aortenstenose')
  if (f.activeCardiac_severeMitralStenosis) items.push('Schwere Mitralklappenstenose')
  return items
}

// ── Stent-Timing (ESC 2022) ───────────────────────────────────────────────────
export type StentStatus = 'ok' | 'warning' | 'contraindicated' | 'none'

export function evaluateStentTiming(f: FormState): { status: StentStatus; message: string } {
  const months = parseFloat(f.stent_monthsSinceImplant)
  if (!f.stent_hasDES && !f.stent_hasBMS) return { status: 'none', message: '' }
  if (isNaN(months)) return { status: 'warning', message: 'Stent vorhanden, aber Implantationsdatum nicht angegeben — Zeitintervall klären.' }

  if (f.stent_hasDES) {
    if (months < 6) return {
      status: 'contraindicated',
      message: `DES-Stent vor ${months} Monat(en) implantiert → Elektiver Eingriff KONTRAINDIZIERT (<6 Monate nach DES). Mindestens ${Math.ceil(6 - months)} weitere Monate abwarten. Duale Thrombozytenhemmung nicht unterbrechen. Kardiologie konsultieren.`,
    }
    if (months < 12) return {
      status: 'warning',
      message: `DES-Stent vor ${months} Monat(en) — >6 Monate: elektiver Eingriff möglich, aber erhöhtes Risiko. Duale Plättchenhemmung nur nach kardiologischer Rücksprache pausieren.`,
    }
    return { status: 'ok', message: `DES-Stent vor ${months} Monat(en) — >12 Monate: kein erhöhtes Stent-Thromboserisiko.` }
  }

  if (f.stent_hasBMS) {
    if (months < 4) return {
      status: 'contraindicated',
      message: `BMS-Stent vor ${months} Monat(en) → Elektiver Eingriff KONTRAINDIZIERT (<4 Wochen nach BMS). ${Math.ceil(4 - months)} weiteren Monat(e) abwarten.`,
    }
    return { status: 'ok', message: `BMS-Stent vor ${months} Monat(en) — ≥4 Wochen: elektiver Eingriff unter Fortführung ASS möglich.` }
  }

  return { status: 'none', message: '' }
}

// ── RCRI nach Lee ─────────────────────────────────────────────────────────────
export function calcRCRI(f: FormState): number {
  return [
    f.rcriHighRiskSurgery,
    f.rcriIschemicHD,
    f.rcriHeartFailure,
    f.rcriCerebrovascular,
    f.rcriDiabetesInsulin,
    f.rcriCreatinineOver2,
  ].filter(Boolean).length
}

export function rcriRisk(score: number): { pct: string; label: string; level: 'low' | 'intermediate' | 'high' } {
  if (score === 0) return { pct: '~3,9 %', label: 'niedrig', level: 'low' }
  if (score === 1) return { pct: '~6,0 %', label: 'niedrig-moderat', level: 'low' }
  if (score === 2) return { pct: '~10,1 %', label: 'moderat', level: 'intermediate' }
  return { pct: '≥15 %', label: 'hoch', level: 'high' }
}

export function rcriPositiveItems(f: FormState): string[] {
  const items: string[] = []
  if (f.rcriHighRiskSurgery) items.push('Hochrisiko-Eingriff')
  if (f.rcriIschemicHD) items.push('Ischämische Herzerkrankung')
  if (f.rcriHeartFailure) items.push('Herzinsuffizienz')
  if (f.rcriCerebrovascular) items.push('Zerebrovaskuläre Erkrankung')
  if (f.rcriDiabetesInsulin) items.push('Diabetes (Insulin)')
  if (f.rcriCreatinineOver2) items.push('Kreatinin >2,0 mg/dL')
  return items
}

// ── ESC 2022 Haupt-Algorithmus: Stresstest-Indikation ───────────────────────
export type StressTestIndication = 'none' | 'consider' | 'recommended'

export function stressTestIndication(f: FormState, rcri: number): { indication: StressTestIndication; reason: string } {
  const isIntermediateOrHigh = f.surgicalRisk === 'intermediate' || f.surgicalRisk === 'high'
  if (!isIntermediateOrHigh) return { indication: 'none', reason: 'Niedriges OP-Risiko — kein Stresstest indiziert.' }
  if (rcri < 2) return { indication: 'none', reason: 'RCRI <2 — kein Stresstest routinemäßig indiziert.' }
  if (f.functionalCapacity === 'good') return { indication: 'none', reason: 'Gute Belastungstoleranz (≥4 METs) — kein Stresstest notwendig (ESC 2022 III).' }
  if (rcri >= 3 && f.functionalCapacity === 'poor') {
    return {
      indication: 'recommended',
      reason: 'RCRI ≥3 + eingeschränkte Belastungstoleranz (<4 METs) + mittleres/hohes OP-Risiko → Nicht-invasiver Stresstest (Belastungs-EKG, Stress-Echo oder MPI) empfohlen, wenn Ergebnis das perioperative Management beeinflusst (ESC 2022 IIa).',
    }
  }
  if (rcri === 2 && f.functionalCapacity === 'poor') {
    return {
      indication: 'consider',
      reason: 'RCRI 2 + eingeschränkte Belastungstoleranz → Nicht-invasiver Stresstest erwägen, wenn Ergebnis Management beeinflusst (ESC 2022 IIb).',
    }
  }
  return { indication: 'none', reason: '' }
}

// ── Biomarker-Interpretation (ESC 2022) ──────────────────────────────────────
export interface BiomarkerResult {
  elevated: boolean
  label: string
  recommendation: string
}

export function interpretNTproBNP(ntprobnp: number): BiomarkerResult {
  const elevated = ntprobnp >= 300
  return {
    elevated,
    label: elevated ? `NT-proBNP ${ntprobnp} ng/L → ERHÖHT (Schwelle ≥300 ng/L)` : `NT-proBNP ${ntprobnp} ng/L → normal (<300 ng/L)`,
    recommendation: elevated
      ? 'Erhöhtes perioperatives kardiales Risiko — kardiologische Mitbeurteilung und postoperatives Troponin-Monitoring empfohlen (ESC 2022)'
      : 'Kein erhöhtes BNP-basiertes MACE-Risiko.',
  }
}

export function interpretBNP(bnp: number): BiomarkerResult {
  const elevated = bnp >= 92
  return {
    elevated,
    label: elevated ? `BNP ${bnp} ng/L → ERHÖHT (Schwelle ≥92 ng/L)` : `BNP ${bnp} ng/L → normal (<92 ng/L)`,
    recommendation: elevated
      ? 'Erhöhtes perioperatives kardiales Risiko — postoperatives Troponin-Monitoring empfohlen (ESC 2022)'
      : 'Kein erhöhtes BNP-basiertes MACE-Risiko.',
  }
}

// ── ARISCAT ───────────────────────────────────────────────────────────────────
export function calcARISCAT(f: FormState): number | null {
  const age = parseInt(f.age)
  const hb = parseFloat(f.hemoglobin)
  if (!f.surgicalSite || !f.surgeryDuration || !f.ariscat_spo2) return null

  let score = 0
  if (!isNaN(age)) {
    if (age > 80) score += 16
    else if (age >= 51) score += 3
  }
  if (f.ariscat_spo2 === '<=90') score += 24
  else if (f.ariscat_spo2 === '91-95') score += 8
  if (f.ariscat_respInfection) score += 17
  if (!isNaN(hb) && hb <= 10) score += 11
  if (f.surgicalSite === 'intrathoracic') score += 24
  else if (f.surgicalSite === 'upper-abdominal') score += 15
  if (f.surgeryDuration === '>3h') score += 23
  else if (f.surgeryDuration === '2-3h') score += 16
  if (f.emergency) score += 8

  return score
}

export function ariscatRisk(score: number): { pct: string; label: string; level: 'low' | 'intermediate' | 'high' } {
  if (score <= 25) return { pct: '~1,6 %', label: 'niedrig', level: 'low' }
  if (score <= 44) return { pct: '~13,3 %', label: 'mittel', level: 'intermediate' }
  return { pct: '~42 %', label: 'hoch', level: 'high' }
}

// ── STOP-BANG ─────────────────────────────────────────────────────────────────
export function calcSTOPBANG(f: FormState): number {
  const age = parseInt(f.age)
  const weight = parseFloat(f.weight)
  const height = parseFloat(f.height)
  const bmi = !isNaN(weight) && !isNaN(height) ? calcBMI(weight, height) : 0
  return [
    f.sb_snoring,
    f.sb_tired,
    f.sb_observed,
    f.sb_pressure,
    bmi > 35,
    !isNaN(age) && age > 50,
    f.sb_neckOver40,
    f.sex === 'male',
  ].filter(Boolean).length
}

export function stopBangRisk(score: number): { label: string; level: 'low' | 'intermediate' | 'high' } {
  if (score <= 2) return { label: 'niedrig', level: 'low' }
  if (score <= 4) return { label: 'mittel', level: 'intermediate' }
  return { label: 'hoch', level: 'high' }
}

// ── PEN-FAST ──────────────────────────────────────────────────────────────────
export function calcPENFAST(f: FormState): number | null {
  if (!f.pf_hasPenicillinAllergy) return null
  let score = 0
  if (f.pf_time === '<5years') score += 2
  else if (f.pf_time === '>=5years') score += 1
  if (f.pf_anaphylaxis || f.pf_scar) score += 2
  if (f.pf_treatment) score += 1
  return score
}

export function penFastRisk(score: number): { pct: string; label: string; level: 'low' | 'intermediate' | 'high' } {
  if (score <= 1) return { pct: '~1 %', label: 'sehr niedrig', level: 'low' }
  if (score === 2) return { pct: '~2 %', label: 'niedrig', level: 'low' }
  if (score === 3) return { pct: '~5 %', label: 'moderat', level: 'intermediate' }
  return { pct: '>20 %', label: 'hoch', level: 'high' }
}

// ── CFS ───────────────────────────────────────────────────────────────────────
export const CFS_LABELS: Record<number, string> = {
  1: 'Sehr fit – robust, aktiv, energetisch',
  2: 'Fit – keine aktiven Erkrankungen, aber weniger fit als Stufe 1',
  3: 'Gut zurechtkommend – medizinische Probleme gut kontrolliert',
  4: 'Vulnerabel – Aktivitäten durch Symptome eingeschränkt',
  5: 'Leichtgradig gebrechlich – Hilfe bei anspruchsvolleren IADL',
  6: 'Mittelgradig gebrechlich – Hilfe bei allen außerhäuslichen Aktivitäten und Haushalt',
  7: 'Schwer gebrechlich – vollständig abhängig für ADL',
  8: 'Sehr schwer gebrechlich – vollständig abhängig, nahes Lebensende',
  9: 'Terminal erkrankt – Lebenserwartung <6 Monate',
}

export function cfsRisk(cfs: number): 'low' | 'intermediate' | 'high' {
  if (cfs <= 3) return 'low'
  if (cfs <= 5) return 'intermediate'
  return 'high'
}

// ── Anämie ────────────────────────────────────────────────────────────────────
export function isAnaemia(hb: number, sex: 'male' | 'female' | ''): boolean {
  if (sex === 'male') return hb < 13.0
  if (sex === 'female') return hb < 12.0
  return hb < 12.0
}

// ── HbA1c-Bewertung ───────────────────────────────────────────────────────────
export function evaluateHbA1c(hba1c: number): { postpone: boolean; label: string } {
  if (hba1c > 10) return { postpone: true, label: `HbA1c ${hba1c} % → stark erhöht (>10 %): Elektive OP-Verschiebung und diabetologische Optimierung dringend empfohlen` }
  if (hba1c > 8.5) return { postpone: true, label: `HbA1c ${hba1c} % → erhöht (>8,5 %): Präoperative Optimierung empfohlen; OP-Verschiebung erwägen (DGAI 2024)` }
  if (hba1c > 7.5) return { postpone: false, label: `HbA1c ${hba1c} % → mäßig erhöht (>7,5 %): Perioperatives Glukosemanagement sicherstellen` }
  return { postpone: false, label: `HbA1c ${hba1c} % → akzeptabel für elektive OP` }
}

// ── Gerinnungsindikation (DGAI 2024) ─────────────────────────────────────────
export function needsCoagulationWorkup(f: FormState): { needed: boolean; reason: string } {
  const reasons: string[] = []
  if (f.bleeding_anticoagulant || f.hxAnticoagulant) reasons.push('Antikoagulanzientherapie (VKA/DOAK/NMH)')
  if (f.bleeding_spontaneous) reasons.push('Spontanblutungen in der Anamnese')
  if (f.bleeding_prolonged) reasons.push('Verlängerte Blutung nach Eingriffen/Zahnextraktion')
  if (f.bleeding_familyHistory) reasons.push('Positive Familienanamnese für Blutungsneigung')
  if (f.hxLiverDisease) reasons.push('Lebererkrankung (Synthesefunktion)')
  return {
    needed: reasons.length > 0,
    reason: reasons.length > 0 ? reasons.join(', ') : 'Keine Indikation für Routine-Gerinnungsdiagnostik (DGAI 2024)',
  }
}

// ── Empfohlene Diagnostik (ESC 2022 / DGAI 2024) ────────────────────────────
export interface DiagnosticRec {
  name: string
  recommended: boolean
  reason: string
}

export function buildDiagnostics(f: FormState, rcri: number, ariscat: number | null): DiagnosticRec[] {
  const age = parseInt(f.age)
  const hb = parseFloat(f.hemoglobin)
  const isIntermediateOrHigh = f.surgicalRisk === 'intermediate' || f.surgicalRisk === 'high'
  const hasCV = f.rcriIschemicHD || f.rcriHeartFailure || f.rcriCerebrovascular
  const hasActiveCardiac = hasActiveCardiacCondition(f)
  const coag = needsCoagulationWorkup(f)

  const ekg =
    isIntermediateOrHigh && (rcri >= 1 || hasCV || hasActiveCardiac || (!isNaN(age) && age >= 45))
  const biomarker =
    isIntermediateOrHigh && (rcri >= 1 || (!isNaN(age) && age >= 65))
  const blutbild = true
  const creatEgfr =
    (!isNaN(age) && age >= 45) || f.rcriDiabetesInsulin || f.hxHypertension || f.rcriCreatinineOver2 || f.hxCOPD
  const hba1c = f.rcriDiabetesInsulin || f.hxDiabetes
  const elektrolyte = f.hxACEorARB || f.hxDiuretic || f.hxSGLT2 || f.rcriCreatinineOver2
  const tte =
    f.hxValvularDisease ||
    f.hxPoorLVFunction ||
    f.activeCardiac_severeStenosisAo ||
    f.activeCardiac_severeMitralStenosis ||
    (isIntermediateOrHigh && rcri >= 2 && f.functionalCapacity === 'poor')
  const spirometrie = (ariscat !== null && ariscat >= 26) || f.hxCOPD
  const roThorax = f.activeCardiac_decompHF || f.rcriHeartFailure

  return [
    {
      name: 'EKG (12-Kanal)',
      recommended: ekg,
      reason: ekg
        ? `Indikation: ${[rcri >= 1 && 'RCRI ≥1', hasCV && 'bekannte CV-Erkrankung', !isNaN(age) && age >= 45 && 'Alter ≥45 J.'].filter(Boolean).join(', ')} + mittleres/hohes OP-Risiko (ESC 2022 IIa)`
        : 'Keine Indikation: niedriges OP-Risiko ohne CV-Risikofaktoren',
    },
    {
      name: 'hsTroponin I/T (präoperativ)',
      recommended: biomarker,
      reason: biomarker
        ? 'RCRI ≥1 und/oder Alter ≥65 J. + mittleres/hohes OP-Risiko → Baseline-Messung präoperativ (ESC 2022 IIa)'
        : 'Keine Indikation',
    },
    {
      name: 'hsTroponin I/T (postoperativ 24h + 48h)',
      recommended: biomarker,
      reason: biomarker
        ? 'Postoperatives Monitoring 24 h und 48 h nach Eingriff zum Ausschluss MINS (Myokardschaden nach nicht-kardialer Chirurgie; ESC 2022 IIa)'
        : 'Keine Indikation',
    },
    {
      name: 'BNP / NT-proBNP (präoperativ)',
      recommended: biomarker,
      reason: biomarker
        ? 'Risikostratifizierung: NT-proBNP ≥300 ng/L oder BNP ≥92 ng/L = erhöhtes perioperatives MACE-Risiko (ESC 2022 IIa)'
        : 'Keine Indikation',
    },
    {
      name: 'Blutbild (BB)',
      recommended: blutbild,
      reason: 'PBM-Konzept: Anämie-Screening für alle Patient:innen vor elektiver OP (DGAI Leitlinie Anämie 2023, Klasse I)',
    },
    {
      name: 'Kreatinin / eGFR',
      recommended: creatEgfr,
      reason: creatEgfr
        ? `Indikation: ${[!isNaN(age) && age >= 45 && 'Alter ≥45 J.', f.rcriDiabetesInsulin && 'Diabetes (RCRI)', f.hxHypertension && 'Hypertonie'].filter(Boolean).join(', ')}`
        : 'Bei fehlendem klinischem Anhalt nicht routinemäßig',
    },
    {
      name: 'Blutzucker / HbA1c',
      recommended: hba1c,
      reason: hba1c
        ? 'Diabetes mellitus: HbA1c für perioperatives Risiko und OP-Verschiebungsentscheidung (>8,5 % → Optimierung empfohlen)'
        : 'Keine Indikation',
    },
    {
      name: 'Elektrolyte (Na⁺, K⁺)',
      recommended: elektrolyte,
      reason: elektrolyte
        ? `Indikation: ${[f.hxACEorARB && 'ACE-Hemmer/Sartan', f.hxDiuretic && 'Diuretikum', f.hxSGLT2 && 'SGLT-2-Inhibitor', f.rcriCreatinineOver2 && 'Niereninsuffizienz'].filter(Boolean).join(', ')}`
        : 'Keine Routineindikation',
    },
    {
      name: 'Gerinnungsstatus (INR, aPTT, Fibrinogen)',
      recommended: coag.needed,
      reason: coag.reason,
    },
    {
      name: 'Leberwerte (GPT, GOT, GGT, Bilirubin, Albumin)',
      recommended: f.hxLiverDisease || f.hxAnticoagulant,
      reason: f.hxLiverDisease ? 'Lebererkrankung: Synthesefunktion präoperativ prüfen' : f.hxAnticoagulant ? 'Antikoagulation: Leberfunktion relevant für Metabolisierung' : 'Keine Routineindikation',
    },
    {
      name: 'Echokardiographie (TTE)',
      recommended: tte,
      reason: tte
        ? `Indikation: ${[f.hxValvularDisease && 'Valvuläre Herzerkrankung', f.hxPoorLVFunction && 'Reduzierte LV-Funktion', (f.activeCardiac_severeStenosisAo || f.activeCardiac_severeMitralStenosis) && 'Schwere Klappenstenose', f.functionalCapacity === 'poor' && rcri >= 2 && 'RCRI ≥2 + eingeschränkte Belastungstoleranz'].filter(Boolean).join(', ')}`
        : 'Kein routinemäßiges Screening (ESC 2022 III)',
    },
    {
      name: 'Nicht-invasiver Stresstest (Belastungs-EKG / Stress-Echo / MPI)',
      recommended: stressTestIndication(f, rcri).indication !== 'none',
      reason: stressTestIndication(f, rcri).reason || 'Keine Indikation',
    },
    {
      name: 'Spirometrie / Lungenfunktionstest',
      recommended: spirometrie,
      reason: spirometrie
        ? `Indikation: ${[ariscat !== null && ariscat >= 26 && `ARISCAT ≥26 (Score ${ariscat})`, f.hxCOPD && 'Bekannte COPD'].filter(Boolean).join(', ')}`
        : 'Keine Indikation (ARISCAT niedrig)',
    },
    {
      name: 'Röntgen Thorax',
      recommended: roThorax,
      reason: roThorax
        ? 'Indikation: Dekompensierte Herzinsuffizienz oder klinischer Verdacht auf kardiopulmonale Dekompensation'
        : 'Keine Routineindikation präoperativ (DGAI 2024)',
    },
  ]
}

// ── Anämie-Empfehlung (DGAI 2023) ────────────────────────────────────────────
export function anaemiaRecommendation(hb: number, sex: 'male' | 'female' | ''): string[] {
  const threshold = sex === 'male' ? 13.0 : 12.0
  const sexLabel = sex === 'male' ? '♂' : '♀'
  if (hb >= threshold) return []
  const lines: string[] = [
    `Hb ${hb.toFixed(1)} g/dL → Präoperative Anämie (Schwellenwert ${sexLabel}: ${threshold.toFixed(1)} g/dL; WHO)`,
    'Workup: Ferritin, Transferrinsättigung, CRP, Retikulozyten-Hb, Vitamin B12, Folsäure',
    'Eisenmangel absolut (Ferritin <30 ng/mL): orales Eisen wenn OP-Termin ≥6 Wochen; i.v. Eisen (z.B. Ferrinject 1.000 mg) wenn <6 Wochen',
    'Eisenmangel funktionell (Ferritin 30–100 ng/mL + TSAT <20 %): i.v. Eisen bevorzugen',
    `Ziel-Hb präoperativ: ≥${threshold.toFixed(1)} g/dL (${sexLabel}) — OP ggf. verschieben bis zur Korrektur`,
    'Perioperativer Transfusionstrigger: Hb 7–8 g/dL (restriktiv); bei KHK: 8–9 g/dL',
  ]
  if (hb < 10) lines.push('Hb <10 g/dL: Hämatologe/Transfusionsmedizin einbeziehen; EPO bei renaler Anämie oder Eigenblutspende erwägen')
  return lines
}

// ── Klinische Empfehlungen ────────────────────────────────────────────────────
export function buildRecommendations(f: FormState, rcri: number, ariscat: number | null, sbScore: number): string[] {
  const recs: string[] = []
  const isIntermediateOrHigh = f.surgicalRisk === 'intermediate' || f.surgicalRisk === 'high'
  const stressTest = stressTestIndication(f, rcri)

  // Aktive kardiale Bedingungen — höchste Priorität
  if (hasActiveCardiacCondition(f)) {
    recs.push('⚠ AKTIVE KARDIALE BEDINGUNG: Elektiver Eingriff erst nach kardiologischer Behandlung und Stabilisierung (ESC 2022 Klasse I). Kardiologie dringend konsultieren.')
  }

  // Stent-Timing
  const stent = evaluateStentTiming(f)
  if (stent.status === 'contraindicated') recs.push(`⚠ STENT-TIMING: ${stent.message}`)
  else if (stent.status === 'warning') recs.push(`Stent-Timing beachten: ${stent.message}`)
  else if (stent.status === 'ok') recs.push(`Stent-Timing: ${stent.message}`)

  // Kardiologisches Konsil
  if (!hasActiveCardiacCondition(f)) {
    if (rcri >= 3 && isIntermediateOrHigh) {
      recs.push('Kardiologisches Konsil dringend empfohlen (RCRI ≥3 + mittleres/hohes OP-Risiko; ESC 2022 IIa)')
    } else if (rcri >= 2 && isIntermediateOrHigh) {
      recs.push('Kardiologisches Konsil empfohlen (RCRI ≥2 + mittleres/hohes OP-Risiko; ESC 2022 IIa)')
    } else if (rcri >= 1 && f.surgicalRisk === 'high') {
      recs.push('Kardiologisches Konsil erwägen (RCRI ≥1 + hohes OP-Risiko)')
    }
  }

  // Stresstest
  if (stressTest.indication !== 'none') recs.push(stressTest.reason)

  // Biomarker-Interpretation
  const ntprobnpVal = parseFloat(f.ntprobnp)
  const bnpVal = parseFloat(f.bnp)
  if (!isNaN(ntprobnpVal) && ntprobnpVal >= 300) {
    recs.push(`NT-proBNP ${ntprobnpVal} ng/L ≥300 → erhöhtes perioperatives MACE-Risiko: postoperatives Troponin-Monitoring obligat (24h + 48h nach OP)`)
  }
  if (!isNaN(bnpVal) && bnpVal >= 92) {
    recs.push(`BNP ${bnpVal} ng/L ≥92 → erhöhtes perioperatives MACE-Risiko: postoperatives Troponin-Monitoring obligat`)
  }

  // Medikation perioperativ
  if (f.hxBetablocker) recs.push('Beta-Blocker perioperativ weiterführen — abruptes Absetzen kontraindiziert (Rebound-Tachykardie, erhöhtes MACE-Risiko)')
  if (f.hxStatin) recs.push('Statin-Therapie perioperativ weiterführen — Absetzen erhöht kardiales Risiko')
  if (f.hxACEorARB) recs.push('ACE-Hemmer / Sartan: am OP-Morgen pausieren (Hypotonie intraoperativ; ESC 2022) — postoperativ nach hämodynamischer Stabilisierung wieder ansetzen')
  if (f.hxSGLT2) recs.push('SGLT-2-Inhibitor: 3–4 Tage präoperativ absetzen — Risiko euglykämischer Ketoazidose (euDKA) perioperativ auch bei normalem BZ!')
  if (f.hxGLP1) recs.push('GLP-1-Agonist (wöchentlich): 1 Woche vor OP absetzen; täglich: am OP-Tag absetzen — verlangsamte Magenentleerung → Aspirationsrisiko trotz Nüchternheit. Ggf. Magensonographie präoperativ erwägen.')
  if (f.hxAnticoagulant || f.bleeding_anticoagulant) recs.push('Antikoagulation: individuelles Bridging-/Pausierungskonzept erstellen — Rücksprache Hämatologe/behandelnder Arzt')
  if (f.hxAntiplatelet) recs.push('Thrombozytenaggregationshemmer: Pausierungsstrategie individuell prüfen — bei Stent-Versorgung keine Unterbrechung ohne kardiologische Freigabe')

  // Diabetes
  const hba1cVal = parseFloat(f.hba1c)
  if ((f.rcriDiabetesInsulin || f.hxDiabetes) && !isNaN(hba1cVal)) {
    const hba1cEval = evaluateHbA1c(hba1cVal)
    recs.push(hba1cEval.label)
    if (hba1cEval.postpone) recs.push('Diabetologisches Konsil für präoperative Optimierung empfohlen')
  } else if (f.rcriDiabetesInsulin || f.hxDiabetes) {
    recs.push('Diabetes mellitus: HbA1c bestimmen (Schwellenwert >8,5 % → Optimierung vor elektiver OP)')
    recs.push('Perioperatives Glukosemanagement: Ziel-BZ 140–180 mg/dL, BZ-Kontrollen ≥stündlich intraoperativ')
  }

  // Schlafapnoe
  if (sbScore >= 5) {
    recs.push('STOP-BANG ≥5 → Hohes OSA-Risiko: Schlafmedizinische Abklärung (Polygraphie/Polysomnographie) empfehlen; CPAP präoperativ sicherstellen falls bekannt; postoperative Überwachung erhöhen')
  } else if (sbScore >= 3) {
    recs.push('STOP-BANG 3–4 → Mittleres OSA-Risiko: Schlafapnoe-Abklärung empfehlen; bei bekannter OSA CPAP perioperativ sicherstellen')
  }
  if (f.hxOSA) recs.push('Bekannte OSA: CPAP-Gerät für perioperative Phase sicherstellen; erhöhte postoperative Überwachung')

  // Pulmonales Risiko
  if (ariscat !== null && ariscat >= 45) {
    recs.push('ARISCAT ≥45 → Hohes pulmonales Risiko: Regionale Anästhesie bevorzugen; intensive Atemphysiotherapie prä- und postoperativ; PONV-Prophylaxe; Lungenprotektive Beatmungsstrategie (VT 6–8 ml/kgKG, PEEP); frühe Mobilisierung')
  } else if (ariscat !== null && ariscat >= 26) {
    recs.push('ARISCAT 26–44 → Mittleres pulmonales Risiko: Atemphysiotherapie präoperativ; regionale Anästhesieverfahren erwägen; PONV-Prophylaxe')
  }
  if (f.hxCOPD) recs.push('COPD: präoperative Optimierung der Inhalationstherapie; Lungenfunktion prüfen; Raucherentwöhnung ≥4 Wochen vor OP empfohlen')

  // Frailty
  if (f.cfs >= 5) recs.push(`CFS ${f.cfs}/9 → Geriatrisches Konsil und interdisziplinäre präoperative Optimierung empfohlen (Prehabilitation, Ernährungsoptimierung, Physiotherapie)`)

  // Valvuläre Erkrankung / LV-Funktion
  if (f.hxValvularDisease) recs.push('Valvuläre Herzerkrankung: TTE präoperativ; kardiologische Clearance erforderlich')
  if (f.hxPoorLVFunction) recs.push('Reduzierte LV-Funktion: präoperative Optimierung (Herzinsuffizienztherapie), TTE, kardiologisches Konsil')

  return recs
}

// ── Gesamtausgabe ─────────────────────────────────────────────────────────────
export function generateOutputText(f: FormState): string {
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const age = parseInt(f.age)
  const weight = parseFloat(f.weight)
  const height = parseFloat(f.height)
  const cr = parseFloat(f.creatinine)
  const hb = parseFloat(f.hemoglobin)
  const hba1c = parseFloat(f.hba1c)
  const ntprobnp = parseFloat(f.ntprobnp)
  const bnp = parseFloat(f.bnp)
  const bmi = !isNaN(weight) && !isNaN(height) ? calcBMI(weight, height) : null
  const egfr = !isNaN(cr) && !isNaN(age) && f.sex ? calcEGFR(cr, age, f.sex) : null

  const rcri = calcRCRI(f)
  const rcriR = rcriRisk(rcri)
  const ariscat = calcARISCAT(f)
  const sbScore = calcSTOPBANG(f)
  const sbR = stopBangRisk(sbScore)
  const penFast = calcPENFAST(f)
  const stressTest = stressTestIndication(f, rcri)
  const stent = evaluateStentTiming(f)
  const diagnostics = buildDiagnostics(f, rcri, ariscat)
  const recs = buildRecommendations(f, rcri, ariscat, sbScore)
  const coag = needsCoagulationWorkup(f)

  const surgRiskLabel =
    f.surgicalRisk === 'low' ? 'NIEDRIG (<1 % MACE)' :
    f.surgicalRisk === 'intermediate' ? 'MITTEL (1–5 % MACE)' :
    f.surgicalRisk === 'high' ? 'HOCH (>5 % MACE)' : 'nicht angegeben'
  const sexLabel = f.sex === 'male' ? '♂' : f.sex === 'female' ? '♀' : ''
  const asaLabel = f.asa ? `ASA ${f.asa}` : 'ASA nicht eingestuft'
  const sep = '─'.repeat(55)

  const lines: string[] = []

  lines.push('PRÄOPERATIVES ASSESSMENT')
  lines.push(`Datum: ${today}`)
  lines.push('')

  // Patientendaten
  lines.push('PATIENTENDATEN')
  lines.push(sep)
  const pat: string[] = []
  if (f.age) pat.push(`Alter: ${f.age} J.`)
  if (f.sex) pat.push(sexLabel)
  if (!isNaN(weight)) pat.push(`${weight} kg`)
  if (!isNaN(height)) pat.push(`${height} cm`)
  if (bmi) pat.push(`BMI: ${bmi}`)
  lines.push(pat.join(' | ') || 'Keine Angaben')

  const lab: string[] = []
  if (!isNaN(cr)) lab.push(`Krea: ${cr} mg/dL`)
  if (egfr) lab.push(`eGFR: ${egfr} ml/min/1,73 m²`)
  if (!isNaN(hb)) lab.push(`Hb: ${hb} g/dL${f.sex && isAnaemia(hb, f.sex) ? ' ⚠ Anämie' : ''}`)
  if (!isNaN(hba1c)) lab.push(`HbA1c: ${hba1c} %`)
  if (!isNaN(ntprobnp)) lab.push(`NT-proBNP: ${ntprobnp} ng/L${ntprobnp >= 300 ? ' ⚠ erhöht' : ''}`)
  if (!isNaN(bnp)) lab.push(`BNP: ${bnp} ng/L${bnp >= 92 ? ' ⚠ erhöht' : ''}`)
  if (lab.length) lines.push(lab.join(' | '))
  lines.push('')

  // Eingriff
  lines.push('GEPLANTER EINGRIFF')
  lines.push(sep)
  lines.push(f.surgeryDescription || '(nicht angegeben)')
  lines.push(`Eingriffsbezogenes Risiko: ${surgRiskLabel}`)
  lines.push(`Funktionelle Kapazität: ${f.functionalCapacity === 'good' ? '≥4 METs (gut)' : f.functionalCapacity === 'poor' ? '<4 METs (eingeschränkt)' : 'nicht angegeben'}`)
  lines.push(`Anästhesiologische Einstufung: ${asaLabel}`)
  if (f.emergency) lines.push('⚠ NOTFALLEINGRIFF')
  lines.push('')

  // Aktive kardiale Bedingungen
  const activeItems = activeCardiacItems(f)
  if (activeItems.length > 0) {
    lines.push('⚠ AKTIVE KARDIALE BEDINGUNGEN (Stopp-Kriterien ESC 2022)')
    lines.push(sep)
    activeItems.forEach(i => lines.push(`  • ${i}`))
    lines.push('→ Elektive OP erst nach kardiologischer Behandlung und Stabilisierung!')
    lines.push('')
  }

  // Stent
  if (stent.status !== 'none') {
    lines.push('KORONARER STENT')
    lines.push(sep)
    lines.push(stent.message)
    lines.push('')
  }

  // Scores
  lines.push('RISIKOSTRATIFIZIERUNG / SCORES')
  lines.push(sep)

  // RCRI
  const posItems = rcriPositiveItems(f)
  lines.push(`RCRI nach Lee: ${rcri}/6 → kardiales MACE-Risiko ${rcriR.pct} (${rcriR.label})`)
  if (posItems.length) lines.push(`  Positiv: ${posItems.join(' | ')}`)

  // Stresstest
  if (stressTest.indication !== 'none') {
    lines.push(`  → ${stressTest.reason}`)
  }

  // Biomarker-Befunde
  if (!isNaN(ntprobnp)) lines.push(`  → ${interpretNTproBNP(ntprobnp).label}`)
  if (!isNaN(bnp)) lines.push(`  → ${interpretBNP(bnp).label}`)

  // CFS
  if (f.cfs > 0) lines.push(`Clinical Frailty Scale: ${f.cfs}/9 — ${CFS_LABELS[f.cfs]}`)

  // ARISCAT
  if (ariscat !== null) {
    const ar = ariscatRisk(ariscat)
    lines.push(`ARISCAT-Score: ${ariscat} Punkte → pulmonales Risiko ${ar.pct} (${ar.label})`)
  }

  // STOP-BANG
  lines.push(`STOP-BANG: ${sbScore}/8 → OSA-Risiko ${sbR.label}`)

  // PEN-FAST
  if (penFast !== null) {
    const pfR = penFastRisk(penFast)
    lines.push(`PEN-FAST: ${penFast}/5 → Penicillin-Allergie IgE-vermittelt ${pfR.pct} wahrscheinlich (${pfR.label})`)
  } else {
    lines.push('PEN-FAST: Keine Penicillin-Allergie angegeben')
  }
  lines.push('')

  // HbA1c
  if (!isNaN(hba1c) && (f.rcriDiabetesInsulin || f.hxDiabetes)) {
    const h = evaluateHbA1c(hba1c)
    lines.push('DIABETES-MANAGEMENT')
    lines.push(sep)
    lines.push(h.label)
    lines.push('')
  }

  // Anämie
  if (!isNaN(hb) && f.sex) {
    const anaLines = anaemiaRecommendation(hb, f.sex)
    if (anaLines.length) {
      lines.push('ANÄMIE-ASSESSMENT (DGAI Leitlinie 2023)')
      lines.push(sep)
      anaLines.forEach(l => lines.push(l))
      lines.push('')
    }
  }

  // Diagnostik
  lines.push('EMPFOHLENE DIAGNOSTIK (ESC 2022 / DGAI 2024)')
  lines.push(sep)
  diagnostics.forEach(d => {
    lines.push(`${d.recommended ? '[X]' : '[ ]'} ${d.name}`)
    lines.push(`    → ${d.reason}`)
  })
  lines.push('')

  // Gerinnungsdiagnostik
  lines.push('GERINNUNGSDIAGNOSTIK')
  lines.push(sep)
  lines.push(`${coag.needed ? '[X] Indiziert' : '[ ] Nicht routinemäßig'}: ${coag.reason}`)
  lines.push('')

  // Empfehlungen
  if (recs.length) {
    lines.push('KLINISCHE EMPFEHLUNGEN')
    lines.push(sep)
    recs.forEach(r => lines.push(`• ${r}`))
    lines.push('')
  }

  lines.push(sep)
  lines.push('Leitliniengrundlage:')
  lines.push('• ESC/ESA 2022: Nicht-kardiochirurgische Eingriffe')
  lines.push('• DGAI/BDA 2024: Präoperative Evaluation')
  lines.push('• DGAI 2023: Präoperative Anämie / PBM')
  lines.push('Kein Ersatz für individuelle ärztliche Beurteilung.')

  return lines.join('\n')
}
