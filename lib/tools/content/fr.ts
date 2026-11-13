import type { LocaleContent } from "./index";

const S = {
  jager: { label: "Jäger et al., position de l’ISSN : protéines et exercice (2017)", url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" },
  morton: { label: "Morton et al., suppléments de protéines et musculation (2018)", url: "https://pubmed.ncbi.nlm.nih.gov/28698222/" },
  efsa: { label: "EFSA, valeurs nutritionnelles de référence pour les protéines (2012)", url: "https://www.efsa.europa.eu/en/efsajournal/pub/2557" },
  mifflin: { label: "Mifflin et al., équation de prédiction de la dépense énergétique au repos (1990)", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/" },
};

export const fr: LocaleContent = {
  hub: {
    metaTitle: "Calculateurs fitness et nutrition gratuits",
    metaDescription: "Calculateurs gratuits pour les protéines, les calories (TDEE) et les macros. Obtenez vos objectifs quotidiens en quelques secondes selon votre poids, votre objectif et votre activité.",
    h1: "Calculateurs fitness et nutrition gratuits",
    intro: "Calculez vos besoins en protéines, en calories et en macros. Chaque calculateur explique sa formule et cite ses sources.",
    groupNutrition: "Nutrition",
  },
  tools: {
    protein: {
      cardTitle: "Calculateur de protéines",
      cardBlurb: "Vos besoins quotidiens en protéines selon votre objectif.",
      metaTitle: "Calculateur de protéines : combien de protéines par jour ?",
      metaDescription: "Calculateur de protéines gratuit. Indiquez votre poids, votre objectif et votre niveau d’activité pour obtenir vos besoins quotidiens en grammes, par repas et par kg.",
      h1: "Calculateur de protéines",
      answer: "La plupart des adultes actifs ont besoin de 1,6 à 2,2 g de protéines par kg de poids de corps et par jour pour construire ou conserver du muscle. Indiquez votre poids, votre objectif et votre niveau d’activité pour obtenir votre objectif quotidien.",
      formula: [
        "Protéines quotidiennes (g) = poids (kg) × grammes par kg.",
        "Le nombre de grammes par kg dépend de votre objectif et de votre niveau d’activité : de 0,8 g/kg pour un adulte sédentaire qui maintient son poids jusqu’à 2,4 g/kg pour une personne très active qui perd du gras. La fourchette affichée correspond à ±10 % de votre objectif.",
      ],
      tableTitle: "Protéines par kg selon l’objectif et l’activité",
      faq: [
        { q: "De combien de protéines ai-je besoin par jour ?", a: "La plupart des adultes en bonne santé se portent bien avec 1,2 à 2,2 g par kg de poids de corps, selon l’entraînement et l’objectif. Les personnes sédentaires peuvent rester près de 0,8 g/kg." },
        { q: "Faut-il plus de protéines en période de sèche ?", a: "En général, oui. Un apport plus élevé aide à préserver le muscle quand on mange moins de calories ; le calculateur relève donc l’objectif pour la perte de gras." },
        { q: "Plus de protéines, est-ce toujours mieux ?", a: "Non. Pour la plupart des gens, les gains musculaires plafonnent au-delà d’environ 2,2 g/kg. Aller bien au-delà coûte plus cher sans améliorer les résultats." },
        { q: "Comment répartir les protéines sur la journée ?", a: "Les répartir sur 3 à 5 repas est un moyen pratique d’atteindre votre total. La valeur par repas tient compte du nombre de repas choisi." },
        { q: "Un régime riche en protéines est-il sans danger ?", a: "Pour les adultes en bonne santé, des apports dans ces fourchettes sont généralement considérés comme sûrs. En cas de maladie rénale ou d’un autre problème de santé, demandez l’avis de votre médecin avant d’augmenter vos protéines." },
      ],
      sources: [S.jager, S.morton, S.efsa],
      updated: "2026-11-12",
    },
    tdee: {
      cardTitle: "Calculateur TDEE et calories",
      cardBlurb: "Calories de maintien, de perte de gras et de prise de muscle.",
      metaTitle: "Calculateur TDEE et calories : maintien, sèche et prise de masse",
      metaDescription: "Calculateur TDEE gratuit basé sur l’équation de Mifflin-St Jeor. Obtenez vos calories de maintien ainsi que vos objectifs de perte de gras et de prise de muscle.",
      h1: "Calculateur TDEE et calories",
      answer: "La dépense énergétique totale quotidienne (TDEE) est le nombre de calories que vous brûlez en une journée, exercice compris. Pour beaucoup d’adultes, elle se situe entre 1 800 et 3 000 kcal environ. Mangez à peu près ce chiffre pour maintenir votre poids, environ 20 % de moins pour perdre du gras ou environ 10 % de plus pour prendre du muscle.",
      formula: [
        "BMR (Mifflin-St Jeor) = 10 × poids (kg) + 6,25 × taille (cm) − 5 × âge + 5 pour les hommes, ou − 161 pour les femmes.",
        "TDEE = BMR × facteur d’activité (1,2 sédentaire, 1,375 léger, 1,55 modéré, 1,725 élevé). Calories de perte de gras = TDEE × 0,80, jamais sous votre BMR. Calories de prise de muscle = TDEE × 1,10.",
      ],
      tableTitle: "Facteurs d’activité",
      faq: [
        { q: "Qu’est-ce que le TDEE ?", a: "La dépense énergétique totale quotidienne est le nombre de calories que votre corps brûle en une journée : le métabolisme de repos (BMR) plus les déplacements et l’exercice." },
        { q: "Un calculateur TDEE est-il précis ?", a: "C’est une estimation, qui peut s’écarter de 10 % ou plus pour certaines personnes. Suivez votre poids pendant 2 à 3 semaines et ajustez de 100 à 200 kcal si besoin." },
        { q: "Combien de calories manger pour perdre du gras ?", a: "Un déficit modéré d’environ 15 à 20 % sous le TDEE est un point de départ courant. Ce calculateur retient 20 % et ne descend jamais sous votre BMR." },
        { q: "Combien de calories manger pour prendre du muscle ?", a: "Un léger surplus d’environ 5 à 10 % au-dessus du TDEE favorise la prise de muscle avec moins de gras. Ce calculateur retient 10 %." },
        { q: "Quel niveau d’activité choisir ?", a: "Choisissez le niveau qui correspond à votre semaine type, travail compris. Si vous hésitez entre deux niveaux, prenez le plus bas." },
      ],
      sources: [S.mifflin, S.jager],
      updated: "2026-11-12",
    },
    macro: {
      cardTitle: "Calculateur de macros",
      cardBlurb: "Calories, protéines, glucides et lipides par jour.",
      metaTitle: "Calculateur de macros : protéines, glucides et lipides par jour",
      metaDescription: "Calculateur de macros gratuit. Obtenez vos calories quotidiennes et vos grammes de protéines, glucides et lipides pour perdre du gras, prendre du muscle ou maintenir votre poids.",
      h1: "Calculateur de macros",
      answer: "Une répartition de départ courante pour les personnes actives : 1,6 à 2,2 g de protéines par kg, environ 25 % des calories en lipides et le reste en glucides. Indiquez vos informations pour obtenir vos calories quotidiennes et vos grammes de protéines, de glucides et de lipides.",
      formula: [
        "Calories = TDEE ajusté selon votre objectif (voir le calculateur TDEE). Protéines (g) = poids (kg) × grammes par kg selon l’objectif et le niveau d’activité.",
        "Lipides (g) = le plus grand de 0,8 g/kg et 25 % des calories ÷ 9. Glucides (g) = calories restantes ÷ 4. Protéines et glucides apportent 4 kcal par gramme, les lipides 9 kcal par gramme.",
      ],
      tableTitle: "Réglages selon l’objectif",
      faq: [
        { q: "Que sont les macros ?", a: "Les macros sont les protéines, les glucides et les lipides, les trois nutriments qui apportent des calories. Protéines et glucides fournissent 4 kcal par gramme, les lipides 9 kcal par gramme." },
        { q: "Comment mes macros sont-elles calculées ?", a: "Nous estimons vos calories quotidiennes (TDEE ajusté à votre objectif), fixons les protéines par kg de poids, les lipides à au moins 0,8 g/kg et 25 % des calories, puis complétons avec les glucides." },
        { q: "Dois-je atteindre mes macros à la perfection ?", a: "Non. Visez une valeur proche, surtout pour les protéines, et jugez les résultats sur plusieurs semaines plutôt que sur un seul jour." },
        { q: "Vaut-il mieux manger peu ou beaucoup de glucides ?", a: "Les deux fonctionnent si les calories et les protéines sont bonnes. Plus de glucides convient souvent aux entraînements intenses ; choisissez la répartition que vous pouvez tenir." },
        { q: "Puis-je l’utiliser avec un problème de santé ?", a: "Parlez d’abord à un médecin ou à un diététicien si vous êtes enceinte, si vous avez du diabète, une maladie rénale ou cardiaque, ou des antécédents de troubles alimentaires." },
      ],
      sources: [S.jager, S.mifflin, S.efsa],
      updated: "2026-11-12",
    },
  },
};
