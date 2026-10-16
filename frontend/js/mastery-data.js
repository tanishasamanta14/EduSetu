/* ============================================================
   EduSetu — Mock Mastery Data
   Concept graph data for all subjects.
   Each concept has: id, name, grade, prerequisites[], status, lastScore, confidenceScore
   Status values: "mastered" | "shaky" | "unattempted" | "recommended"
   
   In production, this would come from a database.
   For demo, status is stored/updated in localStorage.
   ============================================================ */

const CONCEPTS = {
  math: [
    { id: "numbers",              name: "Number Systems",           grade: 6, prerequisites: [],                           status: "mastered",    lastScore: 95, confidenceScore: 92 },
    { id: "fractions",            name: "Fractions",                grade: 6, prerequisites: ["numbers"],                  status: "mastered",    lastScore: 88, confidenceScore: 85 },
    { id: "decimals",             name: "Decimals",                 grade: 6, prerequisites: ["numbers"],                  status: "mastered",    lastScore: 82, confidenceScore: 80 },
    { id: "ratios",               name: "Ratios & Proportions",     grade: 7, prerequisites: ["fractions", "decimals"],    status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "percentages",          name: "Percentages",              grade: 7, prerequisites: ["fractions", "decimals"],    status: "mastered",    lastScore: 90, confidenceScore: 88 },
    { id: "integers",             name: "Integers",                 grade: 7, prerequisites: ["numbers"],                  status: "mastered",    lastScore: 85, confidenceScore: 82 },
    { id: "algebraic-expressions",name: "Algebraic Expressions",    grade: 8, prerequisites: ["integers", "fractions"],    status: "shaky",       lastScore: 45, confidenceScore: 40 },
    { id: "linear-equations",     name: "Linear Equations",         grade: 8, prerequisites: ["algebraic-expressions"],    status: "recommended", lastScore: null, confidenceScore: null },
    { id: "geometry-basics",      name: "Basic Geometry",           grade: 6, prerequisites: ["numbers"],                  status: "mastered",    lastScore: 92, confidenceScore: 90 },
    { id: "triangles",            name: "Triangles",                grade: 7, prerequisites: ["geometry-basics"],           status: "shaky",       lastScore: 60, confidenceScore: 55 },
    { id: "circles",              name: "Circles",                  grade: 8, prerequisites: ["geometry-basics"],           status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "mensuration",          name: "Mensuration",              grade: 8, prerequisites: ["triangles", "circles"],      status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "quadrilaterals",       name: "Quadrilaterals",           grade: 8, prerequisites: ["geometry-basics", "triangles"], status: "recommended", lastScore: null, confidenceScore: null },
    { id: "statistics",           name: "Statistics & Data",        grade: 7, prerequisites: ["numbers", "fractions"],      status: "shaky",       lastScore: 52, confidenceScore: 48 },
    { id: "exponents",            name: "Exponents & Powers",       grade: 8, prerequisites: ["integers"],                  status: "unattempted", lastScore: null, confidenceScore: null }
  ],

  science: [
    { id: "living-things",       name: "Living & Non-living",     grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 90, confidenceScore: 88 },
    { id: "cells",               name: "Cell Structure",          grade: 7, prerequisites: ["living-things"],              status: "mastered",    lastScore: 85, confidenceScore: 82 },
    { id: "photosynthesis",      name: "Photosynthesis",          grade: 7, prerequisites: ["cells"],                      status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "respiration",         name: "Respiration",             grade: 7, prerequisites: ["cells"],                      status: "recommended", lastScore: null, confidenceScore: null },
    { id: "reproduction",        name: "Reproduction in Plants",  grade: 8, prerequisites: ["photosynthesis"],             status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "matter",              name: "Matter & Materials",      grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 92, confidenceScore: 90 },
    { id: "acids-bases",         name: "Acids, Bases & Salts",    grade: 7, prerequisites: ["matter"],                    status: "shaky",       lastScore: 48, confidenceScore: 42 },
    { id: "chemical-reactions",  name: "Chemical Reactions",      grade: 8, prerequisites: ["acids-bases"],                status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "light",               name: "Light & Optics",          grade: 7, prerequisites: [],                            status: "mastered",    lastScore: 78, confidenceScore: 75 },
    { id: "refraction",          name: "Refraction",              grade: 8, prerequisites: ["light"],                      status: "shaky",       lastScore: 40, confidenceScore: 35 },
    { id: "electricity",         name: "Electric Current",        grade: 8, prerequisites: [],                            status: "recommended", lastScore: null, confidenceScore: null },
    { id: "magnetism",           name: "Magnetism",               grade: 8, prerequisites: ["electricity"],               status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "force-motion",        name: "Force & Motion",          grade: 7, prerequisites: [],                            status: "mastered",    lastScore: 88, confidenceScore: 85 },
    { id: "friction",            name: "Friction",                grade: 8, prerequisites: ["force-motion"],              status: "shaky",       lastScore: 58, confidenceScore: 52 }
  ],

  english: [
    { id: "parts-of-speech",     name: "Parts of Speech",         grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 92, confidenceScore: 90 },
    { id: "tenses",              name: "Tenses",                  grade: 6, prerequisites: ["parts-of-speech"],            status: "mastered",    lastScore: 85, confidenceScore: 82 },
    { id: "active-passive",      name: "Active & Passive Voice",  grade: 7, prerequisites: ["tenses"],                    status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "direct-indirect",     name: "Direct & Indirect Speech",grade: 7, prerequisites: ["tenses"],                    status: "shaky",       lastScore: 48, confidenceScore: 42 },
    { id: "clauses",             name: "Clauses & Phrases",       grade: 8, prerequisites: ["parts-of-speech"],            status: "recommended", lastScore: null, confidenceScore: null },
    { id: "comprehension",       name: "Reading Comprehension",   grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 88, confidenceScore: 85 },
    { id: "paragraph-writing",   name: "Paragraph Writing",       grade: 7, prerequisites: ["comprehension"],              status: "mastered",    lastScore: 80, confidenceScore: 78 },
    { id: "essay-writing",       name: "Essay Writing",           grade: 8, prerequisites: ["paragraph-writing"],          status: "shaky",       lastScore: 52, confidenceScore: 48 },
    { id: "letter-writing",      name: "Letter Writing",          grade: 8, prerequisites: ["paragraph-writing"],          status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "poetry",              name: "Poetry Analysis",         grade: 7, prerequisites: ["comprehension"],              status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "vocabulary",          name: "Vocabulary Building",     grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 95, confidenceScore: 92 },
    { id: "idioms",              name: "Idioms & Proverbs",       grade: 8, prerequisites: ["vocabulary"],                 status: "recommended", lastScore: null, confidenceScore: null }
  ],

  socialScience: [
    { id: "ancient-india",       name: "Ancient India",           grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 88, confidenceScore: 85 },
    { id: "medieval-india",      name: "Medieval India",          grade: 7, prerequisites: ["ancient-india"],              status: "mastered",    lastScore: 82, confidenceScore: 80 },
    { id: "modern-india",        name: "Modern India",            grade: 8, prerequisites: ["medieval-india"],             status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "indian-constitution", name: "Indian Constitution",     grade: 8, prerequisites: [],                            status: "recommended", lastScore: null, confidenceScore: null },
    { id: "democracy",           name: "Democracy",               grade: 7, prerequisites: [],                            status: "mastered",    lastScore: 90, confidenceScore: 88 },
    { id: "resources",           name: "Resources & Development", grade: 8, prerequisites: [],                            status: "shaky",       lastScore: 48, confidenceScore: 42 },
    { id: "agriculture",         name: "Agriculture",             grade: 8, prerequisites: ["resources"],                  status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "industries",          name: "Industries",              grade: 8, prerequisites: ["resources"],                  status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "globe-maps",          name: "Globe & Maps",            grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 95, confidenceScore: 92 },
    { id: "climate",             name: "Climate & Weather",       grade: 7, prerequisites: ["globe-maps"],                status: "shaky",       lastScore: 60, confidenceScore: 55 },
    { id: "natural-disasters",   name: "Natural Disasters",       grade: 8, prerequisites: ["climate"],                   status: "recommended", lastScore: null, confidenceScore: null }
  ],

  hindi: [
    { id: "varnamala",           name: "Language Phonetics (Varnamala)", grade: 6, prerequisites: [],                            status: "mastered",    lastScore: 95, confidenceScore: 92 },
    { id: "sangya",              name: "Nouns (Sangya)",                 grade: 6, prerequisites: ["varnamala"],                 status: "mastered",    lastScore: 88, confidenceScore: 85 },
    { id: "sarvanam",            name: "Pronouns (Sarvanam)",            grade: 7, prerequisites: ["sangya"],                    status: "mastered",    lastScore: 82, confidenceScore: 80 },
    { id: "kriya",               name: "Verbs (Kriya)",                  grade: 7, prerequisites: ["sangya"],                    status: "shaky",       lastScore: 58, confidenceScore: 52 },
    { id: "visheshan",           name: "Adjectives (Visheshan)",         grade: 7, prerequisites: ["sangya"],                    status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "vakya-rachna",        name: "Sentence Syntax (Vakya Rachna)", grade: 8, prerequisites: ["kriya", "sarvanam"],          status: "recommended", lastScore: null, confidenceScore: null },
    { id: "muhavare",            name: "Idioms & Proverbs (Muhavare)",   grade: 8, prerequisites: ["vakya-rachna"],               status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "patra-lekhan",        name: "Formal Letter Writing",          grade: 8, prerequisites: ["vakya-rachna"],               status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "gadya",               name: "Prose Analysis (Gadya)",         grade: 7, prerequisites: ["varnamala"],                 status: "mastered",    lastScore: 80, confidenceScore: 78 },
    { id: "padya",               name: "Poetic Devices (Padya)",         grade: 7, prerequisites: ["varnamala"],                 status: "shaky",       lastScore: 50, confidenceScore: 45 },
    { id: "nibandh",             name: "Essay Composition (Nibandh)",    grade: 8, prerequisites: ["vakya-rachna", "gadya"],      status: "unattempted", lastScore: null, confidenceScore: null }
  ],

  physics: [
    { id: "kinematics",           name: "Kinematics",              grade: 11, prerequisites: [],                           status: "mastered",    lastScore: 85, confidenceScore: 82 },
    { id: "newtons-laws",         name: "Newton's Laws",           grade: 11, prerequisites: ["kinematics"],                status: "shaky",       lastScore: 60, confidenceScore: 55 },
    { id: "work-energy",          name: "Work & Energy",           grade: 11, prerequisites: ["newtons-laws"],              status: "recommended", lastScore: null, confidenceScore: null },
    { id: "rotational-motion",    name: "Rotational Motion",       grade: 11, prerequisites: ["newtons-laws"],              status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "gravitation",          name: "Gravitation",             grade: 11, prerequisites: ["newtons-laws"],              status: "shaky",       lastScore: 50, confidenceScore: 45 },
    { id: "thermodynamics",       name: "Thermodynamics",          grade: 11, prerequisites: [],                           status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "waves",                name: "Waves & Oscillations",    grade: 11, prerequisites: [],                           status: "recommended", lastScore: null, confidenceScore: null },
    { id: "electrostatics",       name: "Electrostatics",          grade: 12, prerequisites: [],                           status: "mastered",    lastScore: 78, confidenceScore: 75 },
    { id: "current-electricity",  name: "Current Electricity",     grade: 12, prerequisites: ["electrostatics"],            status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "electromagnetic-waves",name: "Electromagnetic Waves",   grade: 12, prerequisites: ["waves"],                     status: "recommended", lastScore: null, confidenceScore: null },
    { id: "optics",               name: "Optics",                  grade: 12, prerequisites: ["electromagnetic-waves"],     status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "modern-physics",       name: "Modern Physics",          grade: 12, prerequisites: ["optics"],                    status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "semiconductors",       name: "Semiconductors",          grade: 12, prerequisites: ["current-electricity"],       status: "unattempted", lastScore: null, confidenceScore: null }
  ],

  chemistry: [
    { id: "atomic-structure",     name: "Atomic Structure",        grade: 11, prerequisites: [],                           status: "mastered",    lastScore: 90, confidenceScore: 88 },
    { id: "periodic-table",       name: "Periodic Table",          grade: 11, prerequisites: ["atomic-structure"],          status: "mastered",    lastScore: 85, confidenceScore: 82 },
    { id: "chemical-bonding",     name: "Chemical Bonding",        grade: 11, prerequisites: ["atomic-structure"],          status: "shaky",       lastScore: 55, confidenceScore: 50 },
    { id: "states-of-matter",     name: "States of Matter",        grade: 11, prerequisites: [],                           status: "mastered",    lastScore: 80, confidenceScore: 78 },
    { id: "thermochem",           name: "Thermochemistry",         grade: 11, prerequisites: ["states-of-matter"],          status: "recommended", lastScore: null, confidenceScore: null },
    { id: "equilibrium",          name: "Chemical Equilibrium",    grade: 11, prerequisites: ["thermochem"],                status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "organic-chemistry",    name: "Organic Chemistry",       grade: 11, prerequisites: ["chemical-bonding"],          status: "recommended", lastScore: null, confidenceScore: null },
    { id: "solutions",            name: "Solutions",               grade: 12, prerequisites: ["states-of-matter"],          status: "shaky",       lastScore: 48, confidenceScore: 42 },
    { id: "electrochemistry",     name: "Electrochemistry",        grade: 12, prerequisites: ["chemical-bonding"],          status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "polymers",             name: "Polymers",                grade: 12, prerequisites: ["organic-chemistry"],         status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "biomolecules",         name: "Biomolecules",            grade: 12, prerequisites: ["organic-chemistry"],         status: "unattempted", lastScore: null, confidenceScore: null }
  ],

  computerScience: [
    { id: "python-basics",        name: "Python Basics",           grade: 11, prerequisites: [],                           status: "mastered",    lastScore: 95, confidenceScore: 92 },
    { id: "python-functions",     name: "Functions & Modules",     grade: 11, prerequisites: ["python-basics"],             status: "mastered",    lastScore: 88, confidenceScore: 85 },
    { id: "data-structures",      name: "Data Structures",         grade: 11, prerequisites: ["python-basics"],             status: "shaky",       lastScore: 65, confidenceScore: 60 },
    { id: "algorithms",           name: "Algorithms",              grade: 12, prerequisites: ["data-structures"],           status: "recommended", lastScore: null, confidenceScore: null },
    { id: "databases",            name: "Databases & SQL",         grade: 12, prerequisites: ["python-basics"],             status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "networking",           name: "Networking",              grade: 12, prerequisites: [],                           status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "oop",                  name: "Object-Oriented Programming", grade: 12, prerequisites: ["python-functions"],      status: "recommended", lastScore: null, confidenceScore: null },
    { id: "cybersecurity",        name: "Cybersecurity",           grade: 12, prerequisites: ["networking"],                status: "unattempted", lastScore: null, confidenceScore: null }
  ],

  biology: [
    { id: "cell-biology",         name: "Cell Biology",            grade: 11, prerequisites: [],                           status: "mastered",    lastScore: 80, confidenceScore: 78 },
    { id: "biomolecules-bio",     name: "Biomolecules",            grade: 11, prerequisites: ["cell-biology"],              status: "mastered",    lastScore: 75, confidenceScore: 72 },
    { id: "cell-division",        name: "Cell Division",           grade: 11, prerequisites: ["cell-biology"],              status: "shaky",       lastScore: 58, confidenceScore: 52 },
    { id: "plant-anatomy",        name: "Plant Anatomy",           grade: 11, prerequisites: ["cell-biology"],              status: "recommended", lastScore: null, confidenceScore: null },
    { id: "genetics",             name: "Genetics & Evolution",    grade: 12, prerequisites: ["cell-division"],             status: "shaky",       lastScore: 50, confidenceScore: 45 },
    { id: "human-physiology",     name: "Human Physiology",        grade: 11, prerequisites: ["cell-biology"],              status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "plant-physiology",     name: "Plant Physiology",        grade: 11, prerequisites: ["cell-biology"],              status: "recommended", lastScore: null, confidenceScore: null },
    { id: "ecology",              name: "Ecology & Environment",   grade: 12, prerequisites: [],                           status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "biotechnology",        name: "Biotechnology",           grade: 12, prerequisites: ["genetics"],                  status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "human-health",         name: "Human Health & Disease",  grade: 12, prerequisites: ["human-physiology"],          status: "unattempted", lastScore: null, confidenceScore: null }
  ],

  economics: [
    { id: "micro-intro",          name: "Intro to Microeconomics", grade: 11, prerequisites: [],                           status: "mastered",    lastScore: 75, confidenceScore: 72 },
    { id: "demand-supply",        name: "Demand & Supply",         grade: 11, prerequisites: ["micro-intro"],               status: "mastered",    lastScore: 82, confidenceScore: 80 },
    { id: "market-structures",    name: "Market Structures",       grade: 11, prerequisites: ["demand-supply"],             status: "shaky",       lastScore: 58, confidenceScore: 52 },
    { id: "national-income",      name: "National Income",         grade: 12, prerequisites: [],                           status: "recommended", lastScore: null, confidenceScore: null },
    { id: "money-banking",        name: "Money & Banking",         grade: 12, prerequisites: ["national-income"],           status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "govt-budget",          name: "Government Budget",       grade: 12, prerequisites: ["national-income"],           status: "unattempted", lastScore: null, confidenceScore: null },
    { id: "indian-economy",       name: "Indian Economic Development", grade: 11, prerequisites: [],                       status: "recommended", lastScore: null, confidenceScore: null },
    { id: "statistics-econ",      name: "Statistics for Economics", grade: 11, prerequisites: [],                          status: "shaky",       lastScore: 55, confidenceScore: 50 }
  ]
};

