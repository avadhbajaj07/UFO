import type { Locale } from "./config";

export type UI = {
  weight: string; height: string; age: string; sex: string; male: string; female: string;
  goal: string; activity: string; meals: string;
  goals: Record<"maintain" | "gain" | "loss", { n: string; d: string }>;
  acts: { n: string; d: string }[];
  years: string; cm: string;
  yourProtein: string; gPerDay: string; range: string; gPerKg: string; gPerMeal: string; scoops: string;
  yourCalories: string; kcalDay: string; maintenance: string; cutting: string; bulking: string; bmr: string;
  protein: string; carbs: string; fat: string; g: string; floorNote: string;
  emailTitle: string; emailText: string; emailPlaceholder: string; emailCta: string; consent: string;
  sending: string; sent: string; emailError: string;
  suggested: string; view: string;
  home: string; tools: string; related: string; faq: string; howCalc: string;
  lastUpdated: string; reviewedBy: string; sources: string; disclaimer: string;
  multiplier: string; description: string; calAdjust: string; proteinPerKg: string; fatRule: string;
  enterWeight: string;
  // New keys for 7 new calculators
  waist: string; neck: string; hip: string;
  reps: string; liftWeight: string;
  bfPct: string;
  loadingPhase: string; maintenancePhase: string; noLoadingPhase: string;
  yourBmi: string; bmiCategory: string;
  yourBodyFat: string; yourLbm: string; fatMass: string;
  your1rm: string; kg: string;
  yourWater: string; litresDay: string; glassesDay: string;
  yourDeficit: string; kcalDeficit: string; targetCalories: string;
  yourCreatine: string; gPerDayCr: string; perDose: string; doses: string;
  phase: string; lossRate: string; kgPerWeek: string;
  weeksTo5kg: string; tdeeLabel: string;
  underweight: string; normal: string; overweight: string; obese: string;
  essential: string; athlete: string; fitness: string; average: string;
  pct: string; liftWeightKg: string;
};

