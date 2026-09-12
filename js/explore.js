/* ============================================================
   EduSetu — Explore Page JavaScript
   Topic search/discovery with knowledge base
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Knowledge Base ---------- */
  var TOPICS = [
    // PRIMARY (1-5)
    { title: 'Numbers & Counting', level: 'primary', subject: 'Mathematics', icon: '🔢',
      desc: 'Foundation of all mathematics — understanding numbers, place value, and counting from 1 to 10,000 and beyond.',
      keyPoints: ['Place value system (ones, tens, hundreds)', 'Comparing and ordering numbers', 'Even and odd numbers', 'Number patterns and sequences', 'Roman numerals basics'],
      related: ['Addition', 'Subtraction', 'Fractions'], resources: [{title: 'Practice Counting', type: 'quiz'}] },

    { title: 'Addition & Subtraction', level: 'primary', subject: 'Mathematics', icon: '➕',
      desc: 'Basic arithmetic operations — adding and subtracting numbers with carrying and borrowing.',
      keyPoints: ['Single and multi-digit addition', 'Carrying over in addition', 'Borrowing in subtraction', 'Word problems with addition/subtraction', 'Mental math strategies'],
      related: ['Numbers & Counting', 'Multiplication', 'Fractions'], resources: [{title: 'Addition Quiz', type: 'quiz'}] },

    { title: 'Shapes & Geometry', level: 'primary', subject: 'Mathematics', icon: '🔷',
      desc: 'Introduction to 2D and 3D shapes, their properties, symmetry, and spatial understanding.',
      keyPoints: ['Identifying basic shapes (circle, square, triangle)', '3D shapes (cube, sphere, cylinder)', 'Lines of symmetry', 'Perimeter of simple shapes', 'Tessellations and patterns'],
      related: ['Measurement', 'Numbers & Counting'], resources: [{title: 'Shapes Explorer', type: 'interactive'}] },

    { title: 'Plants & Animals', level: 'primary', subject: 'Science', icon: '🌿',
      desc: 'Living things around us — understanding plants, animals, their habitats, and basic life processes.',
      keyPoints: ['Parts of a plant (roots, stem, leaves, flower)', 'Animal classification (herbivore, carnivore, omnivore)', 'Habitats and adaptations', 'Life cycle of a butterfly', 'Importance of trees'],
      related: ['Food & Nutrition', 'Environment'], resources: [{title: 'Plant Parts Quiz', type: 'quiz'}] },

    { title: 'Stories & Comprehension', level: 'primary', subject: 'English', icon: '📖',
      desc: 'Reading stories, understanding context, answering questions, and building vocabulary from early age.',
      keyPoints: ['Reading with understanding', 'Identifying main idea and details', 'Character and setting analysis', 'Building vocabulary from context', 'Sequencing events in a story'],
      related: ['Grammar Basics', 'Writing Skills'], resources: [{title: 'Story Time', type: 'reading'}] },

    // MIDDLE (6-8)
    { title: 'Fractions & Decimals', level: 'middle', subject: 'Mathematics', icon: '🔢',
      desc: 'Understanding parts of a whole — fractions, decimals, and their interconversion with real-world applications.',
      keyPoints: ['Types of fractions (proper, improper, mixed)', 'Operations on fractions (add, subtract, multiply, divide)', 'Converting fractions to decimals', 'Comparing and ordering decimals', 'Real-world fraction problems'],
      related: ['Ratios & Proportions', 'Percentages', 'Algebra'], resources: [{title: 'Fractions Quiz', type: 'quiz'}] },

    { title: 'Algebra Basics', level: 'middle', subject: 'Mathematics', icon: '📐',
      desc: 'Introduction to variables, expressions, and equations — the language of mathematics.',
      keyPoints: ['Variables and constants', 'Algebraic expressions and terms', 'Solving simple linear equations', 'Like and unlike terms', 'Forming equations from word problems'],
      related: ['Linear Equations', 'Fractions & Decimals', 'Geometry'], resources: [{title: 'Algebra Practice', type: 'quiz'}] },

    { title: 'Cell Structure', level: 'middle', subject: 'Science', icon: '🔬',
      desc: 'The basic building block of life — understanding cell organelles, types, and functions.',
      keyPoints: ['Plant cell vs Animal cell', 'Cell organelles (nucleus, mitochondria, ribosome)', 'Cell membrane and cell wall', 'Prokaryotic vs Eukaryotic cells', 'Cell division basics'],
      related: ['Photosynthesis', 'Reproduction', 'Microorganisms'], resources: [{title: 'Cell Quiz', type: 'quiz'}] },

    { title: 'Photosynthesis', level: 'middle', subject: 'Science', icon: '🌱',
      desc: 'How plants make food using sunlight — the process, equation, and factors affecting it.',
      keyPoints: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'Role of chlorophyll and sunlight', 'Light and dark reactions', 'Factors: light intensity, CO₂, temperature', 'Importance for food chain'],
      related: ['Cell Structure', 'Plants & Animals', 'Respiration'], resources: [{title: 'Photosynthesis Quiz', type: 'quiz'}] },

    { title: 'Grammar & Tenses', level: 'middle', subject: 'English', icon: '📝',
      desc: 'Mastering English grammar — tenses, parts of speech, active/passive voice, and sentence construction.',
      keyPoints: ['12 tenses (present, past, future × simple, continuous, perfect, perfect continuous)', 'Subject-verb agreement', 'Active and passive voice conversion', 'Direct and indirect speech', 'Punctuation rules'],
      related: ['Essay Writing', 'Comprehension', 'Vocabulary'], resources: [{title: 'Tenses Quiz', type: 'quiz'}] },

    { title: 'Ancient India', level: 'middle', subject: 'Social Science', icon: '🏛️',
      desc: 'Exploring India\'s rich ancient history — Indus Valley, Vedic period, Maurya and Gupta empires.',
      keyPoints: ['Indus Valley Civilization (Harappa, Mohenjo-daro)', 'Vedic age and society', 'Buddhism and Jainism', 'Maurya Empire and Ashoka', 'Gupta Empire — Golden Age of India'],
      related: ['Medieval India', 'Indian Constitution', 'Geography'], resources: [{title: 'History Quiz', type: 'quiz'}] },

    // SECONDARY (9-10)
    { title: 'Trigonometry', level: 'secondary', subject: 'Mathematics', icon: '📐',
      desc: 'Study of triangles and angular relationships — ratios, identities, and real-world applications.',
      keyPoints: ['Sin, Cos, Tan ratios', 'Trigonometric identities', 'Values at standard angles (0°, 30°, 45°, 60°, 90°)', 'Heights and distances problems', 'Complementary angle relationships'],
      related: ['Geometry', 'Algebra', 'Coordinate Geometry'], resources: [{title: 'Trig Quiz', type: 'quiz'}] },

    { title: 'Chemical Reactions & Equations', level: 'secondary', subject: 'Science', icon: '⚗️',
      desc: 'Understanding how substances interact — balancing equations, types of reactions, and everyday chemistry.',
      keyPoints: ['Balancing chemical equations', 'Types: combination, decomposition, displacement, double displacement', 'Oxidation and reduction (redox)', 'Exothermic vs endothermic reactions', 'Corrosion and rancidity'],
      related: ['Acids & Bases', 'Metals & Non-metals', 'Periodic Table'], resources: [{title: 'Reactions Quiz', type: 'quiz'}] },

    { title: 'Electricity & Circuits', level: 'secondary', subject: 'Science', icon: '⚡',
      desc: 'Electric current, circuits, and Ohm\'s law — understanding how electricity powers our world.',
      keyPoints: ['Electric current and potential difference', 'Ohm\'s law: V = IR', 'Series and parallel circuits', 'Resistance and resistivity', 'Heating effect of current and its applications'],
      related: ['Magnetism', 'Electromagnetic Waves', 'Light & Optics'], resources: [{title: 'Electricity Quiz', type: 'quiz'}] },

    { title: 'Coordinate Geometry', level: 'secondary', subject: 'Mathematics', icon: '📊',
      desc: 'Geometry meets algebra — plotting points, distance formula, section formula, and area of triangles.',
      keyPoints: ['Cartesian coordinate system', 'Distance formula between two points', 'Section formula (internal division)', 'Area of triangle using coordinates', 'Midpoint formula'],
      related: ['Trigonometry', 'Linear Equations', 'Geometry'], resources: [{title: 'Coordinate Quiz', type: 'quiz'}] },

    // HIGHER SECONDARY (11-12)
    { title: 'Calculus', level: 'higher', subject: 'Mathematics', icon: '∫',
      desc: 'The mathematics of change — differentiation and integration with applications in physics and engineering.',
      keyPoints: ['Limits and continuity', 'Differentiation rules (power, chain, product, quotient)', 'Applications of derivatives (maxima, minima, rate of change)', 'Integration as anti-differentiation', 'Definite integrals and area under curves'],
      related: ['Trigonometry', 'Algebra', 'Coordinate Geometry'], resources: [{title: 'Calculus Quiz', type: 'quiz'}] },

    { title: 'Organic Chemistry', level: 'higher', subject: 'Chemistry', icon: '🧪',
      desc: 'Chemistry of carbon compounds — hydrocarbons, functional groups, reactions, and named reactions.',
      keyPoints: ['Hybridization (sp, sp², sp³)', 'IUPAC nomenclature', 'Isomerism (structural and stereo)', 'Functional groups and their reactions', 'Named reactions (Wurtz, Cannizzaro, Aldol)'],
      related: ['Chemical Bonding', 'Atomic Structure', 'Polymers'], resources: [{title: 'Organic Chem Quiz', type: 'quiz'}] },

    { title: 'Thermodynamics', level: 'higher', subject: 'Physics', icon: '🌡️',
      desc: 'Study of heat, work, and energy — the four laws and their applications in engines and refrigerators.',
      keyPoints: ['Zeroth, First, Second, and Third laws', 'Internal energy and enthalpy', 'Carnot engine and efficiency', 'Entropy and disorder', 'Heat engines and refrigerators'],
      related: ['Kinetic Theory', 'Waves', 'Work & Energy'], resources: [{title: 'Thermo Quiz', type: 'quiz'}] },

    { title: 'Electromagnetic Waves', level: 'higher', subject: 'Physics', icon: '📡',
      desc: 'The electromagnetic spectrum — from radio waves to gamma rays, Maxwell\'s equations, and applications.',
      keyPoints: ['Maxwell\'s equations and EM wave propagation', 'Electromagnetic spectrum (radio → gamma)', 'Properties: speed, wavelength, frequency', 'Applications of each type of EM wave', 'Displacement current concept'],
      related: ['Optics', 'Current Electricity', 'Waves'], resources: [{title: 'EM Waves Quiz', type: 'quiz'}] },

    { title: 'Genetics & Evolution', level: 'higher', subject: 'Biology', icon: '🧬',
      desc: 'Heredity and variation — Mendel\'s laws, DNA structure, genetic disorders, and evolutionary theory.',
      keyPoints: ['Mendel\'s laws of inheritance', 'DNA structure (Watson-Crick model)', 'Chromosomal theory of inheritance', 'Genetic disorders (Down syndrome, Turner syndrome)', 'Darwin\'s theory of natural selection'],
      related: ['Cell Biology', 'Biotechnology', 'Human Physiology'], resources: [{title: 'Genetics Quiz', type: 'quiz'}] },

    { title: 'Indian Constitution', level: 'higher', subject: 'Political Science', icon: '📜',
      desc: 'The supreme law of India — fundamental rights, directive principles, and the structure of government.',
      keyPoints: ['Preamble and its significance', 'Fundamental Rights (Articles 14-32)', 'Directive Principles of State Policy', 'Amendment process', 'Federal structure with unitary features'],
      related: ['Democracy', 'Indian Economy', 'Modern India'], resources: [{title: 'Constitution Quiz', type: 'quiz'}] },

    { title: 'Microeconomics', level: 'higher', subject: 'Economics', icon: '📈',
      desc: 'Economics of individual decision-making — demand, supply, market equilibrium, and consumer behavior.',
      keyPoints: ['Law of demand and demand curve', 'Price elasticity of demand', 'Supply and its determinants', 'Market equilibrium and price mechanism', 'Consumer surplus and producer surplus'],
      related: ['Macroeconomics', 'Statistics for Economics', 'Indian Economy'], resources: [{title: 'Micro Quiz', type: 'quiz'}] },

    { title: 'Python Programming', level: 'higher', subject: 'Computer Science', icon: '🐍',
      desc: 'Programming fundamentals using Python — variables, loops, functions, and data structures.',
      keyPoints: ['Variables, data types, and operators', 'Control flow (if-else, loops)', 'Functions and recursion', 'Lists, tuples, dictionaries, sets', 'File handling and exception handling'],
      related: ['Data Structures', 'Algorithms', 'Databases'], resources: [{title: 'Python Quiz', type: 'quiz'}] },

    // GRADUATION
    { title: 'Data Structures & Algorithms', level: 'graduation', subject: 'Computer Science', icon: '🏗️',
      desc: 'Efficient data organization and problem solving — arrays, trees, graphs, sorting, and complexity analysis.',
      keyPoints: ['Arrays, linked lists, stacks, queues', 'Trees (BST, AVL, heap) and traversals', 'Graph algorithms (BFS, DFS, Dijkstra)', 'Sorting algorithms (merge, quick, heap sort)', 'Time complexity analysis (Big-O notation)'],
      related: ['Python Programming', 'Algorithms', 'Databases'], resources: [{title: 'DSA Quiz', type: 'quiz'}] },

    { title: 'Machine Learning', level: 'graduation', subject: 'Computer Science', icon: '🤖',
      desc: 'Teaching computers to learn from data — supervised, unsupervised learning, neural networks, and applications.',
      keyPoints: ['Supervised vs unsupervised learning', 'Linear regression and logistic regression', 'Decision trees and random forests', 'Neural networks and deep learning basics', 'Model evaluation (accuracy, precision, recall, F1)'],
      related: ['Data Structures & Algorithms', 'Python Programming', 'Statistics'], resources: [{title: 'ML Quiz', type: 'quiz'}] },

    { title: 'Quantum Physics', level: 'graduation', subject: 'Physics', icon: '⚛️',
      desc: 'Physics at the atomic and subatomic scale — wave-particle duality, Schrödinger equation, and quantum states.',
      keyPoints: ['Wave-particle duality', 'Heisenberg uncertainty principle', 'Schrödinger equation', 'Quantum numbers and orbitals', 'Photoelectric effect and Compton scattering'],
      related: ['Modern Physics', 'Electromagnetic Waves', 'Thermodynamics'], resources: [{title: 'Quantum Quiz', type: 'quiz'}] },

    { title: 'Molecular Biology', level: 'graduation', subject: 'Biology', icon: '🧬',
      desc: 'Understanding life at the molecular level — DNA replication, transcription, translation, and gene regulation.',
      keyPoints: ['Central dogma of molecular biology', 'DNA replication mechanism', 'Transcription (RNA synthesis)', 'Translation (protein synthesis)', 'Gene regulation (lac operon, trp operon)'],
      related: ['Genetics & Evolution', 'Biotechnology', 'Cell Biology'], resources: [{title: 'Mol Bio Quiz', type: 'quiz'}] },

    { title: 'Macroeconomics', level: 'graduation', subject: 'Economics', icon: '🏦',
      desc: 'Economics of the whole economy — GDP, inflation, monetary policy, fiscal policy, and international trade.',
      keyPoints: ['GDP measurement (income, expenditure, value-added)', 'Inflation and its causes', 'Monetary policy and RBI', 'Fiscal policy and government budget', 'Balance of payments and exchange rates'],
      related: ['Microeconomics', 'Indian Economy', 'Statistics'], resources: [{title: 'Macro Quiz', type: 'quiz'}] },

    { title: 'Constitutional Law', level: 'graduation', subject: 'Political Science', icon: '⚖️',
      desc: 'In-depth study of constitutional provisions — judicial review, fundamental rights cases, and landmark judgments.',
      keyPoints: ['Doctrine of basic structure (Kesavananda Bharati)', 'Judicial review and judicial activism', 'Right to privacy (Puttaswamy judgment)', 'Emergency provisions (Articles 352-360)', 'Centre-state relations and federalism'],
      related: ['Indian Constitution', 'Democracy', 'Human Rights'], resources: [{title: 'Con Law Quiz', type: 'quiz'}] }
  ];

  var LEVEL_LABELS = {
    primary: 'Primary (1-5)',
    middle: 'Middle (6-8)',
    secondary: 'Secondary (9-10)',
    higher: 'Higher Sec (11-12)',
    graduation: 'Graduation'
  };

  var LEVEL_COLORS = {
    primary: 'rgba(52,211,153,0.15)',
    middle: 'rgba(96,165,250,0.15)',
    secondary: 'rgba(251,191,36,0.15)',
    higher: 'rgba(167,139,250,0.15)',
    graduation: 'rgba(248,113,113,0.15)'
  };

  var currentLevel = 'all';
  var searchInput = document.getElementById('searchInput');
  var searchClear = document.getElementById('searchClear');
  var resultsContainer = document.getElementById('searchResults');
  var noResults = document.getElementById('noResults');
  var levelFilters = document.getElementById('levelFilters');

  /* ---------- Render Topic Card ---------- */
  function createTopicCard(topic) {
    var card = document.createElement('div');
    card.className = 'topic-card';

    // Header
    var header = document.createElement('div');
    header.className = 'topic-card-header';

    var iconDiv = document.createElement('div');
    iconDiv.className = 'topic-card-icon';
    iconDiv.style.background = LEVEL_COLORS[topic.level] || 'rgba(255,255,255,0.06)';
    iconDiv.textContent = topic.icon;

    var info = document.createElement('div');
    var titleEl = document.createElement('div');
    titleEl.className = 'topic-card-title';
    titleEl.textContent = topic.title;

    var meta = document.createElement('div');
    meta.className = 'topic-card-meta';
    var levelBadge = document.createElement('span');
    levelBadge.className = 'topic-badge topic-badge-level';
    levelBadge.textContent = LEVEL_LABELS[topic.level] || topic.level;
    var subjBadge = document.createElement('span');
    subjBadge.className = 'topic-badge topic-badge-subject';
    subjBadge.textContent = topic.subject;
    meta.appendChild(levelBadge);
    meta.appendChild(subjBadge);

    info.appendChild(titleEl);
    info.appendChild(meta);
    header.appendChild(iconDiv);
    header.appendChild(info);
    card.appendChild(header);

    // Description
    var desc = document.createElement('p');
    desc.className = 'topic-card-desc';
    desc.textContent = topic.desc;
    card.appendChild(desc);

    // Key Points
    if (topic.keyPoints && topic.keyPoints.length > 0) {
      var ul = document.createElement('ul');
      ul.className = 'topic-card-points';
      topic.keyPoints.forEach(function(point) {
        var li = document.createElement('li');
        li.textContent = point;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    // Related Topics
    if (topic.related && topic.related.length > 0) {
      var relDiv = document.createElement('div');
      relDiv.className = 'topic-card-related';
      topic.related.forEach(function(rel) {
        var chip = document.createElement('button');
        chip.className = 'related-chip';
        chip.textContent = rel;
        chip.addEventListener('click', function() {
          searchInput.value = rel;
          searchClear.style.display = 'flex';
          performSearch();
        });
        relDiv.appendChild(chip);
      });
      card.appendChild(relDiv);
    }

    // Actions
    var actions = document.createElement('div');
    actions.className = 'topic-card-actions';
    var learnBtn = document.createElement('a');
    learnBtn.className = 'btn btn-primary btn-sm';
    learnBtn.href = 'chatbot.html?topic=' + encodeURIComponent(topic.title);
    learnBtn.textContent = '🤖 Learn with AI';
    var quizBtn = document.createElement('a');
    quizBtn.className = 'btn btn-secondary btn-sm';
    quizBtn.href = 'quiz.html';
    quizBtn.textContent = '📝 Practice Quiz';
    actions.appendChild(learnBtn);
    actions.appendChild(quizBtn);
    card.appendChild(actions);

    return card;
  }

  /* ---------- Search Logic ---------- */
  function performSearch() {
    var query = searchInput.value.trim().toLowerCase();
    var filtered = TOPICS;

    // Filter by level
    if (currentLevel !== 'all') {
      filtered = filtered.filter(function(t) { return t.level === currentLevel; });
    }

    // Filter by search query
    if (query.length >= 2) {
      filtered = filtered.filter(function(t) {
        var searchStr = (t.title + ' ' + t.subject + ' ' + t.desc + ' ' + t.keyPoints.join(' ') + ' ' + t.related.join(' ')).toLowerCase();
        return searchStr.indexOf(query) !== -1;
      });
    }

    renderResults(filtered, query);
  }

  function renderResults(topics, query) {
    resultsContainer.replaceChildren();

    if (topics.length === 0) {
      noResults.style.display = 'block';
      return;
    }

    noResults.style.display = 'none';

    // Results count
    if (query && query.length >= 2) {
      var countDiv = document.createElement('div');
      countDiv.className = 'results-count';
      var strong = document.createElement('strong');
      strong.textContent = topics.length;
      countDiv.appendChild(strong);
      var text = document.createTextNode(' topic' + (topics.length !== 1 ? 's' : '') + ' found');
      countDiv.appendChild(text);
      resultsContainer.appendChild(countDiv);
    } else {
      var headerDiv = document.createElement('div');
      headerDiv.className = 'popular-header';
      headerDiv.textContent = currentLevel === 'all' ? '✨ Popular Topics Across All Levels' : '✨ Topics in ' + LEVEL_LABELS[currentLevel];
      resultsContainer.appendChild(headerDiv);
    }

    // Grid wrapper
    var grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(340px, 1fr))';
    grid.style.gap = 'var(--space-5)';

    topics.forEach(function(topic) {
      grid.appendChild(createTopicCard(topic));
    });

    resultsContainer.appendChild(grid);
  }

  /* ---------- Event Handlers ---------- */
  var debounceTimer;
  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    searchClear.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
    debounceTimer = setTimeout(performSearch, 200);
  });

  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchClear.style.display = 'none';
    performSearch();
    searchInput.focus();
  });

  levelFilters.addEventListener('click', function(e) {
    var btn = e.target.closest('.level-btn');
    if (!btn) return;
    currentLevel = btn.getAttribute('data-level');
    var allBtns = levelFilters.querySelectorAll('.level-btn');
    allBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    performSearch();
  });

  /* ---------- Init ---------- */
  performSearch();

})();