/* Subject display names and icons */
const SUBJECT_META = {
  math:            { name: "Mathematics",     icon: "📐", color: "#818CF8" },
  science:         { name: "Science",         icon: "🔬", color: "#34D399" },
  english:         { name: "English",         icon: "📚", color: "#FBBF24" },
  socialScience:   { name: "Social Science",  icon: "🌍", color: "#A78BFA" },
  hindi:           { name: "Hindi (Language & Lit)",            icon: "📖", color: "#F87171" },
  physics:         { name: "Physics",         icon: "⚛️", color: "#38BDF8" },
  chemistry:       { name: "Chemistry",       icon: "🧪", color: "#FB923C" },
  computerScience: { name: "Computer Science", icon: "💻", color: "#4ADE80" },
  biology:         { name: "Biology",         icon: "🧬", color: "#E879F9" },
  economics:       { name: "Economics",       icon: "📈", color: "#FACC15" }
};

/**
 * Get concepts for a subject from localStorage (or defaults).
 * Quiz results update these in localStorage.
 */
function getMasteryConcepts(subject) {
  var stored = localStorage.getItem('edusetu_mastery_' + subject);
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* fall through */ }
  }
  return CONCEPTS[subject] || [];
}

/**
 * Save updated concepts to localStorage.
 */
