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

const PROJECTS = [
  {
    "id": "paw",
    "name": "PAW — Public Art Walk",
    "kind": "BCS Hackathon 2026",
    "featured": true,
    "award": "Best Beginner Project Winner",
    "question": "Turn an ordinary walk through Vancouver into a public art discovery: explore the map, follow a themed tour, and listen to the stories behind each artwork.",
    "figures": [
      {
        "n": "138",
        "l": "Downtown artworks in the core collection"
      },
      {
        "n": "2",
        "l": "Curated walking tours"
      },
      {
        "n": "22",
        "l": "Vancouver neighbourhoods to explore"
      }
    ],
    "bullets": [
      "Built with React, TypeScript and Leaflet, using the City of Vancouver Public Art Registry to connect artwork locations, artist profiles and source-linked stories.",
      "Added themed walking tours with ordered stops, progress tracking and observation challenges grounded in the artwork records.",
      "Used the Web Speech API for audio narration with sentence highlighting, playback speed controls and text that visitors can follow while listening.",
      "Extended the project with saved art collections and custom walks. Profiles, collections and visited stops persist in the current browser."
    ],
    "pull": "Route and accessibility preferences are planning aids; the available map and registry data do not establish that a route is step-free. Personal collections stay in the current browser.",
    "pullWho": "Data and prototype limits",
    "tags": [
      "React",
      "TypeScript",
      "Leaflet",
      "Vancouver open data",
      "Web Speech API"
    ],
    "links": [
      {
        "label": "View the winning project",
        "href": "https://devpost.com/software/paw-public-art-walk"
      },
      {
        "label": "Source on GitHub",
        "href": "https://github.com/MMM1122/BCS_HACKTHON_2026"
      }
    ]
  },
  {
    "id": "color-fingerprint",
    "name": "Color Fingerprint",
    "kind": "Music & perception · live",
    "question": "What colours do you hear? Map your own sound-to-colour associations, then watch music unfold through your personal palette.",
    "figures": [
      {
        "n": "60",
        "l": "Sound-to-colour calibration trials"
      },
      {
        "n": "4",
        "l": "Timbres across five notes"
      },
      {
        "n": "4",
        "l": "Music visualization styles"
      }
    ],
    "bullets": [
      "Designed a randomized calibration using piano, pure tone, bowed strings and voice, with repeated trials to explore the consistency of each listener's colour choices.",
      "Mapped pitch and timbre to personal colour anchors using perceptual colour spaces, then rendered fireworks, water drops, geometry and soft glow with Three.js.",
      "Connected Web Audio analysis to built-in music, uploaded tracks and microphone input. Audio, microphone and camera data stay on the device.",
      "Added retest comparisons, JSON backup and palette share cards, plus optional Supabase accounts for syncing calibration results across devices."
    ],
    "pull": "An exploration of personal associations, not a diagnostic test for synesthesia. Instrument matching in mixed music is approximate; reduced-motion mode uses soft glow.",
    "pullWho": "Perception and visualization limits",
    "tags": [
      "TypeScript",
      "Three.js",
      "Web Audio API",
      "Tone.js",
      "Supabase",
      "Colour science"
    ],
    "links": [
      {
        "label": "Find your colour fingerprint",
        "href": "https://color-fingerprint.fun"
      },
      {
        "label": "Source on GitHub",
        "href": "https://github.com/MMM1122/color_fingerprint"
      }
    ]
  },
  {
    "id": "corridor-of-thought",
    "name": "Corridor of Thought",
    "kind": "Research & knowledge · live",
    "question": "Explore how ideas evolve: read and revise papers, trace arguments back to their sources, and compare perspectives in a shared research workspace.",
    "figures": [
      {
        "n": "4",
        "l": "Original papers to explore"
      },
      {
        "n": "2D / 3D",
        "l": "Source-linked argument graphs"
      },
      {
        "n": "Local",
        "l": "Browser storage, no sign-in required"
      }
    ],
    "bullets": [
      "Built a PDF reading and revision workflow with preserved originals, editable working copies, autosave, snapshots and revision comparisons.",
      "Connected argument and concept nodes to exact source passages, with interactive 2D graphs and a Three.js corridor for exploring relationships.",
      "Added paper comparisons, evidence-backed alignments, feedback records and reflections so interpretations can be reviewed alongside the passages they refer to.",
      "Made the live edition work in the browser without sign-in, with backup and restore. The local Next.js edition adds SQLite storage and optional server-side AI suggestions."
    ],
    "pull": "Lexical matches and argument relationships are suggestions to review, not proof of meaning or causation. Browser work needs a separate backup; optional AI analysis is available in the local edition.",
    "pullWho": "Source integrity and storage limits",
    "tags": [
      "Next.js",
      "TypeScript",
      "Three.js",
      "Tiptap",
      "SQLite",
      "PDF workflows"
    ],
    "links": [
      {
        "label": "Explore the corridor",
        "href": "https://corridor-of-thought.fun"
      },
      {
        "label": "Source on GitHub",
        "href": "https://github.com/MMM1122/CORRIDOR_OF_THOUGHT"
      }
    ]
  },
  {
    "id": "credit",
    "name": "Credit card default prediction",
    "kind": "Machine learning · Python",
    "question": "Can six months of billing history predict who will miss their next payment — and how should a lender actually use that prediction?",
    "figures": [
      {
        "n": "0.789",
        "l": "Test ROC-AUC [0.778, 0.801]"
      },
      {
        "n": "0.575",
        "l": "Test average precision"
      },
      {
        "n": "30,000",
        "l": "Customers, six months each"
      }
    ],
    "bullets": [
      "Built a delinquency-recency feature that ranked first in both SHAP (0.385 mean |SHAP|) and permutation importance (0.116) — roughly three times the next feature. How recently someone missed a payment beat how often they missed one.",
      "Selected models on average precision rather than accuracy or F1, because only 22% of customers defaulted and accuracy flatters a model that predicts no default for everyone.",
      "Compared models with a Nadeau–Bengio corrected paired t-test over 15 folds. Tuned LightGBM improved average precision over logistic regression by 0.042 (p < 0.001).",
      "Checked calibration before using the probabilities in the cost analysis: mean predicted probability 0.2212 against an observed default rate of 0.2212.",
      "Removed sex and marital status and re-measured — cross-validated average precision was unchanged to three decimals. Dropping protected attributes does not by itself rule out proxy effects, so outcomes were checked too."
    ],
    "pull": "Under different loss and margin assumptions the best threshold moves between 0.02 and 0.33. The threshold depends so heavily on real business costs that a sensitivity table is more honest than presenting one cutoff as the answer.",
    "pullWho": "Section 12 — threshold and cost analysis",
    "tags": [
      "Python",
      "LightGBM",
      "scikit-learn",
      "SHAP",
      "Pandas",
      "Jupyter"
    ],
    "links": [
      {
        "label": "Read the notebook on GitHub",
        "href": "https://github.com/MMM1122/Credit-Default-Prediction"
      }
    ]
  },
  {
    "id": "wonder-lab",
    "name": "Wonder Lab",
    "kind": "Frontend preview · In progress",
    "question": "A bilingual personal journal where a forest adventure opens into a psychedelic world of ideas, mathematical geometry and ambient sound.",
    "figures": [
      {
        "n": "2",
        "l": "Languages: English and Chinese"
      },
      {
        "n": "4",
        "l": "Chapters in the opening adventure"
      },
      {
        "n": "3",
        "l": "Procedural geometry studies"
      }
    ],
    "bullets": [
      "Built a shared React and TypeScript interface for bilingual sample articles, category filtering and a reading dialog, with a static export that can run on GitHub Pages.",
      "Combined AI-generated forest and character artwork with an eight-frame walking sprite and timed CSS transitions through the forest, cave, fall and arrival. The opening supports skipping, replay and reduced-motion preferences.",
      "Generated torus wireframes, golden-angle phyllotaxis and hypotrochoid curves as SVG from mathematical coordinates, keeping the artwork sharp at different sizes.",
      "Synthesized optional ambient sound in the browser with the Web Audio API: oscillators, volume envelopes and delay, with playback and volume controls."
    ],
    "pull": "The current frontend preview uses sample content. Publishing, sign-in and persistent visitor messages are not connected in this static edition. Still working on smoother movement and the complete writing and guestbook experience.",
    "pullWho": "Current scope · Work in progress",
    "tags": [
      "React",
      "TypeScript",
      "CSS animation",
      "SVG geometry",
      "Web Audio API",
      "GitHub Pages"
    ],
    "links": [
      {
        "label": "Explore the frontend preview",
        "href": "https://mmm1122.github.io/wonderlab/"
      }
    ]
  }
];

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
