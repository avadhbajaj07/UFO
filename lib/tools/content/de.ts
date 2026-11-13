import type { LocaleContent } from "./index";

const S = {
  jager: { label: "Jäger et al., ISSN-Positionspapier: Protein und Training (2017)", url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" },
  morton: { label: "Morton et al., Proteinzufuhr und Krafttraining (2018)", url: "https://pubmed.ncbi.nlm.nih.gov/28698222/" },
  efsa: { label: "EFSA, Referenzwerte für die Proteinzufuhr (2012)", url: "https://www.efsa.europa.eu/en/efsajournal/pub/2557" },
  mifflin: { label: "Mifflin et al., Gleichung zur Schätzung des Ruheenergieumsatzes (1990)", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/" },
};

export const de: LocaleContent = {
  hub: {
    metaTitle: "Kostenlose Fitness- und Ernährungsrechner",
    metaDescription: "Kostenlose Rechner für Eiweiss, Kalorien (TDEE) und Makros. Deine Tagesziele in Sekunden, basierend auf Gewicht, Ziel und Aktivität.",
    h1: "Kostenlose Fitness- und Ernährungsrechner",
    intro: "Finde heraus, wie viel Eiweiss, wie viele Kalorien und welche Makros du brauchst. Jeder Rechner erklärt seine Formel und nennt seine Quellen.",
    groupNutrition: "Ernährung",
  },
  tools: {
    protein: {
      cardTitle: "Proteinrechner",
      cardBlurb: "Dein tägliches Eiweiss in Gramm für dein Ziel.",
      metaTitle: "Proteinrechner: Wie viel Eiweiss pro Tag?",
      metaDescription: "Kostenloser Proteinrechner. Gib Gewicht, Ziel und Aktivität ein und erhalte dein tägliches Eiweissziel in Gramm, pro Mahlzeit und pro kg.",
      h1: "Proteinrechner",
      answer: "Die meisten aktiven Erwachsenen brauchen 1,6–2,2 g Eiweiss pro kg Körpergewicht und Tag, um Muskeln aufzubauen oder zu erhalten. Gib Gewicht, Ziel und Aktivität ein und erhalte dein persönliches Tagesziel.",
      formula: [
        "Tägliches Eiweiss (g) = Körpergewicht (kg) × Gramm pro kg.",
        "Der Wert in g/kg hängt von Ziel und Aktivität ab: von 0,8 g/kg für einen wenig aktiven Erwachsenen, der sein Gewicht hält, bis 2,4 g/kg für eine sehr aktive Person im Fettabbau. Der angezeigte Bereich entspricht ±10 % deines Ziels.",
      ],
      tableTitle: "Eiweiss pro kg nach Ziel und Aktivität",
      faq: [
        { q: "Wie viel Eiweiss brauche ich pro Tag?", a: "Die meisten gesunden Erwachsenen kommen je nach Training und Ziel mit 1,2–2,2 g pro kg Körpergewicht gut zurecht. Wenig aktive Personen liegen eher bei etwa 0,8 g/kg." },
        { q: "Brauche ich im Fettabbau mehr Eiweiss?", a: "In der Regel ja. Eine höhere Zufuhr hilft, Muskeln zu erhalten, wenn du weniger Kalorien isst. Der Rechner erhöht deshalb das Ziel für den Fettabbau." },
        { q: "Ist mehr Eiweiss immer besser?", a: "Nein. Für die meisten Menschen flacht der Muskelaufbau oberhalb von etwa 2,2 g/kg ab. Deutlich mehr kostet nur Geld und bringt keine besseren Ergebnisse." },
        { q: "Wie verteile ich das Eiweiss über den Tag?", a: "Die Verteilung auf 3–5 Mahlzeiten ist ein praktischer Weg, dein Tagesziel zu erreichen. Der Wert pro Mahlzeit richtet sich nach der gewählten Anzahl Mahlzeiten." },
        { q: "Ist eine eiweissreiche Ernährung sicher?", a: "Für gesunde Erwachsene gelten Mengen in diesen Bereichen allgemein als sicher. Bei Nierenerkrankungen oder anderen Beschwerden frage vor einer Erhöhung deine Ärztin oder deinen Arzt." },
      ],
      sources: [S.jager, S.morton, S.efsa],
      updated: "2026-11-12",
    },
    tdee: {
      cardTitle: "TDEE- und Kalorienrechner",
      cardBlurb: "Kalorien für Erhalt, Fettabbau und Muskelaufbau.",
      metaTitle: "TDEE- und Kalorienrechner: Erhalt, Diät und Aufbau",
      metaDescription: "Kostenloser TDEE-Rechner mit der Mifflin-St-Jeor-Gleichung. Erhalte deinen Kalorienbedarf sowie Ziele für Fettabbau und Muskelaufbau.",
      h1: "TDEE- und Kalorienrechner",
      answer: "Der tägliche Gesamtenergieumsatz (TDEE) ist die Zahl der Kalorien, die du an einem Tag verbrauchst, inklusive Training. Bei vielen Erwachsenen liegt er zwischen etwa 1800 und 3000 kcal. Iss ungefähr so viel, um dein Gewicht zu halten, etwa 20 % weniger für den Fettabbau oder etwa 10 % mehr für den Muskelaufbau.",
      formula: [
        "BMR (Mifflin-St Jeor) = 10 × Gewicht (kg) + 6,25 × Grösse (cm) − 5 × Alter + 5 für Männer, bzw. − 161 für Frauen.",
        "TDEE = BMR × Aktivitätsfaktor (1,2 sitzend, 1,375 leicht, 1,55 mittel, 1,725 hoch). Kalorien für den Fettabbau = TDEE × 0,80, nie unter dem BMR. Kalorien für den Muskelaufbau = TDEE × 1,10.",
      ],
      tableTitle: "Aktivitätsfaktoren",
      faq: [
        { q: "Was ist der TDEE?", a: "Der tägliche Gesamtenergieumsatz ist die Zahl der Kalorien, die dein Körper an einem Tag verbrennt: Grundumsatz (BMR) plus Alltagsbewegung und Training." },
        { q: "Wie genau ist ein TDEE-Rechner?", a: "Er liefert eine Schätzung, die bei manchen Menschen um 10 % oder mehr abweichen kann. Beobachte dein Gewicht 2–3 Wochen und passe bei Bedarf um 100–200 kcal an." },
        { q: "Wie viele Kalorien sollte ich für den Fettabbau essen?", a: "Ein moderates Defizit von etwa 15–20 % unter dem TDEE ist ein üblicher Startpunkt. Dieser Rechner nutzt 20 % und geht nie unter deinen BMR." },
        { q: "Wie viele Kalorien sollte ich für den Muskelaufbau essen?", a: "Ein kleiner Überschuss von etwa 5–10 % über dem TDEE unterstützt den Muskelaufbau bei weniger Fettzunahme. Dieser Rechner nutzt 10 %." },
        { q: "Welches Aktivitätslevel soll ich wählen?", a: "Wähle das Level, das deiner typischen Woche entspricht, inklusive Beruf. Liegst du zwischen zwei Stufen, nimm die niedrigere." },
      ],
      sources: [S.mifflin, S.jager],
      updated: "2026-11-12",
    },
    macro: {
      cardTitle: "Makrorechner",
      cardBlurb: "Kalorien, Eiweiss, Kohlenhydrate und Fett pro Tag.",
      metaTitle: "Makrorechner: Eiweiss, Kohlenhydrate und Fett pro Tag",
      metaDescription: "Kostenloser Makrorechner. Erhalte deine täglichen Kalorien und Gramm an Eiweiss, Kohlenhydraten und Fett für Fettabbau, Muskelaufbau oder Gewichtserhalt.",
      h1: "Makrorechner",
      answer: "Eine übliche Ausgangsverteilung für aktive Menschen: 1,6–2,2 g Eiweiss pro kg, etwa 25 % der Kalorien aus Fett und der Rest aus Kohlenhydraten. Gib deine Daten ein und erhalte deine täglichen Kalorien sowie Gramm an Eiweiss, Kohlenhydraten und Fett.",
      formula: [
        "Kalorien = TDEE, angepasst an dein Ziel (siehe TDEE-Rechner). Eiweiss (g) = Körpergewicht (kg) × Gramm pro kg für dein Ziel und Aktivitätslevel.",
        "Fett (g) = der grössere Wert aus 0,8 g/kg und 25 % der Kalorien ÷ 9. Kohlenhydrate (g) = restliche Kalorien ÷ 4. Eiweiss und Kohlenhydrate liefern 4 kcal pro Gramm, Fett 9 kcal pro Gramm.",
      ],
      tableTitle: "Einstellungen nach Ziel",
      faq: [
        { q: "Was sind Makros?", a: "Makros sind Eiweiss, Kohlenhydrate und Fett, die drei Nährstoffe, die Kalorien liefern. Eiweiss und Kohlenhydrate liefern 4 kcal pro Gramm, Fett 9 kcal pro Gramm." },
        { q: "Wie werden meine Makros berechnet?", a: "Wir schätzen deine täglichen Kalorien (TDEE, an dein Ziel angepasst), legen Eiweiss pro kg Körpergewicht fest, setzen Fett auf mindestens 0,8 g/kg und 25 % der Kalorien und füllen den Rest mit Kohlenhydraten." },
        { q: "Muss ich meine Makros exakt treffen?", a: "Nein. Bleib nahe dran, vor allem beim Eiweiss, und beurteile Ergebnisse über Wochen statt über einzelne Tage." },
        { q: "Soll ich wenig oder viele Kohlenhydrate essen?", a: "Beides kann funktionieren, wenn Kalorien und Eiweiss stimmen. Mehr Kohlenhydrate passen oft zu hartem Training; wähle die Aufteilung, die du durchhältst." },
        { q: "Kann ich das bei einer Erkrankung nutzen?", a: "Sprich zuerst mit einer Ärztin, einem Arzt oder einer Ernährungsberatung, wenn du schwanger bist, Diabetes, eine Nieren- oder Herzerkrankung oder eine Vorgeschichte mit Essstörungen hast." },
      ],
      sources: [S.jager, S.mifflin, S.efsa],
      updated: "2026-11-12",
    },
  },
};
