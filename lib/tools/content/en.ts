import type { LocaleContent } from "./index";

const S = {
  jager: { label: "Jäger et al., ISSN position stand: protein and exercise (2017)", url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" },
  morton: { label: "Morton et al., protein supplementation and resistance training (2018)", url: "https://pubmed.ncbi.nlm.nih.gov/28698222/" },
  efsa: { label: "EFSA, Dietary Reference Values for protein (2012)", url: "https://www.efsa.europa.eu/en/efsajournal/pub/2557" },
  mifflin: { label: "Mifflin et al., predictive equation for resting energy expenditure (1990)", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/" },
};

export const en: LocaleContent = {
  hub: {
    metaTitle: "Free Fitness & Nutrition Calculators",
    metaDescription: "Free calculators for protein, calories (TDEE) and macros. Get your daily targets in seconds, based on your weight, goal and activity level.",
    h1: "Free Fitness & Nutrition Calculators",
    intro: "Work out how much protein, how many calories and which macros you need. Each calculator explains its formula and cites its sources.",
    groupNutrition: "Nutrition",
  },
  tools: {
    protein: {
      cardTitle: "Protein Intake Calculator",
      cardBlurb: "Daily grams of protein for your goal.",
      metaTitle: "Protein Intake Calculator: How Much Protein Per Day?",
      metaDescription: "Free protein calculator. Enter your weight, goal and activity level to get your daily protein target in grams, per meal and per kg.",
      h1: "Protein Intake Calculator",
      answer: "Most active adults need 1.6–2.2 g of protein per kg of body weight per day to build or keep muscle. Enter your weight, goal and activity level to get your own daily target.",
      formula: [
        "Daily protein (g) = body weight (kg) × grams per kg.",
        "The grams-per-kg value depends on your goal and activity level, from 0.8 g/kg for a sedentary adult maintaining weight up to 2.4 g/kg for a very active person losing fat. The range shown is ±10% of your target.",
      ],
      tableTitle: "Protein per kg by goal and activity",
      faq: [
        { q: "How much protein do I need per day?", a: "Most healthy adults do well with 1.2–2.2 g per kg of body weight, depending on training and goals. Sedentary adults can sit near the lower end, around 0.8 g/kg." },
        { q: "Do I need more protein when I’m cutting?", a: "Usually yes. A higher intake helps preserve muscle while you eat fewer calories, so the calculator raises the target for fat loss." },
        { q: "Is more protein always better?", a: "No. Muscle gains level off above roughly 2.2 g/kg for most people. Going far beyond that adds cost, not results." },
        { q: "How should I spread protein across the day?", a: "Splitting it over 3–5 meals is a practical way to reach your total. The per-meal figure uses the number of meals you choose." },
        { q: "Is a high-protein diet safe?", a: "For healthy adults, intakes within these ranges are generally considered safe. If you have kidney disease or another medical condition, ask your doctor before raising your protein." },
      ],
      sources: [S.jager, S.morton, S.efsa],
      updated: "2026-11-12",
    },
    tdee: {
      cardTitle: "TDEE & Calorie Calculator",
      cardBlurb: "Maintenance, fat-loss and muscle-gain calories.",
      metaTitle: "TDEE & Calorie Calculator: Maintenance, Cutting and Bulking",
      metaDescription: "Free TDEE calculator using the Mifflin–St Jeor equation. Get your maintenance calories plus fat-loss and muscle-gain targets.",
      h1: "TDEE & Calorie Calculator",
      answer: "Total daily energy expenditure (TDEE) is the number of calories you burn in a day, including exercise. For many adults it falls between about 1,800 and 3,000 kcal. Eat close to it to maintain weight, about 20% less to lose fat, or about 10% more to build muscle.",
      formula: [
        "BMR (Mifflin–St Jeor) = 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5 for men, or − 161 for women.",
        "TDEE = BMR × activity factor (1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 high). Fat-loss calories = TDEE × 0.80, never below your BMR. Muscle-gain calories = TDEE × 1.10.",
      ],
      tableTitle: "Activity factors",
      faq: [
        { q: "What is TDEE?", a: "Total daily energy expenditure is the number of calories your body burns in a day: resting metabolism (BMR) plus daily movement and exercise." },
        { q: "How accurate is a TDEE calculator?", a: "It is an estimate and can be off by 10% or more for some people. Track your weight for 2–3 weeks and adjust by 100–200 kcal if needed." },
        { q: "How many calories should I eat to lose fat?", a: "A moderate deficit of about 15–20% below TDEE is a common starting point. This calculator uses 20% and never goes below your BMR." },
        { q: "How many calories should I eat to build muscle?", a: "A small surplus of about 5–10% above TDEE supports muscle gain with less fat gain. This calculator uses 10%." },
        { q: "Which activity level should I choose?", a: "Pick the level that matches your typical week, including your job. If you are between two levels, choose the lower one." },
      ],
      sources: [S.mifflin, S.jager],
      updated: "2026-11-12",
    },
    macro: {
      cardTitle: "Macro Calculator",
      cardBlurb: "Daily calories, protein, carbs and fat.",
      metaTitle: "Macro Calculator: Protein, Carbs and Fat Per Day",
      metaDescription: "Free macro calculator. Get your daily calories and grams of protein, carbs and fat for fat loss, muscle gain or maintenance.",
      h1: "Macro Calculator",
      answer: "A common starting split for active people is 1.6–2.2 g of protein per kg, about 25% of calories from fat, and the rest from carbs. Enter your details to get your daily calories and grams of protein, carbs and fat.",
      formula: [
        "Calories = TDEE adjusted for your goal (see the TDEE calculator). Protein (g) = body weight (kg) × grams per kg for your goal and activity level.",
        "Fat (g) = the larger of 0.8 g/kg and 25% of calories ÷ 9. Carbs (g) = remaining calories ÷ 4. Protein and carbs give 4 kcal per gram, fat gives 9 kcal per gram.",
      ],
      tableTitle: "Goal settings",
      faq: [
        { q: "What are macros?", a: "Macros are protein, carbohydrates and fat, the three nutrients that supply calories. Protein and carbs provide 4 kcal per gram, fat provides 9 kcal per gram." },
        { q: "How are my macros calculated?", a: "We estimate your daily calories (TDEE adjusted for your goal), set protein per kg of body weight, set fat to at least 0.8 g/kg and 25% of calories, and fill the rest with carbs." },
        { q: "Do I need to hit my macros exactly?", a: "No. Aim to be close, especially on protein, and judge results over weeks rather than single days." },
        { q: "Should I eat low-carb or high-carb?", a: "Both can work when calories and protein are right. Higher carbs often suit heavy training; choose the split you can stick to." },
        { q: "Can I use this with a medical condition?", a: "Talk to a doctor or dietitian first if you are pregnant, have diabetes, a kidney or heart condition, or a history of disordered eating." },
      ],
      sources: [S.jager, S.mifflin, S.efsa],
      updated: "2026-11-12",
    },
  },
};
