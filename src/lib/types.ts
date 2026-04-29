export interface FormState {
  // ── Patientendaten ──────────────────────────────────────────────────────────
  age: string
  sex: 'male' | 'female' | ''
  weight: string
  height: string
  creatinine: string
  hemoglobin: string
  hba1c: string
  ntprobnp: string
  bnp: string
  asa: '1' | '2' | '3' | '4' | '5' | ''

  // ── Eingriff ────────────────────────────────────────────────────────────────
  surgeryDescription: string
  surgicalRisk: 'low' | 'intermediate' | 'high' | ''
  surgicalSite: 'peripheral' | 'upper-abdominal' | 'intrathoracic' | ''
  surgeryDuration: '<2h' | '2-3h' | '>3h' | ''
  emergencyClass: 'N0' | 'N1' | 'N2' | 'N3' | 'N4' | 'elective' | ''
  functionalCapacity: 'good' | 'poor' | ''

  // ── Anästhesievorgeschichte ─────────────────────────────────────────────────
  prev_hadGA: boolean
  prev_year: string
  prev_wellTolerated: boolean
  prev_ponv: boolean
  prev_difficultAirway: boolean
  prev_awareness: boolean
  prev_otherComplication: string
  prev_familyMH: boolean
  prev_familyPseudocholin: boolean
  prev_familyOther: string

  // ── Atemweg ─────────────────────────────────────────────────────────────────
  aw_mallampati: '1' | '2' | '3' | '4' | ''
  aw_mouthOpening: '>4cm' | '3-4cm' | '<3cm' | ''
  aw_tmd: '>6.5cm' | '6-6.5cm' | '<6cm' | ''
  aw_reklination: 'normal' | 'limited' | 'very_limited' | ''
  aw_ulbt: '1' | '2' | '3' | ''
  aw_beard: boolean
  aw_shortNeck: boolean
  aw_micrognathia: boolean
  aw_obese: boolean
  aw_previousDifficult: boolean
  aw_notes: string

  // ── Noxen ───────────────────────────────────────────────────────────────────
  nox_smoking: boolean
  nox_cigPerDay: string
  nox_smokingYears: string
  nox_exSmoker: boolean
  nox_exSmokerSince: string
  nox_alcohol: boolean
  nox_alcoholGPerWeek: string
  nox_drugs: boolean
  nox_drugsText: string

  // ── Reflux / GERD ───────────────────────────────────────────────────────────
  reflux_heartburn: boolean
  reflux_mealIndependent: boolean   // Reflux/Sodbrennen auch unabhängig von Mahlzeiten / in Ruhe
  reflux_nocturnalCough: boolean    // Nächtliche Hustenanfälle oder Erwachen durch Reflux
  reflux_atRest: boolean
  reflux_regurgitation: boolean

  // ── Aktive kardiale Bedingungen (ESC 2022 Stopp-Kriterien) ─────────────────
  activeCardiac_unstableAngina: boolean
  activeCardiac_recentMI: boolean
  activeCardiac_decompHF: boolean
  activeCardiac_arrhythmia: boolean
  activeCardiac_severeStenosisAo: boolean
  activeCardiac_severeMitralStenosis: boolean

  // ── Koronarer Stent ─────────────────────────────────────────────────────────
  stent_hasDES: boolean
  stent_hasBMS: boolean
  stent_monthsSinceImplant: string

  // ── RCRI ────────────────────────────────────────────────────────────────────
  rcriHighRiskSurgery: boolean
  rcriIschemicHD: boolean
  rcriHeartFailure: boolean
  rcriCerebrovascular: boolean
  rcriDiabetesInsulin: boolean
  rcriCreatinineOver2: boolean

  // ── Clinical Frailty Scale ──────────────────────────────────────────────────
  cfs: number

  // ── Delirium-Risiko (ISAR + kognitive Baseline) ─────────────────────────────
  delir_isar1: boolean   // Hilfe bei ADL vor Hospitalisation
  delir_isar2: boolean   // Hospitalisation ≥1 Nacht in letzten 6 Monaten
  delir_isar3: boolean   // Erhebliche Sehprobleme trotz Korrektur
  delir_isar4: boolean   // Erhebliche Hörprobleme
  delir_isar5: boolean   // Gedächtnisschwierigkeiten (vom Pat. berichtet)
  delir_isar6: boolean   // ≥5 Medikamente täglich oder schwere Akuterkrankung
  delir_amts: string     // Abbreviated Mental Test Score 0–10 (leer = nicht getestet)
  delir_knownDementia: boolean
  delir_prevDelirium: boolean

  // ── ARISCAT ─────────────────────────────────────────────────────────────────
  ariscat_spo2: '>=96' | '91-95' | '<=90' | ''
  ariscat_respInfection: boolean

  // ── STOP-BANG ───────────────────────────────────────────────────────────────
  sb_snoring: boolean
  sb_tired: boolean
  sb_observed: boolean
  sb_pressure: boolean
  sb_neckOver40: boolean

  // ── PEN-FAST ────────────────────────────────────────────────────────────────
  pf_hasPenicillinAllergy: boolean
  pf_time: '<5years' | '>=5years' | ''
  pf_anaphylaxis: boolean
  pf_scar: boolean
  pf_treatment: boolean

  // ── Blutungsanamnese / Gerinnung ────────────────────────────────────────────
  bleeding_spontaneous: boolean
  bleeding_prolonged: boolean
  bleeding_familyHistory: boolean
  bleeding_anticoagulant: boolean

  // ── Medikation & Anamnese ───────────────────────────────────────────────────
  hxACEorARB: boolean
  hxDiuretic: boolean
  hxSGLT2: boolean
  hxGLP1: boolean
  hxBetablocker: boolean
  hxStatin: boolean
  hxAnticoagulant: boolean
  hxAntiplatelet: boolean
  hxHypertension: boolean
  hxDiabetes: boolean
  hxCOPD: boolean
  hxOSA: boolean
  hxValvularDisease: boolean
  hxPoorLVFunction: boolean
  hxLiverDisease: boolean

  // ── Nüchternheitskarte ──────────────────────────────────────────────────────
  fast_ileus: boolean
  fast_giObstruction: boolean
  fast_ileostomy: boolean
  fast_endoscopy: boolean
  fast_abdominalEmergency: boolean
  fast_pylorusStenosis: boolean
  fast_mrcp: boolean
}