export const UI_STRINGS: Record<Locale, UI> = {
  en: {
    weight: "Body weight", height: "Height", age: "Age", sex: "Sex", male: "Male", female: "Female",
    goal: "Your goal", activity: "Activity level", meals: "Meals per day",
    goals: {
      maintain: { n: "Maintain weight", d: "stay as you are" },
      gain: { n: "Build muscle", d: "gain size and strength" },
      loss: { n: "Lose fat", d: "keep muscle in a deficit" },
    },
    acts: [
      { n: "Mostly sedentary", d: "Desk job, little exercise" },
      { n: "Light", d: "1–2 workouts a week" },
      { n: "Moderate", d: "3–4 workouts a week" },
      { n: "High", d: "5+ workouts a week" },
    ],
    years: "years", cm: "cm",
    yourProtein: "Your daily protein target", gPerDay: "g / day", range: "Healthy range",
    gPerKg: "g per kg", gPerMeal: "g per meal ({n} meals)", scoops: "scoops if all from whey",
    yourCalories: "Your daily calories", kcalDay: "kcal / day", maintenance: "Maintenance",
    cutting: "Fat loss", bulking: "Muscle gain", bmr: "Basal metabolic rate (BMR)",
    protein: "Protein", carbs: "Carbs", fat: "Fat", g: "g",
    floorNote: "Calories are never set below your BMR.",
    emailTitle: "Want this as a plan?", emailText: "We'll email your result and a simple meal split.",
    emailPlaceholder: "you@example.com", emailCta: "Email me my plan",
    consent: "I agree to receive this email and nutrition tips. I can unsubscribe at any time.",
    sending: "Sending…", sent: "Sent. Check your inbox.", emailError: "Could not send. Please try again in a moment.",
    suggested: "Suggested for your goal", view: "View",
    home: "Home", tools: "Tools", related: "Related tools", faq: "Frequently asked questions",
    howCalc: "How it's calculated", lastUpdated: "Last updated", reviewedBy: "Reviewed by", sources: "Sources",
    disclaimer: "General information only, not medical advice. Speak to a health professional before changing your diet if you have a medical condition.",
    multiplier: "Multiplier", description: "Description", calAdjust: "Calorie adjustment",
    proteinPerKg: "Protein (g/kg)", fatRule: "at least 0.8 g/kg and 25% of calories",
    enterWeight: "Enter your weight to see your result.",
    waist: "Waist", neck: "Neck", hip: "Hip (women only)",
    reps: "Reps completed", liftWeight: "Weight lifted",
    bfPct: "Body fat %",
    loadingPhase: "Loading phase", maintenancePhase: "Maintenance", noLoadingPhase: "Skip loading",
    yourBmi: "Your BMI", bmiCategory: "Category",
    yourBodyFat: "Your body fat", yourLbm: "Your lean body mass", fatMass: "Fat mass",
    your1rm: "Estimated 1RM", kg: "kg",
    yourWater: "Your daily water target", litresDay: "litres / day", glassesDay: "glasses / day",
    yourDeficit: "Your daily deficit", kcalDeficit: "kcal deficit / day", targetCalories: "Target calories",
    yourCreatine: "Your daily creatine", gPerDayCr: "g / day", perDose: "per dose", doses: "doses",
    phase: "Protocol", lossRate: "Target loss rate", kgPerWeek: "kg / week",
    weeksTo5kg: "Weeks to lose 5 kg", tdeeLabel: "Your TDEE (kcal/day)",
    underweight: "Underweight", normal: "Normal weight", overweight: "Overweight", obese: "Obese",
    essential: "Essential fat", athlete: "Athlete", fitness: "Fitness", average: "Average",
    pct: "%", liftWeightKg: "Weight lifted (kg)",
  },
  fr: {
    weight: "Poids", height: "Taille", age: "Âge", sex: "Sexe", male: "Homme", female: "Femme",
    goal: "Votre objectif", activity: "Niveau d'activité", meals: "Repas par jour",
    goals: {
      maintain: { n: "Maintenir mon poids", d: "rester comme je suis" },
      gain: { n: "Prendre du muscle", d: "gagner en masse et en force" },
      loss: { n: "Perdre du gras", d: "garder le muscle en déficit" },
    },
    acts: [
      { n: "Plutôt sédentaire", d: "Travail de bureau, peu de sport" },
      { n: "Légère", d: "1 à 2 séances par semaine" },
      { n: "Modérée", d: "3 à 4 séances par semaine" },
      { n: "Élevée", d: "5 séances ou plus par semaine" },
    ],
    years: "ans", cm: "cm",
    yourProtein: "Votre objectif quotidien en protéines", gPerDay: "g / jour", range: "Fourchette conseillée",
    gPerKg: "g par kg", gPerMeal: "g par repas ({n} repas)", scoops: "doses si tout vient de la whey",
    yourCalories: "Vos calories quotidiennes", kcalDay: "kcal / jour", maintenance: "Maintien",
    cutting: "Perte de gras", bulking: "Prise de muscle", bmr: "Métabolisme de base (BMR)",
    protein: "Protéines", carbs: "Glucides", fat: "Lipides", g: "g",
    floorNote: "Les calories ne descendent jamais sous votre BMR.",
    emailTitle: "Envie d'un plan ?", emailText: "Nous vous envoyons votre résultat et une répartition simple des repas.",
    emailPlaceholder: "vous@exemple.ch", emailCta: "Envoyer mon plan",
    consent: "J'accepte de recevoir cet e-mail et des conseils nutrition. Désinscription possible à tout moment.",
    sending: "Envoi…", sent: "C'est envoyé. Vérifiez votre boîte de réception.", emailError: "Échec de l'envoi. Réessayez dans un instant.",
    suggested: "Suggestion pour votre objectif", view: "Voir",
    home: "Accueil", tools: "Outils", related: "Outils associés", faq: "Questions fréquentes",
    howCalc: "Comment c'est calculé", lastUpdated: "Mis à jour", reviewedBy: "Relu par", sources: "Sources",
    disclaimer: "Informations générales, elles ne remplacent pas un avis médical. Consultez un professionnel de santé avant de modifier votre alimentation si vous avez un problème de santé.",
    multiplier: "Multiplicateur", description: "Description", calAdjust: "Ajustement calorique",
    proteinPerKg: "Protéines (g/kg)", fatRule: "au moins 0,8 g/kg et 25 % des calories",
    enterWeight: "Entrez votre poids pour voir votre résultat.",
    waist: "Tour de taille", neck: "Tour de cou", hip: "Tour de hanches (femmes)",
    reps: "Répétitions effectuées", liftWeight: "Poids soulevé",
    bfPct: "% de masse graisseuse",
    loadingPhase: "Phase de charge", maintenancePhase: "Maintien", noLoadingPhase: "Sans charge",
    yourBmi: "Votre IMC", bmiCategory: "Catégorie",
    yourBodyFat: "Votre masse graisseuse", yourLbm: "Votre masse maigre", fatMass: "Masse graisseuse",
    your1rm: "1RM estimé", kg: "kg",
    yourWater: "Votre objectif eau quotidien", litresDay: "litres / jour", glassesDay: "verres / jour",
    yourDeficit: "Votre déficit quotidien", kcalDeficit: "kcal déficit / jour", targetCalories: "Calories cibles",
    yourCreatine: "Votre créatine quotidienne", gPerDayCr: "g / jour", perDose: "par dose", doses: "doses",
    phase: "Protocole", lossRate: "Taux de perte cible", kgPerWeek: "kg / semaine",
    weeksTo5kg: "Semaines pour perdre 5 kg", tdeeLabel: "Votre TDEE (kcal/jour)",
    underweight: "Insuffisance pondérale", normal: "Poids normal", overweight: "Surpoids", obese: "Obésité",
    essential: "Graisse essentielle", athlete: "Athlète", fitness: "Fitness", average: "Moyen",
    pct: "%", liftWeightKg: "Poids soulevé (kg)",
  },
  de: {
    weight: "Gewicht", height: "Grösse", age: "Alter", sex: "Geschlecht", male: "Männlich", female: "Weiblich",
    goal: "Dein Ziel", activity: "Aktivitätslevel", meals: "Mahlzeiten pro Tag",
    goals: {
      maintain: { n: "Gewicht halten", d: "so bleiben, wie ich bin" },
      gain: { n: "Muskeln aufbauen", d: "mehr Masse und Kraft" },
      loss: { n: "Fett verlieren", d: "Muskeln im Defizit erhalten" },
    },
    acts: [
      { n: "Überwiegend sitzend", d: "Bürojob, wenig Sport" },
      { n: "Leicht", d: "1–2 Trainings pro Woche" },
      { n: "Mittel", d: "3–4 Trainings pro Woche" },
      { n: "Hoch", d: "5+ Trainings pro Woche" },
    ],
    years: "Jahre", cm: "cm",
    yourProtein: "Dein tägliches Proteinziel", gPerDay: "g / Tag", range: "Empfohlener Bereich",
    gPerKg: "g pro kg", gPerMeal: "g pro Mahlzeit ({n} Mahlzeiten)", scoops: "Portionen, wenn alles aus Whey kommt",
    yourCalories: "Deine täglichen Kalorien", kcalDay: "kcal / Tag", maintenance: "Erhalt",
    cutting: "Fettabbau", bulking: "Muskelaufbau", bmr: "Grundumsatz (BMR)",
    protein: "Eiweiss", carbs: "Kohlenhydrate", fat: "Fett", g: "g",
    floorNote: "Die Kalorien liegen nie unter deinem Grundumsatz.",
    emailTitle: "Lieber als Plan?", emailText: "Wir senden dir dein Ergebnis und eine einfache Aufteilung der Mahlzeiten.",
    emailPlaceholder: "du@beispiel.ch", emailCta: "Plan senden",
    consent: "Ich bin einverstanden, diese E-Mail und Ernährungstipps zu erhalten. Abmeldung jederzeit möglich.",
    sending: "Wird gesendet…", sent: "Gesendet. Bitte prüfe dein Postfach.", emailError: "Senden fehlgeschlagen. Bitte versuche es gleich noch einmal.",
    suggested: "Passend zu deinem Ziel", view: "Ansehen",
    home: "Startseite", tools: "Tools", related: "Ähnliche Tools", faq: "Häufige Fragen",
    howCalc: "So wird berechnet", lastUpdated: "Aktualisiert", reviewedBy: "Geprüft von", sources: "Quellen",
    disclaimer: "Allgemeine Informationen, kein Ersatz für medizinischen Rat. Sprich mit einer Fachperson, bevor du deine Ernährung änderst, wenn du gesundheitliche Probleme hast.",
    multiplier: "Faktor", description: "Beschreibung", calAdjust: "Kalorienanpassung",
    proteinPerKg: "Eiweiss (g/kg)", fatRule: "mindestens 0,8 g/kg und 25 % der Kalorien",
    enterWeight: "Gib dein Gewicht ein, um dein Ergebnis zu sehen.",
    waist: "Taillenumfang", neck: "Halsumfang", hip: "Hüftumfang (Frauen)",
    reps: "Absolvierte Wiederholungen", liftWeight: "Gehobenes Gewicht",
    bfPct: "Körperfett %",
    loadingPhase: "Ladephase", maintenancePhase: "Erhaltung", noLoadingPhase: "Ohne Laden",
    yourBmi: "Dein BMI", bmiCategory: "Kategorie",
    yourBodyFat: "Dein Körperfett", yourLbm: "Deine Magermasse", fatMass: "Fettmasse",
    your1rm: "Geschätztes 1RM", kg: "kg",
    yourWater: "Dein tägliches Wasserziel", litresDay: "Liter / Tag", glassesDay: "Gläser / Tag",
    yourDeficit: "Dein tägliches Defizit", kcalDeficit: "kcal Defizit / Tag", targetCalories: "Zielkalorien",
    yourCreatine: "Dein tägliches Kreatin", gPerDayCr: "g / Tag", perDose: "pro Dosis", doses: "Dosen",
    phase: "Protokoll", lossRate: "Ziel-Abnehmtempo", kgPerWeek: "kg / Woche",
    weeksTo5kg: "Wochen um 5 kg zu verlieren", tdeeLabel: "Dein TDEE (kcal/Tag)",
    underweight: "Untergewicht", normal: "Normalgewicht", overweight: "Übergewicht", obese: "Adipositas",
    essential: "Essenzielles Fett", athlete: "Athlet", fitness: "Fitness", average: "Durchschnitt",
    pct: "%", liftWeightKg: "Gehobenes Gewicht (kg)",
  },
};