function saveMasteryConcepts(subject, concepts) {
  localStorage.setItem('edusetu_mastery_' + subject, JSON.stringify(concepts));
}

/**
 * Update a single concept's mastery status and score.
 * Called after quiz completion.
 */
function updateConceptMastery(subject, conceptId, score) {
  var concepts = getMasteryConcepts(subject);
  for (var i = 0; i < concepts.length; i++) {
    if (concepts[i].id === conceptId) {
      concepts[i].lastScore = score;
      if (score >= 80) {
        concepts[i].status = "mastered";
        concepts[i].confidenceScore = Math.min(100, score + 5);
      } else if (score >= 40) {
        concepts[i].status = "shaky";
        concepts[i].confidenceScore = score;
      } else {
        concepts[i].status = "shaky";
        concepts[i].confidenceScore = Math.max(20, score);
      }
      break;
    }
  }
  saveMasteryConcepts(subject, concepts);
  return concepts;
}

/**
 * Find which subject a concept belongs to.
 */
function findConceptSubject(conceptId) {
  var subjects = Object.keys(CONCEPTS);
  for (var s = 0; s < subjects.length; s++) {
    var subj = subjects[s];
    for (var c = 0; c < CONCEPTS[subj].length; c++) {
      if (CONCEPTS[subj][c].id === conceptId) {
        return subj;
      }
    }
  }
  return null;
}

/**
 * Get mastery stats for a subject.
 */
function getMasteryStats(subject) {
  var concepts = getMasteryConcepts(subject);
  var stats = { mastered: 0, shaky: 0, unattempted: 0, recommended: 0, total: concepts.length };
  for (var i = 0; i < concepts.length; i++) {
    stats[concepts[i].status] = (stats[concepts[i].status] || 0) + 1;
  }
  return stats;
}