export const defaultFormState: FormState = {
  age: '', sex: '', weight: '', height: '', creatinine: '', hemoglobin: '',
  hba1c: '', ntprobnp: '', bnp: '', asa: '',
  surgeryDescription: '', surgicalRisk: '', surgicalSite: '', surgeryDuration: '',
  emergencyClass: '', functionalCapacity: '',
  prev_hadGA: false, prev_year: '', prev_wellTolerated: true, prev_ponv: false,
  prev_difficultAirway: false, prev_awareness: false, prev_otherComplication: '',
  prev_familyMH: false, prev_familyPseudocholin: false, prev_familyOther: '',
  aw_mallampati: '', aw_mouthOpening: '', aw_tmd: '', aw_reklination: '',
  aw_ulbt: '', aw_beard: false, aw_shortNeck: false, aw_micrognathia: false,
  aw_obese: false, aw_previousDifficult: false, aw_notes: '',
  nox_smoking: false, nox_cigPerDay: '', nox_smokingYears: '', nox_exSmoker: false,
  nox_exSmokerSince: '', nox_alcohol: false, nox_alcoholGPerWeek: '', nox_drugs: false, nox_drugsText: '',
  reflux_heartburn: false, reflux_mealIndependent: false, reflux_nocturnalCough: false,
  reflux_atRest: false, reflux_regurgitation: false,
  activeCardiac_unstableAngina: false, activeCardiac_recentMI: false,
  activeCardiac_decompHF: false, activeCardiac_arrhythmia: false,
  activeCardiac_severeStenosisAo: false, activeCardiac_severeMitralStenosis: false,
  stent_hasDES: false, stent_hasBMS: false, stent_monthsSinceImplant: '',
  rcriHighRiskSurgery: false, rcriIschemicHD: false, rcriHeartFailure: false,
  rcriCerebrovascular: false, rcriDiabetesInsulin: false, rcriCreatinineOver2: false,
  cfs: 0,
  delir_isar1: false, delir_isar2: false, delir_isar3: false, delir_isar4: false,
  delir_isar5: false, delir_isar6: false, delir_amts: '', delir_knownDementia: false, delir_prevDelirium: false,
  ariscat_spo2: '', ariscat_respInfection: false,
  sb_snoring: false, sb_tired: false, sb_observed: false, sb_pressure: false, sb_neckOver40: false,
  pf_hasPenicillinAllergy: false, pf_time: '', pf_anaphylaxis: false, pf_scar: false, pf_treatment: false,
  bleeding_spontaneous: false, bleeding_prolonged: false, bleeding_familyHistory: false, bleeding_anticoagulant: false,
  hxACEorARB: false, hxDiuretic: false, hxSGLT2: false, hxGLP1: false,
  hxBetablocker: false, hxStatin: false, hxAnticoagulant: false, hxAntiplatelet: false,
  hxHypertension: false, hxDiabetes: false, hxCOPD: false, hxOSA: false,
  hxValvularDisease: false, hxPoorLVFunction: false, hxLiverDisease: false,
  fast_ileus: false, fast_giObstruction: false, fast_ileostomy: false,
  fast_endoscopy: false, fast_abdominalEmergency: false, fast_pylorusStenosis: false, fast_mrcp: false,
}
