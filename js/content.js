/* Resume data: work experience, education, projects, skills, and 
navigation labels. Start here when updating content. */

const AXIS_START = 2017.3,
  AXIS_END = 2028.8;

const TICKS = [2018, 2020, 2022, 2024, 2026, 2028];

const TIMELINE = [{
  id: "e-stats",
  row: "school",
  short: "UBC — Statistics & Economics",
  start: 2017.67,
  end: 2021.42
}, {
  id: "e-bcs",
  row: "school",
  short: "UBC — Computer Science",
  start: 2025.0,
  end: 2028.5
}, {
  id: "w-hsbc",
  row: "work",
  short: "HSBC",
  full: "HSBC — Credit Risk Analyst",
  start: 2022.17,
  end: 2024.17
}, {
  id: "w-rbc",
  row: "work",
  alt: true,
  short: "RBC",
  full: "RBC — Credit Risk Manager",
  start: 2024.17,
  end: 2025.08
}];

const JOBS = [{
  id: "w-rbc",
  role: "Credit Risk Manager",
  org: "RBC, Vancouver",
  dates: "March 2024 – January 2025",
  bullets: ["Supported the build of a new data environment for risk modelling, running ETL to bring multiple source systems into unified tables.", "Investigated data issues in Python, validated results and ran quality checks to keep the modelling data accurate and consistent.", "Worked mainly on the data engineering side, focused on understanding what the data actually represented before it reached the models."]
}, {
  id: "w-hsbc",
  role: "Credit Risk Analyst",
  org: "HSBC, Vancouver",
  dates: "March 2022 – March 2024",
  bullets: ["Monitored daily portfolios for first- and third-party fraud, using transaction features and key risk metrics to surface unusual activity.", "Automated data quality and reconciliation checks in Python (Pandas, NumPy, DataComPy), replacing parts of a manual review process.", "Built and maintained recurring Qlik Sense reporting for unsecured products, including the underlying data logic and calculations.", "Prepared monthly Credit Risk Operational Loss reports and filed Unusual Activity Reports as part of the fraud review process.", "Supported a large enterprise data migration: reviewed migration logs, reproduced issues, found root causes and documented fixes.", "Worked across Business, Risk & Compliance, IT and Data Science to align data sources and document metric definitions."]
}];

const EDU = [{
  id: "e-bcs",
  degree: "Bachelor of Computer Science",
  org: "University of British Columbia",
  dates: "January 2025 – June 2028",
  note: "Second-degree program. Software construction, algorithms and data structures, applied machine learning, human-computer interaction, cognitive science."
}, {
  id: "e-stats",
  degree: "B.Sc., Statistics and Economics",
  org: "University of British Columbia",
  dates: "September 2017 – May 2021",
  note: "Graduated with Distinction, 3.95 GPA. Econometrics, time series and forecasting, statistical inference, design of experiments, sample surveys."
}];

const POLICIES = [{
  id: "default",
  label: "Industry default",
  thr: "0.500",
  recall: 0.36,
  precision: 0.70,
  flagged: 0.10,
  note: "At a 0.5 cutoff the model catches only about a third of the customers who later default. Since just 22% of the dataset defaults, 0.5 is not automatically a useful business threshold."
}, {
  id: "f1",
  label: "Max macro F1",
  thr: "0.330",
  recall: 0.54,
  precision: 0.56,
  flagged: 0.21,
  note: "The best macro F1 score, but F1 still treats every customer the same. A small missed balance and a large missed balance count equally."
}, {
  id: "recall",
  label: "Recall floor",
  thr: "0.185",
  recall: 0.70,
  precision: 0.42,
  flagged: 0.33,
  note: "The highest-precision threshold that still catches at least 70% of defaulters — set by a business constraint rather than by maximising a metric."
}, {
  id: "cost",
  label: "Cost-optimal",
  thr: "0.080",
  recall: 0.96,
  precision: 0.27,
  flagged: 0.79,
  note: "Minimises expected loss using each customer's actual balance, cutting it from NT$135.6M to NT$37.3M (−72.5%). But it would also decline 5,210 of the 7,009 customers who never defaulted, which is not practical."
}];

