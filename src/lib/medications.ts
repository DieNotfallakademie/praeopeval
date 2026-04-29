export interface Medication {
  id: string
  genericName: string
  tradeNames: string[]
  drugClass: string
  urgency: 'continue' | 'pause' | 'reduce' | 'caution'
  perioperativeManagement: string
  renalNote?: string
}

export const MEDICATIONS: Medication[] = [
  // ── Antikoagulanzien ────────────────────────────────────────────────────────
  {
    id: 'phenprocoumon',
    genericName: 'Phenprocoumon',
    tradeNames: ['Marcumar', 'Falithrom'],
    drugClass: 'Vitamin-K-Antagonist',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 5 Tage präoperativ absetzen. INR-Kontrolle am Vortag der OP (Ziel INR <1,5 für die meisten Eingriffe; <1,2 für neurochirurgische/ophthalmologische Eingriffe). Bei hohem thromboembolischen Risiko: Bridging mit NMH gemäß individuellem Konzept. Postoperativ: Wiederansetzen sobald ausreichende Hämostase gesichert, INR-Kontrollen.',
    renalNote: 'Keine renale Dosisanpassung erforderlich (hepatisch metabolisiert).',
  },
  {
    id: 'warfarin',
    genericName: 'Warfarin',
    tradeNames: ['Coumadin'],
    drugClass: 'Vitamin-K-Antagonist',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 5 Tage präoperativ. INR-Kontrolle präoperativ (Ziel <1,5). Bridging bei hohem thromboembolischen Risiko mit NMH. Postoperativ Wiederansetzen nach gesicherter Hämostase.',
    renalNote: 'Keine renale Dosisanpassung erforderlich.',
  },
  {
    id: 'apixaban',
    genericName: 'Apixaban',
    tradeNames: ['Eliquis'],
    drugClass: 'Direkter Faktor-Xa-Hemmer (DOAK)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 24–48 h präoperativ bei niedrigem Blutungsrisiko; 48 h (2 Dosen) bei hohem Blutungsrisiko. KEIN Routine-Bridging mit NMH. Postoperativ: 24–48 h nach Eingriff (nach gesicherter Hämostase) wieder ansetzen. Kein INR-Monitoring erforderlich.',
    renalNote: 'Vorsicht bei GFR <15 ml/min (kontraindiziert). Bei GFR 15–29: 5 mg 2×/d → 2,5 mg 2×/d wenn 2 von 3 Kriterien: Alter ≥80, Gewicht ≤60 kg, Kreatinin ≥1,5 mg/dL.',
  },
  {
    id: 'rivaroxaban',
    genericName: 'Rivaroxaban',
    tradeNames: ['Xarelto'],
    drugClass: 'Direkter Faktor-Xa-Hemmer (DOAK)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 24 h präoperativ bei niedrigem Blutungsrisiko; 48 h bei hohem Blutungsrisiko. KEIN Routine-Bridging. Postoperativ: nach gesicherter Hämostase (frühestens 6–8 h nach Eingriff, typisch 24–48 h).',
    renalNote: 'Kontraindiziert bei GFR <15 ml/min. Bei GFR 15–49: Vorsicht, keine Dosisänderung für AF-Indikation, Dosisreduktion bei tiefer Venenthrombose-Prophylaxe beachten.',
  },
  {
    id: 'edoxaban',
    genericName: 'Edoxaban',
    tradeNames: ['Lixiana', 'Savaysa'],
    drugClass: 'Direkter Faktor-Xa-Hemmer (DOAK)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 24 h präoperativ bei niedrigem Blutungsrisiko; 48 h bei hohem Blutungsrisiko. KEIN Routine-Bridging. Postoperativ: Wiederansetzen nach gesicherter Hämostase.',
    renalNote: 'Vorsicht bei GFR <15 ml/min (nicht empfohlen). Bei GFR 15–50 ml/min: Dosisreduktion auf 30 mg/d empfohlen.',
  },
  {
    id: 'dabigatran',
    genericName: 'Dabigatran',
    tradeNames: ['Pradaxa'],
    drugClass: 'Direkter Thrombinhemmer (DOAK)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: Pausierungsdauer stark abhängig von Nierenfunktion (renale Elimination 80 %)! Bei GFR ≥50: 24–48 h; GFR 30–49: 48–96 h; GFR <30: kontraindiziert. KEIN Routine-Bridging. Postoperativ nach gesicherter Hämostase.',
    renalNote: 'KONTRAINDIZIERT bei GFR <30 ml/min. Bei GFR 30–49 verlängerte Auswaschzeit beachten (bis 96 h vor OP). Dabigatran-Spiegel (Ecarin-Clotting-Time oder direkte Messung) bei Notfall-OP oder Unsicherheit bestimmen.',
  },
  {
    id: 'enoxaparin',
    genericName: 'Enoxaparin',
    tradeNames: ['Clexane', 'Inhixa'],
    drugClass: 'Niedermolekulares Heparin (NMH)',
    urgency: 'pause',
    perioperativeManagement:
      'Therapeutische Dosis: Letzte Gabe 24 h vor OP. Prophylaktische Dosis: Letzte Gabe 12 h vor OP. Postoperativ: Thromboseprophylaxe ab 6–12 h nach Eingriff wieder starten (individuelle Abwägung Blutung vs. Thromboserisiko).',
    renalNote: 'Bei GFR <30 ml/min: Dosisreduktion auf 1 mg/kg/d (1×) und Anti-Xa-Spiegel-Monitoring empfohlen. Bei GFR <15: UFH bevorzugen.',
  },
  {
    id: 'heparin-ufh',
    genericName: 'Heparin (unfraktioniert)',
    tradeNames: ['Heparin-Natrium', 'Heparin-Calcium', 'Liquemin'],
    drugClass: 'Unfraktioniertes Heparin (UFH)',
    urgency: 'pause',
    perioperativeManagement:
      'i.v. Infusion: 4–6 h vor OP stoppen (kurze HWZ). s.c. Prophylaxe: 4–6 h vor OP letzte Gabe. aPTT-Monitoring bei therapeutischer Dosierung. Vorteil bei Niereninsuffizienz gegenüber NMH.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz erforderlich (nicht renal eliminiert).',
  },
  {
    id: 'fondaparinux',
    genericName: 'Fondaparinux',
    tradeNames: ['Arixtra'],
    drugClass: 'Selektiver Faktor-Xa-Hemmer',
    urgency: 'pause',
    perioperativeManagement:
      'Letzte Gabe 36–48 h vor geplantem Eingriff (lange HWZ). Kein Antidot verfügbar (Protamin unwirksam). Bei Notfall: rFVIIa erwägen.',
    renalNote: 'KONTRAINDIZIERT bei GFR <20 ml/min. Vorsicht bei GFR <50 ml/min.',
  },

  // ── Thrombozytenaggregationshemmer ─────────────────────────────────────────
  {
    id: 'ass',
    genericName: 'Acetylsalicylsäure (ASS)',
    tradeNames: ['Aspirin Cardio', 'Godamed', 'Togal ASS', 'ASS-ratiopharm'],
    drugClass: 'Thrombozytenaggregationshemmer (COX-1-Hemmer)',
    urgency: 'caution',
    perioperativeManagement:
      'Sekundärprävention (KHK, Schlaganfall, Stent): NICHT absetzen (erhöhtes kardiovaskuläres Risiko). Ausnahmen: Neurochirurgie (intrakraniell), posteriore Augensegment-Chirurgie → individuelle Risiko-Nutzen-Abwägung, möglichst Weiterführen. Primärprävention ohne CV-Erkrankung: 7 Tage pausieren wenn Blutungsrisiko relevant.',
    renalNote: 'Vorsicht bei GFR <10 ml/min (Akkumulation von Salicylaten).',
  },
  {
    id: 'clopidogrel',
    genericName: 'Clopidogrel',
    tradeNames: ['Plavix', 'Iscover', 'Clopidogrel-ratiopharm'],
    drugClass: 'Thrombozytenaggregationshemmer (P2Y12-Hemmer)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 5–7 Tage präoperativ (bei elektiven Eingriffen mit relevantem Blutungsrisiko). WICHTIG: Bei koronarem Stent (insb. DES): Rücksprache mit Kardiologie vor Absetzen — duale Thrombozytenhemmung ggf. nicht unterbrechen. Bei dringlicher OP mit Clopidogrel: erhöhtes Blutungsrisiko akzeptieren oder Thrombozytenkonzentrat vorhalten.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'ticagrelor',
    genericName: 'Ticagrelor',
    tradeNames: ['Brilique'],
    drugClass: 'Thrombozytenaggregationshemmer (P2Y12-Hemmer)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 5 Tage präoperativ bei elektiven Eingriffen. WICHTIG: Nicht abrupt absetzen bei frischem ACS oder Stent-Versorgung ohne kardiologische Rücksprache. Wirkung reversibel, aber längere Auswaschzeit als Clopidogrel.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'prasugrel',
    genericName: 'Prasugrel',
    tradeNames: ['Efient'],
    drugClass: 'Thrombozytenaggregationshemmer (P2Y12-Hemmer)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 7 Tage präoperativ. Irreversible Plättchenhemmung. Stärkster P2Y12-Hemmer — hohes Blutungsrisiko. Kardiologische Rücksprache vor Absetzen bei Stent-Versorgung.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },

  // ── Antihypertensiva ────────────────────────────────────────────────────────
  {
    id: 'ramipril',
    genericName: 'Ramipril',
    tradeNames: ['Delix', 'Vesdil', 'Ramipril-ratiopharm', 'ISIS Ramipril'],
    drugClass: 'ACE-Hemmer',
    urgency: 'pause',
    perioperativeManagement:
      'Am Operationstag absetzen (Morgen-Dosis weglassen). Begründung: Erhöhtes Risiko therapierefraktärer intraoperativer Hypotonie, insb. bei Regionalanästhesie und RAAS-Aktivierung. Postoperativ Wiederansetzen nach Stabilisierung (Volumenhaushalt, Nierenfunktion). Dauertherapie bei Herzinsuffizienz: individuelle Entscheidung.',
    renalNote: 'Bei GFR <10 ml/min: Dosis halbieren, regelmäßige Kalium- und Kreatinin-Kontrollen.',
  },
  {
    id: 'lisinopril',
    genericName: 'Lisinopril',
    tradeNames: ['Lisinal', 'Coric', 'Lisinopril-ratiopharm'],
    drugClass: 'ACE-Hemmer',
    urgency: 'pause',
    perioperativeManagement:
      'Am Operationstag absetzen. Gleiches Vorgehen wie bei anderen ACE-Hemmern: Hypotonie-Risiko intraoperativ.',
    renalNote: 'Bei GFR <30: Startdosis reduzieren. Renale Elimination — enge Überwachung.',
  },
  {
    id: 'enalapril',
    genericName: 'Enalapril',
    tradeNames: ['Xanef', 'Pres', 'Enalapril-ratiopharm'],
    drugClass: 'ACE-Hemmer',
    urgency: 'pause',
    perioperativeManagement: 'Am Operationstag absetzen. Hypotonie-Risiko intraoperativ.',
    renalNote: 'Bei GFR <30: Dosisreduktion erforderlich (renale Elimination des aktiven Metaboliten Enalaprilat).',
  },
  {
    id: 'valsartan',
    genericName: 'Valsartan',
    tradeNames: ['Diovan', 'Provas', 'Valsartan-ratiopharm'],
    drugClass: 'Angiotensin-II-Rezeptorblocker (ARB / Sartan)',
    urgency: 'pause',
    perioperativeManagement:
      'Am Operationstag absetzen. Gleiches Hypotonie-Risiko wie ACE-Hemmer. Postoperativ Wiederansetzen nach hämodynamischer Stabilisierung.',
    renalNote: 'Keine Dosisanpassung bei leichter bis mittelschwerer Niereninsuffizienz. Bei GFR <10: Vorsicht.',
  },
  {
    id: 'candesartan',
    genericName: 'Candesartan',
    tradeNames: ['Atacand', 'Blopress', 'Candesartan-ratiopharm'],
    drugClass: 'Angiotensin-II-Rezeptorblocker (ARB / Sartan)',
    urgency: 'pause',
    perioperativeManagement: 'Am Operationstag absetzen. Hypotonie-Risiko wie alle RAAS-Blocker.',
    renalNote: 'Keine Dosisanpassung bis GFR 30. Bei GFR <30: Startdosis 4 mg/d, langsam titrieren.',
  },
  {
    id: 'losartan',
    genericName: 'Losartan',
    tradeNames: ['Lorzaar', 'Losan', 'Losartan-ratiopharm'],
    drugClass: 'Angiotensin-II-Rezeptorblocker (ARB / Sartan)',
    urgency: 'pause',
    perioperativeManagement: 'Am Operationstag absetzen.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz; Leberfunktion relevant (hepatische Metabolisierung).',
  },
  {
    id: 'metoprolol',
    genericName: 'Metoprolol',
    tradeNames: ['Beloc', 'Beloc-Zok', 'Metoprolol-ratiopharm', 'Lopresor'],
    drugClass: 'Beta-1-selektiver Betablocker',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN — perioperatives Absetzen ist kontraindiziert (Rebound-Tachykardie, erhöhtes MACE-Risiko). Auch am OP-Tag mit einem Schluck Wasser einnehmen. Bei NPO: auf i.v. Metoprolol umstellen. Neu-Ansetzen perioperativ (bisher kein Beta-Blocker): gemäß ESC 2022 nur selektiv bei RCRI ≥3, mindestens 1 Woche vor OP beginnen, Herzfrequenz-Ziel 60–80/min.',
    renalNote: 'Keine Dosisanpassung erforderlich (hepatische Metabolisierung).',
  },
  {
    id: 'bisoprolol',
    genericName: 'Bisoprolol',
    tradeNames: ['Concor', 'Bisogamma', 'Bisoprolol-ratiopharm'],
    drugClass: 'Beta-1-selektiver Betablocker',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN. Auch am OP-Tag morgens einnehmen. Abruptes Absetzen strikt vermeiden.',
    renalNote: 'Bei GFR <20: Maximaldosis 10 mg/d. Duale Elimination (hepatisch + renal).',
  },
  {
    id: 'carvedilol',
    genericName: 'Carvedilol',
    tradeNames: ['Dilatrend', 'Querto', 'Carvedilol-ratiopharm'],
    drugClass: 'Nicht-selektiver Alpha-/Betablocker',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN. Abruptes Absetzen vermeiden. Alpha-blockierende Wirkung beachten (Hypotoniepotenzial).',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'amlodipin',
    genericName: 'Amlodipin',
    tradeNames: ['Norvasc', 'Amlodipin-ratiopharm', 'Amlodigamma'],
    drugClass: 'Calciumantagonist (Dihydropyridin)',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN. Perioperativ fortführen. Potenziert hypotensive Wirkung von Anästhetika — Anästhesist informieren.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'verapamil',
    genericName: 'Verapamil',
    tradeNames: ['Isoptin', 'Verahexal', 'Verapamil-ratiopharm'],
    drugClass: 'Calciumantagonist (Phenylalkylamin)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Negativ inotrop und chronotrop — Interaktion mit Anästhetika und neuromuskulären Blockern beachten. Anästhesist über Einnahme informieren.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'furosemid',
    genericName: 'Furosemid',
    tradeNames: ['Lasix', 'Furo-ratiopharm', 'Furobeta'],
    drugClass: 'Schleifendiuretikum',
    urgency: 'caution',
    perioperativeManagement:
      'Am OP-Tag in der Regel absetzen bzw. individuell entscheiden. Risiko: Hypovolämie, Hypokaliämie präoperativ. Elektrolyte (K+, Na+) und Nierenfunktion präoperativ kontrollieren. Postoperativ je nach Volumenstatus wiederansetzen.',
    renalNote: 'Bei fortgeschrittener Niereninsuffizienz (GFR <30) höhere Dosen erforderlich. Bei Dialysepatienten: Ausscheidungsförderung meist wirkungslos, aber Kalium-Kontrolle wichtig.',
  },
  {
    id: 'torasemid',
    genericName: 'Torasemid',
    tradeNames: ['Unat', 'Torem', 'Torasemid-ratiopharm'],
    drugClass: 'Schleifendiuretikum',
    urgency: 'caution',
    perioperativeManagement: 'Am OP-Tag individuell entscheiden. Elektrolyte präoperativ kontrollieren.',
    renalNote: 'Höhere Dosen bei GFR <30 erforderlich. Vorteil: vorwiegend hepatische Metabolisierung, daher weniger dosisabhängige Probleme bei Niereninsuffizienz als Furosemid.',
  },
  {
    id: 'hct',
    genericName: 'Hydrochlorothiazid (HCT)',
    tradeNames: ['HCT-ratiopharm', 'Esidrix', 'diverse Kombinationspräparate'],
    drugClass: 'Thiaziddiuretikum',
    urgency: 'caution',
    perioperativeManagement: 'Am OP-Tag absetzen. Elektrolyte und Nierenfunktion präoperativ kontrollieren.',
    renalNote: 'Bei GFR <30 ml/min: Wirkungsverlust (Thiazide ineffektiv). Auf Schleifendiuretikum wechseln.',
  },
  {
    id: 'spironolacton',
    genericName: 'Spironolacton',
    tradeNames: ['Aldactone', 'Spiro-ratiopharm', 'Aldopur'],
    drugClass: 'Kaliumsparendes Diuretikum / Aldosteronantagonist',
    urgency: 'caution',
    perioperativeManagement:
      'Am OP-Tag individuell entscheiden. Kaliumspiegel präoperativ kontrollieren (Hyperkaliämie-Risiko, insb. in Kombination mit ACE-Hemmern/Sartanen/NMH).',
    renalNote: 'Bei GFR <30: Hyperkaliämie-Risiko erhöht. Engmaschige Kalium-Kontrollen.',
  },

  // ── Antidiabetika ───────────────────────────────────────────────────────────
  {
    id: 'metformin',
    genericName: 'Metformin',
    tradeNames: ['Glucophage', 'Metformin-ratiopharm', 'Diabesin', 'Siofor'],
    drugClass: 'Biguanid (Antidiabetikum)',
    urgency: 'caution',
    perioperativeManagement:
      'Niedrig/mittleres OP-Risiko (keine Gewebshypoxie, normale Nierenfunktion): bis zum Vorabend der OP fortführen (E51 DGAI 2024). Hohes OP-Risiko (große Abdominal-/orthopädische Eingriffe) oder Kontrastmittelgabe: 48 h vor OP pausieren (E52 DGAI 2024). Risiko: Laktatazidose bei Kumulation (Niereninsuffizienz, Hypoxie). Postoperativ: Wiederansetzen nach Stabilisierung von GFR und oraler Ernährung.',
    renalNote: 'KONTRAINDIZIERT bei GFR <30 ml/min. Bei GFR 30–45: nur nach individueller Abwägung, Kontrastmittel kontraindiziert. Bei GFR 45–60: engmaschige Kontrolle.',
  },
  {
    id: 'repaglinid',
    genericName: 'Repaglinid',
    tradeNames: ['NovoNorm', 'Prandin', 'Repaglinid-ratiopharm'],
    drugClass: 'Glinid (kurzwirksamer Insulinsekretagog)',
    urgency: 'pause',
    perioperativeManagement:
      'Am OP-Morgen absetzen (Nüchternheit → Hypoglykämie-Risiko bei Insulinfreisetzung ohne Kohlenhydratzufuhr). Postoperativ erst wieder ansetzen wenn normale Mahlzeiten möglich.',
    renalNote: 'Bei GFR <40: Vorsicht, Startdosis reduzieren. Vorwiegend hepatische Metabolisierung.',
  },
  {
    id: 'pioglitazon',
    genericName: 'Pioglitazon',
    tradeNames: ['Actos', 'Pioglitazon-ratiopharm'],
    drugClass: 'Thiazolidindion / Glitazon (Insulinsensitizer)',
    urgency: 'continue',
    perioperativeManagement:
      'In der Regel keine Pause erforderlich (E DGAI 2024: Thiazolidindione — keine spezifische Pausierungsempfehlung bei Monotherapie). Cave: Flüssigkeitsretention und Ödemrisiko — perioperative Flüssigkeitsbilanz beachten. Bei bekannter Herzinsuffizienz kontraindiziert.',
    renalNote: 'Keine Dosisanpassung erforderlich (hepatische Metabolisierung).',
  },
  {
    id: 'acarbose',
    genericName: 'Acarbose',
    tradeNames: ['Glucobay', 'Acarbose-ratiopharm'],
    drugClass: 'Alpha-Glucosidase-Hemmer',
    urgency: 'pause',
    perioperativeManagement:
      'Am OP-Tag absetzen (E50 DGAI 2024). Wirkung abhängig von Kohlenhydratzufuhr — bei Nüchternheit wirkungslos. Kein Hypoglykämie-Risiko in Monotherapie. Postoperativ: erst wieder ansetzen wenn normale Kohlenhydrat-haltige Mahlzeiten möglich.',
    renalNote: 'Bei GFR <25 ml/min kontraindiziert.',
  },
  {
    id: 'empagliflozin',
    genericName: 'Empagliflozin',
    tradeNames: ['Jardiance', 'Synjardy (+ Metformin)', 'Glyxambi (+ Linagliptin)'],
    drugClass: 'SGLT-2-Inhibitor',
    urgency: 'pause',
    perioperativeManagement:
      '⚠ PAUSIEREN: 3–4 Tage (mind. 72 h) vor elektiven Eingriffen absetzen. Risiko: Euglykämische Ketoazidose (euDKA) perioperativ — auch bei normalen Blutzuckerwerten möglich! Bei dringlicher OP: DKA-Ausschluss (Ketonkörper im Urin/Blut). Postoperativ Wiederansetzen erst nach vollständiger Erholung und normaler oraler Ernährung.',
    renalNote: 'Bei GFR <30: für Glukosesenkung kontraindiziert (kardiorenale Indikation davon unabhängig bei HFrEF/CKD).',
  },
  {
    id: 'dapagliflozin',
    genericName: 'Dapagliflozin',
    tradeNames: ['Forxiga', 'Xigduo (+ Metformin)'],
    drugClass: 'SGLT-2-Inhibitor',
    urgency: 'pause',
    perioperativeManagement: '⚠ PAUSIEREN: 3–4 Tage (mind. 72 h) vor OP. Gleiche euDKA-Gefahr wie alle SGLT-2-Hemmer.',
    renalNote: 'Für Glukosesenkung: GFR <45 kontraindiziert. Herzinsuffizienz/CKD-Indikation: bis GFR 25 zugelassen.',
  },
  {
    id: 'canagliflozin',
    genericName: 'Canagliflozin',
    tradeNames: ['Invokana', 'Vokanamet (+ Metformin)'],
    drugClass: 'SGLT-2-Inhibitor',
    urgency: 'pause',
    perioperativeManagement: '⚠ PAUSIEREN: 3–4 Tage (mind. 72 h) vor OP. euDKA-Risiko.',
    renalNote: 'Bei GFR <30: kontraindiziert.',
  },
  {
    id: 'dulaglutid',
    genericName: 'Dulaglutid',
    tradeNames: ['Trulicity'],
    drugClass: 'GLP-1-Rezeptoragonist (wöchentlich)',
    urgency: 'pause',
    perioperativeManagement:
      '⚠ PAUSIEREN: 1 Woche vor geplantem Eingriff (wöchentliche Darreichungsform, E50 DGAI 2024). Verzögerte Magenentleerung → erhöhtes Aspirationsrisiko. Bei fehlender Pause oder Übelkeit/Erbrechen: Patient als nicht nüchtern betrachten. Engmaschige BZ-Kontrolle nach Absetzen.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'tirzepatid',
    genericName: 'Tirzepatid',
    tradeNames: ['Mounjaro', 'Zepbound'],
    drugClass: 'Dualer GIP/GLP-1-Rezeptoragonist (wöchentlich)',
    urgency: 'pause',
    perioperativeManagement:
      '⚠ PAUSIEREN: 1 Woche vor geplantem Eingriff (wöchentliche Gabe, analog GLP-1-Agonisten, E50 DGAI 2024). Tirzepatid hat ausgeprägte gastroparetische Wirkung — verzögerte Magenentleerung und erhöhtes Aspirationsrisiko. Ultraschall-Magenfüllung präoperativ erwägen. BZ-Kontrolle nach Absetzen.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'semaglutid',
    genericName: 'Semaglutid',
    tradeNames: ['Ozempic (s.c.)', 'Rybelsus (oral)', 'Wegovy (Adipositas)'],
    drugClass: 'GLP-1-Rezeptoragonist',
    urgency: 'pause',
    perioperativeManagement:
      '⚠ PAUSIEREN: 1 Woche (wöchentliche s.c.-Form Ozempic) vor Eingriff. Tägliche orale Form: 24 h Pause. Begründung: Verlangsamte Magenentleerung (Gastroparese-Risiko) → erhöhtes Aspirationsrisiko trotz korrekter Nüchternheit. Patient präoperativ auf Aspirationsrisiko befragen. Ggf. extended fasting oder Point-of-care-Ultraschall der Magenfüllung erwägen.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'liraglutid',
    genericName: 'Liraglutid',
    tradeNames: ['Victoza', 'Saxenda (Adipositas)'],
    drugClass: 'GLP-1-Rezeptoragonist',
    urgency: 'pause',
    perioperativeManagement:
      '⚠ PAUSIEREN: Tagesdosis-Form — am OP-Tag absetzen. Gastroparese-Risiko (verzögerte Magenentleerung) → Aspirationsgefahr beachten.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'sitagliptin',
    genericName: 'Sitagliptin',
    tradeNames: ['Januvia', 'Xelevia', 'Janumet (+ Metformin)'],
    drugClass: 'DPP-4-Inhibitor',
    urgency: 'caution',
    perioperativeManagement: 'In der Regel weiterführen. Am OP-Tag individuelle Entscheidung. Geringes Hypoglykämie-Risiko.',
    renalNote: 'Dosisreduktion erforderlich: GFR 30–49: 50 mg/d; GFR <30: 25 mg/d.',
  },
  {
    id: 'glimepirid',
    genericName: 'Glimepirid',
    tradeNames: ['Amaryl', 'Glimepirid-ratiopharm'],
    drugClass: 'Sulfonylharnstoff',
    urgency: 'pause',
    perioperativeManagement:
      'Am OP-Morgen absetzen. Hypoglykämie-Risiko bei perioperativem Fasten. Postoperativ vorsichtig niedrig dosiert wieder einsetzen wenn Normalkost möglich.',
    renalNote: 'Bei GFR <30: Hypoglykämie-Risiko erhöht, kontraindiziert. Bei GFR 30–60: Startdosis 1 mg/d, engmaschige BZ-Kontrollen.',
  },
  {
    id: 'glibenclamid',
    genericName: 'Glibenclamid',
    tradeNames: ['Euglucon', 'Glibenclamid-ratiopharm'],
    drugClass: 'Sulfonylharnstoff',
    urgency: 'pause',
    perioperativeManagement: 'Am OP-Morgen absetzen. Langsame Wirkdauer — erhöhtes Hypoglykämie-Risiko.',
    renalNote: 'Bei GFR <60: kontraindiziert wegen aktiver Metaboliten-Akkumulation und schwerer Hypoglykämie-Gefahr.',
  },
  {
    id: 'insulin',
    genericName: 'Insulin (alle)',
    tradeNames: ['Lantus', 'Tresiba', 'Toujeo', 'NovoRapid', 'Humalog', 'Apidra', 'Humulin', 'Actrapid', 'Levemir', 'Degludec'],
    drugClass: 'Insulin',
    urgency: 'reduce',
    perioperativeManagement:
      'Basalinsulin: Am OP-Abend/-Morgen Dosis um 20–30 % reduzieren. Kein Absetzen! Bolusinsulin (Kurzzeitinsulin): Am OP-Tag pausieren (kein Essen). Perioperativer Ziel-BZ: 140–180 mg/dL (7,8–10 mmol/L). BZ-Kontrollen alle 1–2 h perioperativ. Bei Typ-1-Diabetes: Basisrate aufrechterhalten (kein Nüchternheits-Nullrate). Rücksprache mit Diabetologischem Dienst empfohlen.',
    renalNote: 'Bei GFR <30: Insulinabbau verzögert → Hypoglykämie-Risiko erhöht. Dosis ggf. stärker reduzieren, engmaschiges BZ-Monitoring.',
  },

  // ── Statine ─────────────────────────────────────────────────────────────────
  {
    id: 'atorvastatin',
    genericName: 'Atorvastatin',
    tradeNames: ['Sortis', 'Atorvastatin-ratiopharm', 'Atoris'],
    drugClass: 'HMG-CoA-Reduktasehemmer (Statin)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN — perioperatives Absetzen erhöht das kardiovaskuläre Risiko. Auch am OP-Tag einnehmen. Wenn NPO: Statin so lange wie möglich vor Nüchternheitsphase geben oder nach OP so früh wie möglich wieder ansetzen.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'rosuvastatin',
    genericName: 'Rosuvastatin',
    tradeNames: ['Crestor', 'Rosu-Denk', 'Rosuvastatin-ratiopharm'],
    drugClass: 'HMG-CoA-Reduktasehemmer (Statin)',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN.',
    renalNote: 'Bei GFR <30: Maximaldosis 20 mg/d (Startdosis 5 mg/d).',
  },
  {
    id: 'simvastatin',
    genericName: 'Simvastatin',
    tradeNames: ['Zocor', 'Simva-ratiopharm', 'simvaBeta'],
    drugClass: 'HMG-CoA-Reduktasehemmer (Statin)',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN.',
    renalNote: 'Bei GFR <30: Startdosis 5 mg/d. Myopathie-Risiko beachten (insb. Kombination mit Ciclosporin, Amiodarone, Verapamil).',
  },

  // ── NSAR / Analgetika ───────────────────────────────────────────────────────
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofen',
    tradeNames: ['Nurofen', 'Brufen', 'Ibuprofen-ratiopharm', 'Dolormin'],
    drugClass: 'NSAR (COX-1/2-Hemmer)',
    urgency: 'pause',
    perioperativeManagement:
      '24–48 h vor OP pausieren. Erhöhtes Blutungsrisiko (Thrombozytenfunktion), gastrointestinale Komplikationen und renale Vasokonstriktion perioperativ. Postoperativ nach Einschätzung des Blutungsrisikos wieder ansetzen.',
    renalNote: 'Bei GFR <30: KONTRAINDIZIERT (akute Nierenschädigung, Flüssigkeitsretention). Bei GFR 30–59: Vorsicht, kurze Anwendungsdauer, engmaschige Nierenwertkontrolle.',
  },
  {
    id: 'diclofenac',
    genericName: 'Diclofenac',
    tradeNames: ['Voltaren', 'Diclac', 'Diclofenac-ratiopharm'],
    drugClass: 'NSAR (COX-1/2-Hemmer)',
    urgency: 'pause',
    perioperativeManagement: '24–48 h vor OP pausieren. Gleiche Überlegungen wie bei Ibuprofen.',
    renalNote: 'Bei GFR <30: KONTRAINDIZIERT.',
  },
  {
    id: 'celecoxib',
    genericName: 'Celecoxib',
    tradeNames: ['Celebrex'],
    drugClass: 'COX-2-selektiver Hemmer',
    urgency: 'caution',
    perioperativeManagement:
      'Geringeres Blutungsrisiko als nicht-selektive NSAR (keine Thrombozytenfunktionshemmung). Dennoch Nierenfunktion und kardiovaskuläres Risiko beachten. Am OP-Tag individuell entscheiden.',
    renalNote: 'Bei GFR <30: KONTRAINDIZIERT.',
  },

  // ── Psychopharmaka ──────────────────────────────────────────────────────────
  {
    id: 'tranylcypromin',
    genericName: 'Tranylcypromin',
    tradeNames: ['Jatrosom'],
    drugClass: 'MAO-Hemmer (irreversibel, nicht-selektiv)',
    urgency: 'pause',
    perioperativeManagement:
      '⚠⚠ PAUSIEREN: 14 Tage (2 Wochen) vor elektiver OP. Lebensgefährliche Wechselwirkungen mit Opiaten (Serotoninsyndrom, hypertensive Krisen), Katecholaminen, Sympathomimetika und indirekten Vasopressoren. Rücksprache mit Psychiatrie obligat. NOTFALL-OP: Anästhesist muss über MAO-Hemmer informiert sein; Ketamin, Pethidin, Tramadol strikt kontraindiziert.',
    renalNote: 'Keine spezifische renale Anpassung.',
  },
  {
    id: 'moclobemid',
    genericName: 'Moclobemid',
    tradeNames: ['Aurorix', 'Moclobemid-ratiopharm'],
    drugClass: 'MAO-Hemmer (reversibel, selektiv MAO-A = RIMA)',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 24 h vor OP ausreichend (reversible Hemmung, kürzere Auswaschzeit als klassische MAO-Hemmer). Dennoch Opioid-Interaktionen beachten — Pethidin kontraindiziert. Anästhesist informieren.',
    renalNote: 'Keine Dosisanpassung.',
  },
  {
    id: 'fluoxetin',
    genericName: 'Fluoxetin',
    tradeNames: ['Fluctin', 'Fluoxetin-ratiopharm'],
    drugClass: 'SSRI (Selektiver Serotonin-Wiederaufnahmehemmer)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen. Cave: Erhöhtes Blutungsrisiko durch SSRI (Thrombozytenserotonin-Depletion) — kombiniertes Risiko mit NSAR/ASS/Antikoagulanzien beachten. Lange HWZ (Fluoxetin: ~6 Tage, aktiver Metabolit ~14 Tage) — Serotoninsyndrom-Risiko bei Opioid-Gabe (insb. Tramadol, Pethidin, Fentanyl) gering aber vorhanden.',
    renalNote: 'Keine Dosisanpassung bei leichter-mittelschwerer Niereninsuffizienz.',
  },
  {
    id: 'sertralin',
    genericName: 'Sertralin',
    tradeNames: ['Zoloft', 'Sertra-Q', 'Sertralin-ratiopharm'],
    drugClass: 'SSRI',
    urgency: 'continue',
    perioperativeManagement: 'Weiterführen. Erhöhtes Blutungsrisiko (SSRI-Klasse). Serotoninsyndrom bei Tramadol-Kombination möglich.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'escitalopram',
    genericName: 'Escitalopram',
    tradeNames: ['Cipralex', 'Escitalopram-ratiopharm'],
    drugClass: 'SSRI',
    urgency: 'continue',
    perioperativeManagement: 'Weiterführen. QTc-Verlängerung beachten (Monitoring bei Risikopatienten). Blutungsrisiko.',
    renalNote: 'Bei GFR <20: Dosis halbieren (max. 10 mg/d).',
  },
  {
    id: 'venlafaxin',
    genericName: 'Venlafaxin',
    tradeNames: ['Trevilor', 'Efexor', 'Venlafaxin-ratiopharm'],
    drugClass: 'SNRI (Serotonin-Noradrenalin-Wiederaufnahmehemmer)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen. Blutungsrisiko ähnlich SSRI. Blutdruckanstieg unter Stress. Abruptes Absetzen: schweres Absetzsyndrom (kurze HWZ) — nie einfach pausieren!',
    renalNote: 'Bei GFR 10–30: Dosis um 25–50 % reduzieren.',
  },
  {
    id: 'amitriptylin',
    genericName: 'Amitriptylin',
    tradeNames: ['Saroten', 'Amineurin', 'Amitriptylin-ratiopharm'],
    drugClass: 'Trizyklisches Antidepressivum (TZA)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen (bei stabiler Einstellung). Cave: Anticholinerge Effekte, QTc-Verlängerung, Arrhythmie-Risiko. Wechselwirkungen mit Anästhetika. Anästhesist informieren. Keine abrupte Pausierung.',
    renalNote: 'Bei Niereninsuffizienz: Metaboliten-Akkumulation möglich, engmaschiges Monitoring.',
  },
  {
    id: 'lithium',
    genericName: 'Lithium',
    tradeNames: ['Quilonum', 'Hypnorex', 'Lithium Aspartum'],
    drugClass: 'Stimmungsstabilisator',
    urgency: 'caution',
    perioperativeManagement:
      '⚠ Rücksprache mit Psychiater obligat. Enge therapeutische Breite! Präoperativer Lithiumspiegel (Ziel: 0,6–0,8 mmol/l). Risiken: Dehydratation, NSAR, Diuretika → Lithiumtoxizität. Bei kurzen Eingriffen und stabilem Spiegel: weiterführen mit engmaschigem Monitoring. Bei großen Eingriffen/langer NPO: Spiegel prä- und postoperativ kontrollieren, ggf. vorübergehend pausieren nach psychiatrischer Rücksprache.',
    renalNote: 'Renale Elimination! Bei GFR <30: stark erhöhtes Toxizitätsrisiko. Dosis deutlich reduzieren oder alternatives Medikament erwägen.',
  },
  {
    id: 'clozapin',
    genericName: 'Clozapin',
    tradeNames: ['Leponex', 'Clozapin-ratiopharm'],
    drugClass: 'Atypisches Antipsychotikum',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen. Abruptes Absetzen → Rebound-Psychose, Entzugssymptome. Cave: Orthostatische Hypotonie, Agranulozytozose-Risiko (Blutbild präoperativ prüfen), Krampfanfallrisiko. Anästhesist informieren.',
    renalNote: 'Vorsicht bei Niereninsuffizienz (Metaboliten-Akkumulation).',
  },
  {
    id: 'quetiapin',
    genericName: 'Quetiapin',
    tradeNames: ['Seroquel', 'Quetiapin-ratiopharm'],
    drugClass: 'Atypisches Antipsychotikum',
    urgency: 'continue',
    perioperativeManagement: 'Weiterführen. QTc-Verlängerung, orthostatische Hypotonie beachten.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },

  // ── Antikonvulsiva ──────────────────────────────────────────────────────────
  {
    id: 'valproat',
    genericName: 'Valproinsäure',
    tradeNames: ['Depakine', 'Orfiril', 'Valproat-ratiopharm', 'Ergenyl'],
    drugClass: 'Antiepileptikum / Stimmungsstabilisator',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Abruptes Absetzen → Krampfanfall-Risiko! Am OP-Tag oral mit Schluck Wasser; bei NPO auf i.v. Formulierung umstellen. Cave: Hemmung der Thrombozytenfunktion, Hypofibrinogenämie — Blutungszeit/Gerinnung präoperativ prüfen.',
    renalNote: 'Keine Dosisanpassung, aber freie Fraktion erhöht bei Hypoalbuminämie (Nierensyndrom/Dialyse).',
  },
  {
    id: 'carbamazepin',
    genericName: 'Carbamazepin',
    tradeNames: ['Tegretal', 'Carbamazepin-ratiopharm', 'Timonil'],
    drugClass: 'Antiepileptikum',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Starker Enzyminduktor (CYP3A4, P-Gp) → Interaktionen mit Anästhetika (erhöhter Opioid-Bedarf), muskelrelaxanzien. Anästhesist informieren. Spiegel präoperativ prüfen.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'levetiracetam',
    genericName: 'Levetiracetam',
    tradeNames: ['Keppra', 'Levetiracetam-ratiopharm'],
    drugClass: 'Antiepileptikum',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Bei NPO auf i.v. Levetiracetam umstellen (1:1 Umrechnung). Keine relevanten Arzneimittelinteraktionen mit Anästhetika.',
    renalNote: 'Bei GFR <30: Dosisreduktion auf 50 %. Bei GFR <50: Dosisreduktion auf 75 %. Renale Elimination!',
  },
  {
    id: 'pregabalin',
    genericName: 'Pregabalin',
    tradeNames: ['Lyrica', 'Pregabalin-ratiopharm'],
    drugClass: 'Antiepileptikum / Neuropathieschmerz',
    urgency: 'continue',
    perioperativeManagement: 'Weiterführen. Präoperative Einzeldosis als Teil multimodaler Analgesie erwägen (wenn nicht schon Dauertherapie).',
    renalNote: 'GFR 30–60: max. 300 mg/d. GFR 15–30: max. 150 mg/d. GFR <15: max. 75 mg/d (Dosishalbierung und Frequenzreduktion).',
  },

  // ── Kortikoide ──────────────────────────────────────────────────────────────
  {
    id: 'prednisolon',
    genericName: 'Prednisolon',
    tradeNames: ['Decortin', 'Prednisolon-ratiopharm', 'Rectodelt'],
    drugClass: 'Glukokortikoid',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Abruptes Absetzen → Nebennierenrinden-Insuffizienz (NNR-Krise)! Bei Langzeittherapie (>3 Wochen, ≥5 mg/d) Stressdosierung perioperativ erwägen: kleine Eingriffe 25 mg Hydrocortison i.v., mittlere Eingriffe 50–75 mg/d, große Eingriffe 100–150 mg/d für 1–3 Tage. Rücksprache mit Endokrinologie.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },

  // ── Immunsuppressiva ────────────────────────────────────────────────────────
  {
    id: 'methotrexat',
    genericName: 'Methotrexat (MTX)',
    tradeNames: ['Metex', 'Lantarel', 'MTX-ratiopharm'],
    drugClass: 'Immunsuppressivum / Basistherapeutikum (DMARD)',
    urgency: 'caution',
    perioperativeManagement:
      'Bei rheumatologischer Indikation (RA, Psoriasis-Arthritis): Aktuelle Datenlage unterstützt Weiterführen bei stabiler Erkrankung (kein erhöhtes Infektions- oder Wundheilungsrisiko nachgewiesen, ESC 2022). Bei onkologischer Indikation (Hochdosis-MTX): Pausierung obligat — individuelle Planung. Folatsubstitution beachten.',
    renalNote: '⚠ Renale Elimination! Bei GFR <30: KONTRAINDIZIERT für wöchentliche Dauertherapie. Bei GFR 30–60: engmaschige Überwachung, Dosis reduzieren. MTX-Spiegel und Schleimhautschäden/Blutbild prüfen.',
  },
  {
    id: 'tacrolimus',
    genericName: 'Tacrolimus',
    tradeNames: ['Prograf', 'Advagraf', 'Modigraf'],
    drugClass: 'Calcineurin-Inhibitor (Immunsuppressivum)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Transplantations-Patienten: Talspiegel-Kontrolle perioperativ. Nephrotoxizität beachten — Hydrierung sicherstellen. Zahlreiche Arzneimittelinteraktionen (CYP3A4). Anästhesist und Transplantationsmedizin informieren.',
    renalNote: 'Nephrotoxisch! Engmaschige Kreatinin/GFR-Kontrollen perioperativ. Keine spezifische Dosisanpassung für Niereninsuffizienz selbst (Dosis nach Spiegel).',
  },
  {
    id: 'ciclosporin',
    genericName: 'Ciclosporin (Cyclosporin)',
    tradeNames: ['Sandimmun', 'Sandimmun Neoral'],
    drugClass: 'Calcineurin-Inhibitor (Immunsuppressivum)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Spiegel-Kontrolle. Nephrotoxizität, Hypertonie, zahlreiche Interaktionen (insb. mit NSAR, Aminoglykosiden). Anästhesist informieren.',
    renalNote: 'Nephrotoxisch! Perioperative Nierenwert-Überwachung obligat. NSAR kontraindiziert.',
  },

  // ── Schilddrüse ─────────────────────────────────────────────────────────────
  {
    id: 'levothyroxin',
    genericName: 'Levothyroxin (L-Thyroxin)',
    tradeNames: ['Euthyrox', 'L-Thyroxin Henning', 'Berlthyrox'],
    drugClass: 'Schilddrüsenhormon (Substitutionstherapie)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Auch am OP-Tag einnehmen (lange HWZ T4 ~7 Tage). Kurze perioperative Pause (1–2 Tage) ist vertretbar. Präoperativ: TSH und fT4 prüfen (gut eingestellt?). Hypo-/Hyperthyreose präoperativ ausschließen.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'carbimazol',
    genericName: 'Carbimazol',
    tradeNames: ['Carbimazol Henning'],
    drugClass: 'Thyreostatikum',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN (Hyperthyreose-Kontrolle aufrechterhalten). Agranulozytozose-Risiko: Blutbild präoperativ prüfen.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },

  // ── COPD / Asthma ───────────────────────────────────────────────────────────
  {
    id: 'tiotropium',
    genericName: 'Tiotropium',
    tradeNames: ['Spiriva', 'Braltus'],
    drugClass: 'Langwirksamer Muscarin-Antagonist (LAMA)',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN. Inhalation am OP-Morgen fortführen. Bronchodilatation sicherstellen.',
    renalNote: 'Bei GFR <50: Vorsicht (renale Elimination, Anticholinerge Nebenwirkungen erhöht).',
  },
  {
    id: 'salmeterol-fluticason',
    genericName: 'Salmeterol / Fluticason',
    tradeNames: ['Viani', 'Seretide', 'Airduo'],
    drugClass: 'LABA + ICS (Kombination)',
    urgency: 'continue',
    perioperativeManagement: 'WEITERFÜHREN. Inhalationstherapie perioperativ nicht unterbrechen.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },

  // ── Kardiale Spezialmedikamente ─────────────────────────────────────────────
  {
    id: 'sacubitril-valsartan',
    genericName: 'Sacubitril / Valsartan',
    tradeNames: ['Entresto'],
    drugClass: 'Angiotensin-Rezeptor-Neprilysin-Inhibitor (ARNI)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Indikation: Herzinsuffizienz mit reduzierter EF (HFrEF) <35 %. Abruptes Absetzen bei HFrEF kontraindiziert (analog zu ACE-Hemmern bei LV-Dysfunktion, C.1.4/C.1.5 DGAI 2024). Cave: Kombination mit RAAS-Aktivierung perioperativ → Hypotoniepotenzial. Anästhesist über Einnahme informieren. Postoperativ Nierenfunktion überwachen.',
    renalNote: 'Bei GFR <30: Startdosis 24/26 mg 2×/d, engmaschige Nierenwert-Kontrolle. Kontraindiziert bei GFR <15.',
  },
  {
    id: 'ivabradin',
    genericName: 'Ivabradin',
    tradeNames: ['Procoralan', 'Corlentor'],
    drugClass: 'If-Kanal-Inhibitor (negativ chronotrop)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN (C.1.5 DGAI 2024). Indikation: Herzinsuffizienz mit Sinustachykardie oder stabile Angina. Keine relevanten Wechselwirkungen mit Anästhetika. Cave: Bradykardie perioperativ möglich — EKG-Monitoring. Kein abruptes Absetzen bei laufender HF-Therapie.',
    renalNote: 'Keine Dosisanpassung erforderlich.',
  },
  {
    id: 'amiodaron',
    genericName: 'Amiodaron',
    tradeNames: ['Cordarone', 'Amiodaron-ratiopharm'],
    drugClass: 'Klasse-III-Antiarrhythmikum',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN. Extrem lange HWZ (40–55 Tage) — Absetzen präoperativ nicht sinnvoll. Cave: QTc-Verlängerung (Monitoring), bradykarde Reaktionen auf Anästhetika, Interaktion mit Vitamin-K-Antagonisten (INR-Erhöhung), Pneumonie-/Hepatotoxizitätsrisiko. Anästhesist informieren.',
    renalNote: 'Keine renale Dosisanpassung. Iod-Exposition durch Kontrastmittel vermeiden bzw. Schilddrüsenfunktion überwachen.',
  },
  {
    id: 'digoxin',
    genericName: 'Digoxin',
    tradeNames: ['Lanicor', 'Digoxin-ratiopharm'],
    drugClass: 'Herzglykosid',
    urgency: 'caution',
    perioperativeManagement:
      'Weiterführen bei gut eingestelltem Spiegel. Enge therapeutische Breite! Digoxinspiegel, Elektrolyte (K+, Mg++) präoperativ prüfen. Hypokaliämie → Glykosid-Toxizität. Perioperative EKG-Überwachung.',
    renalNote: '⚠ Renale Elimination! Bei GFR <30: Dosis halbieren, Talspiegel-Kontrolle. Bei GFR <10: alternative antiarrhythmische Therapie erwägen.',
  },

  // ── Anti-Parkinson ────────────────────────────────────────────────────────────
  {
    id: 'levodopa-carbidopa',
    genericName: 'Levodopa / Carbidopa',
    tradeNames: ['Sinemet', 'Nacom', 'Madopar (+ Benserazid)', 'Stalevo (+ Entacapon)'],
    drugClass: 'Dopaminpräkursor (Anti-Parkinson)',
    urgency: 'continue',
    perioperativeManagement:
      '⚠⚠ NIEMALS ABSETZEN — auch am OP-Tag unbedingt fortführen (E68 DGAI 2024)! Absetzen → Parkinson-Krise mit Muskelrigidität, Ateminsuffizienz, Schluckstörungen und akinetischer Krise (lebensbedrohlich). Einnahme bis kurz vor Nüchternheitsphase. Bei postoperativer NPO: sofortige Umstellung auf transdermales Rotigotin (Neupro) nach neurologischer Rücksprache — oder Magensonde perioperativ erwägen. Metoclopramid, Haloperidol und alle Dopamin-Antagonisten strikt KONTRAINDIZIERT.',
    renalNote: 'Keine spezifische Dosisanpassung bei Niereninsuffizienz erforderlich.',
  },
  {
    id: 'pramipexol',
    genericName: 'Pramipexol',
    tradeNames: ['Mirapexin', 'Sifrol', 'Pramipexol-ratiopharm'],
    drugClass: 'Dopaminagonist (Anti-Parkinson)',
    urgency: 'continue',
    perioperativeManagement:
      '⚠ WEITERFÜHREN — auch am OP-Tag (E68 DGAI 2024). Abruptes Absetzen kann Parkinson-Krise und Dopamin-Agonist-Entzugssyndrom (DAWS) auslösen. Bei postoperativer NPO: auf transdermales Rotigotin umstellen (Rücksprache Neurologie). Dopamin-Antagonisten (Metoclopramid, Domperidon, typische Neuroleptika) KONTRAINDIZIERT.',
    renalNote: 'Bei GFR <50: Dosisreduktion erforderlich (renale Elimination). GFR 20–50: 2×/d statt 3×/d.',
  },
  {
    id: 'ropinirol',
    genericName: 'Ropinirol',
    tradeNames: ['Requip', 'Adartrel', 'Ropinirol-ratiopharm'],
    drugClass: 'Dopaminagonist (Anti-Parkinson / Restless Legs)',
    urgency: 'continue',
    perioperativeManagement:
      '⚠ WEITERFÜHREN — auch am OP-Tag (E68 DGAI 2024). Wie Pramipexol: Absetzen → Parkinson-Krise. Bei NPO: transdermales Rotigotin erwägen. Dopamin-Antagonisten kontraindiziert.',
    renalNote: 'Bei GFR <30: Vorsicht, Dosis reduzieren.',
  },
  {
    id: 'rotigotin',
    genericName: 'Rotigotin',
    tradeNames: ['Neupro'],
    drugClass: 'Dopaminagonist transdermal (Anti-Parkinson)',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN — transdermales Pflaster auch perioperativ beibeheben (E68 DGAI 2024). Besonders geeignet für NPO-Phasen als Bridging bei Patienten unter oraler Parkinson-Therapie. Pflasterwechsel täglich zu fester Zeit. Dopamin-Antagonisten kontraindiziert.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },
  {
    id: 'amantadin',
    genericName: 'Amantadin',
    tradeNames: ['PK-Merz', 'Amantadin-ratiopharm'],
    drugClass: 'NMDA-Antagonist / Anti-Parkinson',
    urgency: 'continue',
    perioperativeManagement:
      'WEITERFÜHREN perioperativ (E68 DGAI 2024). Cave: renale Elimination — bei eingeschränkter Nierenfunktion Dosisanpassung und Toxizitätsmonitoring (Verwirrtheit, Halluzinationen). Bei NPO kann i.v. Amantadin (Amantadin-Infusionslösung) verabreicht werden.',
    renalNote: '⚠ Renale Elimination! Bei GFR 30–60: Dosishalbierung. Bei GFR <30: starke Dosisreduktion oder Absetzen nach neurologischer Rücksprache.',
  },

  // ── Bisphosphonate ──────────────────────────────────────────────────────────
  {
    id: 'alendronat',
    genericName: 'Alendronsäure',
    tradeNames: ['Fosamax', 'Alendron-ratiopharm'],
    drugClass: 'Bisphosphonat (Osteoporose)',
    urgency: 'pause',
    perioperativeManagement:
      'Präoperativ pausieren bei Eingriffen mit Knochenbeteiligung (insb. Kieferchirurgie, Osteotomien). Risiko: Medikamenten-assoziierte Osteonekrose des Kiefers (MRONJ) und atypische Femurfrakturen. Für allgemeinchirurgische Eingriffe: Weiterführen in der Regel unbedenklich. Zahnarztbehandlung vor OP abschließen.',
    renalNote: 'Kontraindiziert bei GFR <30 ml/min.',
  },

  // ── Urologika ───────────────────────────────────────────────────────────────
  {
    id: 'tamsulosin',
    genericName: 'Tamsulosin',
    tradeNames: ['Alna', 'Flomax', 'Tamsulosin-ratiopharm'],
    drugClass: 'Alpha-1-Blocker (BPH)',
    urgency: 'caution',
    perioperativeManagement:
      'Cave: Intraoperatives Floppy-Iris-Syndrom (IFIS) bei Kataraktoperation! Ophthalmologen präoperativ informieren. Für nicht-ophthalmologische Eingriffe: Weiterführen.',
    renalNote: 'Keine Dosisanpassung bei Niereninsuffizienz.',
  },

  // ── ADHS-Medikamente ─────────────────────────────────────────────────────────
  {
    id: 'lisdexamphetamin',
    genericName: 'Lisdexamphetamin',
    tradeNames: ['Elvanse', 'Vyvanse'],
    drugClass: 'ADHS-Medikament / Amphetamin-Derivat',
    urgency: 'pause',
    perioperativeManagement:
      'Am Operationstag pausieren. Amphetamine können sympathomimetische Effekte verstärken und mit Vasopressoren sowie Anästhetika interagieren (Hypertonie, Tachykardie). MAO-Hemmer kontraindiziert. Herz-Kreislauf-Monitoring perioperativ sicherstellen. Abruptes Absetzen kann Rebound-Erschöpfung und Dysphorie auslösen — kurze perioperative Pause in der Regel gut toleriert. Rücksprache mit verschreibendem Arzt bei Langzeittherapie.',
    renalNote: 'Bei GFR <30: Vorsicht, Dosis individuell anpassen (renale Elimination des aktiven Metaboliten Dexamphetamin).',
  },
  {
    id: 'methylphenidat',
    genericName: 'Methylphenidat',
    tradeNames: ['Ritalin', 'Ritalin LA', 'Medikinet', 'Medikinet adult', 'Concerta', 'Rubifen'],
    drugClass: 'ADHS-Medikament / Dopamin-/Noradrenalin-Wiederaufnahmehemmer',
    urgency: 'pause',
    perioperativeManagement:
      'Am Operationstag pausieren. Sympathomimetische Wirkung kann Vasopressoren-Bedarf verändern und Herzrate/Blutdruck erhöhen. MAO-Hemmer-Kombination kontraindiziert (hypertensive Krise). Anästhesist über Einnahme informieren. Kurze perioperative Pause in der Regel gut verträglich.',
    renalNote: 'Keine spezifische renale Dosisanpassung; bei fortgeschrittener Niereninsuffizienz Vorsicht.',
  },
  {
    id: 'atomoxetin',
    genericName: 'Atomoxetin',
    tradeNames: ['Strattera'],
    drugClass: 'ADHS-Medikament / Noradrenalin-Wiederaufnahmehemmer (NRI)',
    urgency: 'caution',
    perioperativeManagement:
      'Weiterführen oder am OP-Tag pausieren — individuelle Entscheidung. Kein Amphetamin-Derivat, daher geringeres Interaktionsrisiko als Methylphenidat/Lisdexamphetamin. Dennoch Noradrenalin-Reuptake-Hemmung: erhöhte Herzrate und Blutdruck möglich. Anästhesist informieren.',
    renalNote: 'Keine spezifische Dosisanpassung bei Niereninsuffizienz (vorwiegend hepatische Metabolisierung).',
  },

  // ── Weitere Antidepressiva ────────────────────────────────────────────────────
  {
    id: 'duloxetin',
    genericName: 'Duloxetin',
    tradeNames: ['Cymbalta', 'Duloxetin-ratiopharm'],
    drugClass: 'SNRI (Serotonin-Noradrenalin-Wiederaufnahmehemmer)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen. Ähnliches Profil wie Venlafaxin: erhöhtes Blutungsrisiko (Thrombozytenserotonin-Depletion), Blutdruckanstieg unter Stress. Abruptes Absetzen vermeiden (Absetzsyndrom). Serotoninsyndrom-Risiko bei Kombination mit Tramadol, Pethidin, Linezolid, Methylenblau.',
    renalNote: 'Bei GFR <30: kontraindiziert (Metaboliten-Akkumulation).',
  },
  {
    id: 'mirtazapin',
    genericName: 'Mirtazapin',
    tradeNames: ['Remergil', 'Mirtazapin-ratiopharm'],
    drugClass: 'Noradrenerges und spezifisch serotonerges Antidepressivum (NaSSA)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen. Sedierender Effekt beachten — kann Anästhetika-Bedarf reduzieren. Antiemetische Wirkung (5-HT3-Antagonismus) von Vorteil. Kein Absetzsyndrom bei kurzer Pause, aber Kontinuität bevorzugen. QTc-Verlängerung möglich.',
    renalNote: 'Bei GFR <30: Clearance reduziert, Dosis individuell anpassen.',
  },

  // ── Opioide ──────────────────────────────────────────────────────────────────
  {
    id: 'tramadol',
    genericName: 'Tramadol',
    tradeNames: ['Tramal', 'Tramadol-ratiopharm', 'Jutadol'],
    drugClass: 'Schwaches Opioid / Monoamin-Wiederaufnahmehemmer',
    urgency: 'caution',
    perioperativeManagement:
      '⚠ Serotoninsyndrom-Risiko bei Kombination mit SSRI, SNRI, MAO-Hemmern, TCA, Triptanen — Kombination vermeiden. Am OP-Tag individuell: bei chronischer Schmerztherapie Rücksprache mit Schmerzdienst. Krampfschwelle senkt bei Epilepsie. Perioperativ auf alternative Analgetika umstellen (z.B. Oxycodon, Morphin) wenn SSRI vorhanden.',
    renalNote: 'Bei GFR <30: Dosisreduktion und verlängertes Dosierungsintervall (renale Metaboliten-Akkumulation).',
  },
  {
    id: 'morphin',
    genericName: 'Morphin',
    tradeNames: ['MST Mundipharma', 'Sevredol', 'Morphin-ratiopharm', 'Capros'],
    drugClass: 'Starkes Opioid (µ-Rezeptor-Agonist)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen (Opioid-Dauertherapie nicht abrupt absetzen — Entzug und Hyperalgesie). Perioperativer Schmerzdienst einbinden. Äquianalgetische Umrechnung perioperativ beachten. Opioid-tolerante Patienten benötigen höhere Dosen — Schmerztherapie individuell anpassen. Bei parenteralem Regime: Umstellung auf i.v./s.c. Morphin.',
    renalNote: '⚠ Aktiver Metabolit Morphin-6-Glucuronid renal eliminiert! Bei GFR <30: starke Akkumulation möglich → Sedierung, Atemdepression. Dosisreduktion oder Wechsel auf Hydromorphon (sicherer bei Niereninsuffizienz).',
  },
  {
    id: 'oxycodon',
    genericName: 'Oxycodon',
    tradeNames: ['Oxygesic', 'Targin (+ Naloxon)', 'Oxycodon-ratiopharm'],
    drugClass: 'Starkes Opioid (µ-/κ-Rezeptor-Agonist)',
    urgency: 'continue',
    perioperativeManagement:
      'Weiterführen (Opioid-Dauertherapie). Perioperativen Schmerzdienst einbinden. Bei NPO: äquianalgetische Umstellung auf i.v.-Opioid. Opioid-tolerante Patienten haben erhöhten intra- und postoperativen Opioidbedarf.',
    renalNote: 'Bei GFR <30: Vorsicht (Metaboliten-Akkumulation, Sedierung). Dosisreduktion und engmaschiges Monitoring.',
  },

  // ── PDE-5-Hemmer ─────────────────────────────────────────────────────────────
  {
    id: 'sildenafil',
    genericName: 'Sildenafil',
    tradeNames: ['Viagra', 'Revatio', 'Sildenafil-ratiopharm'],
    drugClass: 'PDE-5-Hemmer',
    urgency: 'pause',
    perioperativeManagement:
      'Pausieren: 24 h vor OP. Kontraindiziert mit Nitraten (schwere Hypotonie). Bei pulmonaler Hypertonie (Revatio): Weiterführen — Absetzen kann zu akuter Dekompensation führen. Anästhesist informieren (Nitratzugabe kontraindiziert!).',
    renalNote: 'Bei GFR <30: Startdosis 25 mg (ED-Indikation). Revatio: keine Dosisanpassung.',
  },
]

// ── Suchfunktion ─────────────────────────────────────────────────────────────
export function searchMedications(query: string): Medication[] {
  const q = query.toLowerCase().trim()
  if (!q || q.length < 2) return []
  return MEDICATIONS.filter(
    (m) =>
      m.genericName.toLowerCase().includes(q) ||
      m.tradeNames.some((t) => t.toLowerCase().includes(q)) ||
      m.drugClass.toLowerCase().includes(q),
  )
}

export const URGENCY_LABELS: Record<Medication['urgency'], { label: string; color: string }> = {
  continue: { label: 'Weiterführen', color: 'bg-green-100 text-green-800 border-green-200' },
  pause: { label: 'Pausieren', color: 'bg-red-100 text-red-800 border-red-200' },
  reduce: { label: 'Dosis reduzieren', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  caution: { label: 'Individuell/Vorsicht', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
}
