export interface FormState {
  // Patientendaten
  age: string
  sex: 'male' | 'female' | ''
  weight: string
  height: string
  creatinine: string
  hemoglobin: string
  hba1c: string            // % — für DM-Management und OP-Verschiebung
  ntprobnp: string         // ng/L — präoperativer Biomarker
  bnp: string              // ng/L

  // Eingriff
  surgeryDescription: string
  surgicalRisk: 'low' | 'intermediate' | 'high' | ''
  surgicalSite: 'peripheral' | 'upper-abdominal' | 'intrathoracic' | ''
  surgeryDuration: '<2h' | '2-3h' | '>3h' | ''
  emergency: boolean
  functionalCapacity: 'good' | 'poor' | ''  // ≥4 METs vs <4 METs

  // ASA-Klassifikation (vom Anästhesisten)
  asa: '1' | '2' | '3' | '4' | '5' | ''

  // Aktive kardiale Bedingungen (ESC 2022 — Stopp-Kriterien vor RCRI)
  activeCardiac_unstableAngina: boolean        // Instabile/schwere Angina pectoris
  activeCardiac_recentMI: boolean              // Herzinfarkt <60 Tage
  activeCardiac_decompHF: boolean              // Dekompensierte Herzinsuffizienz
  activeCardiac_arrhythmia: boolean            // Signifikante Arrhythmie (AV-Block III, symptom. VT, SVT >100/min)
  activeCardiac_severeStenosisAo: boolean      // Schwere Aortenstenose
  activeCardiac_severeMitralStenosis: boolean  // Schwere Mitralklappenstenose

  // Koronare Stent-Anamnese
  stent_hasDES: boolean           // Drug-eluting Stent (DES)
  stent_hasBMS: boolean           // Bare-metal Stent (BMS)
  stent_monthsSinceImplant: string // Monate seit Implantation

  // RCRI nach Lee
  rcriHighRiskSurgery: boolean
  rcriIschemicHD: boolean
  rcriHeartFailure: boolean
  rcriCerebrovascular: boolean
  rcriDiabetesInsulin: boolean
  rcriCreatinineOver2: boolean

  // Clinical Frailty Scale (0 = nicht bewertet)
  cfs: number

  // ARISCAT
  ariscat_spo2: '>=96' | '91-95' | '<=90' | ''
  ariscat_respInfection: boolean

  // STOP-BANG (BMI, Alter, Geschlecht aus Patientendaten)
  sb_snoring: boolean
  sb_tired: boolean
  sb_observed: boolean
  sb_pressure: boolean
  sb_neckOver40: boolean

  // PEN-FAST
  pf_hasPenicillinAllergy: boolean
  pf_time: '<5years' | '>=5years' | ''
  pf_anaphylaxis: boolean
  pf_scar: boolean
  pf_treatment: boolean

  // Blutungsanamnese (Gerinnungsdiagnostik DGAI 2024)
  bleeding_spontaneous: boolean       // Spontanblutungen (Haut, Schleimhaut)
  bleeding_prolonged: boolean         // Verlängerte Blutung nach Eingriffen/Zahnextraktion
  bleeding_familyHistory: boolean     // Positive Familienanamnese
  bleeding_anticoagulant: boolean     // Antikoagulanzien (VKA, DOAK)

  // Anamnestische Zusatzinfos (für Empfehlungen)
  hxHypertension: boolean
  hxDiabetes: boolean
  hxACEorARB: boolean
  hxDiuretic: boolean
  hxSGLT2: boolean
  hxGLP1: boolean
  hxBetablocker: boolean
  hxStatin: boolean
  hxAnticoagulant: boolean
  hxAntiplatelet: boolean
  hxValvularDisease: boolean
  hxPoorLVFunction: boolean
  hxOSA: boolean                     // Bekannte OSA (für CPAP-Hinweis)
  hxCOPD: boolean
  hxLiverDisease: boolean
}

export const defaultFormState: FormState = {
  age: '',
  sex: '',
  weight: '',
  height: '',
  creatinine: '',
  hemoglobin: '',
  hba1c: '',
  ntprobnp: '',
  bnp: '',
  surgeryDescription: '',
  surgicalRisk: '',
  surgicalSite: '',
  surgeryDuration: '',
  emergency: false,
  functionalCapacity: '',
  asa: '',
  activeCardiac_unstableAngina: false,
  activeCardiac_recentMI: false,
  activeCardiac_decompHF: false,
  activeCardiac_arrhythmia: false,
  activeCardiac_severeStenosisAo: false,
  activeCardiac_severeMitralStenosis: false,
  stent_hasDES: false,
  stent_hasBMS: false,
  stent_monthsSinceImplant: '',
  rcriHighRiskSurgery: false,
  rcriIschemicHD: false,
  rcriHeartFailure: false,
  rcriCerebrovascular: false,
  rcriDiabetesInsulin: false,
  rcriCreatinineOver2: false,
  cfs: 0,
  ariscat_spo2: '',
  ariscat_respInfection: false,
  sb_snoring: false,
  sb_tired: false,
  sb_observed: false,
  sb_pressure: false,
  sb_neckOver40: false,
  pf_hasPenicillinAllergy: false,
  pf_time: '',
  pf_anaphylaxis: false,
  pf_scar: false,
  pf_treatment: false,
  bleeding_spontaneous: false,
  bleeding_prolonged: false,
  bleeding_familyHistory: false,
  bleeding_anticoagulant: false,
  hxHypertension: false,
  hxDiabetes: false,
  hxACEorARB: false,
  hxDiuretic: false,
  hxSGLT2: false,
  hxGLP1: false,
  hxBetablocker: false,
  hxStatin: false,
  hxAnticoagulant: false,
  hxAntiplatelet: false,
  hxValvularDisease: false,
  hxPoorLVFunction: false,
  hxOSA: false,
  hxCOPD: false,
  hxLiverDisease: false,
}