const PROJECTS = [{
  id: "credit",
  name: "Credit card default prediction",
  kind: "Machine learning · Python",
  question: "Can six months of billing history predict who will miss their next payment — and how should a lender actually use that prediction?",
  figures: [{
    n: "0.789",
    l: "Test ROC-AUC [0.778, 0.801]"
  }, {
    n: "0.575",
    l: "Test average precision"
  }, {
    n: "30,000",
    l: "Customers, six months each"
  }],
  bullets: ["Built a delinquency-recency feature that ranked first in both SHAP (0.385 mean |SHAP|) and permutation importance (0.116) — roughly three times the next feature. How recently someone missed a payment beat how often they missed one.", "Selected models on average precision rather than accuracy or F1, because only 22% of customers defaulted and accuracy flatters a model that predicts no default for everyone.", "Compared models with a Nadeau–Bengio corrected paired t-test over 15 folds. Tuned LightGBM improved average precision over logistic regression by 0.042 (p < 0.001).", "Checked calibration before using the probabilities in the cost analysis: mean predicted probability 0.2212 against an observed default rate of 0.2212.", "Removed sex and marital status and re-measured — cross-validated average precision was unchanged to three decimals. Dropping protected attributes does not by itself rule out proxy effects, so outcomes were checked too."],
  pull: "Under different loss and margin assumptions the best threshold moves between 0.02 and 0.33. The threshold depends so heavily on real business costs that a sensitivity table is more honest than presenting one cutoff as the answer.",
  pullWho: "Section 12 — threshold and cost analysis",
  tags: ["Python", "LightGBM", "scikit-learn", "SHAP", "Pandas", "Jupyter"],
  links: [{
    label: "Read the notebook on GitHub",
    href: "https://github.com/MMM1122/Credit-Default-Prediction"
  }]
}, {
  id: "shop",
  name: "Zhuanzhuan Shop",
  kind: "Storefront · live",
  question: "A bilingual online shop for handmade ceramic spinners — designed, built and run by me, from product photos to checkout.",
  figures: [{
    n: "24",
    l: "Pieces across seven series"
  }, {
    n: "2",
    l: "Languages, switchable mid-visit"
  }, {
    n: "1",
    l: "HTML file, photos included"
  }],
  bullets: ["Every order gets a unique ID, and the site generates a copyable e-Transfer memo with that ID, the items and contact details, so incoming payments match orders without manual guesswork.", "Takes a five-dollar Interac e-Transfer deposit instead of full card payment, which confirms the order before pickup without ever handling card data.", "Runs English and Chinese from one shared translation dictionary rather than two pages, detects browser language on load and switches without a reload.", "Ships as a single self-contained HTML file, product photos included — no build step, no external asset hosting."],
  tags: ["Single-file HTML", "Vanilla JavaScript", "Bilingual i18n", "GitHub Pages"],
  links: [{
    label: "Visit the shop",
    href: "https://mmm1122.github.io/zhuanzhuanshop"
  }, {
    label: "Source on GitHub",
    href: "https://github.com/MMM1122/zhuanzhuanshop"
  }]
}, {
  id: "perler",
  name: "CyberPerler",
  kind: "Browser tool · live",
  question: "Upload a photo, turn it into a Perler bead pattern, then keep editing the result by hand.",
  figures: [{
    n: "58",
    l: "Bead colours, matched in CIELAB"
  }, {
    n: "6",
    l: "Board sizes, 14×14 to 87×87"
  }, {
    n: "7,569",
    l: "Beads on the largest board"
  }],
  bullets: ["Matches colours in CIELAB rather than RGB so nearest-colour matching follows human perception; palette conversions are cached once and reused.", "Offers adjustable Floyd–Steinberg dithering, which can be dialled down for small patterns where it adds noise instead of accuracy.", "Caps the number of colours per pattern, making designs easier to build and cheaper to buy beads for.", "Generates a shopping list with the bead count per colour and the number of 1,000-bead packs needed, and exports the grid as an upscaled PNG with smoothing off."],
  pull: "On-screen hex values are approximations rather than official Perler swatch data, so physical colours should be checked before ordering beads.",
  pullWho: "Note shown in the palette panel",
  tags: ["Single-file HTML", "Vanilla JavaScript", "Canvas API", "CIELAB colour matching", "Floyd–Steinberg dithering"],
  links: [{
    label: "Try it",
    href: "https://mmm1122.github.io/CyberPerler/"
  }, {
    label: "Source on GitHub",
    href: "https://github.com/MMM1122/CyberPerler"
  }]
}];

const SKILLS = [{
  title: "Languages",
  items: ["Python", "SQL", "Java", "JavaScript", "R", "C++", "SAS", "MATLAB", "HTML & CSS"]
}, {
  title: "Data & cloud",
  items: ["ETL pipelines", "BigQuery / GCP", "Data modelling", "Relational databases", "Large multi-source datasets"]
}, {
  title: "Modelling & analytics",
  items: ["scikit-learn", "LightGBM", "SHAP", "Pandas", "NumPy", "Statistical inference", "Time series & forecasting", "Model calibration"]
}, {
  title: "Reporting & quality",
  items: ["Qlik Sense", "Power BI", "Tableau", "Advanced Excel", "Validation & reconciliation", "UAT", "Root cause analysis", "Git"]
}];

const NAV_BASE = [["experience", "Experience"], ["projects", "Projects"], ["skills", "Skills"], ["about", "About"], ["contact", "Contact"], ["little-pause", "Easter Egg"]];

const DEMO_ENTRIES = [{
  name: "Priya",
  message: "Found this through your CyberPerler repo — the CIELAB write-up is a great read.",
  date: "2026-08-30T18:20:00Z"
}, {
  name: "Daniel",
  message: "The threshold explorer is the clearest explanation of precision/recall trade-offs I have seen on a portfolio.",
  date: "2026-08-27T09:05:00Z"
}, {
  name: "Mei",
  message: "Hello from the Hanfu society! Good luck with the co-op search.",
  date: "2026-08-24T02:40:00Z"
}];
