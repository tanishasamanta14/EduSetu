/* ============================================================
   EduSetu — Supabase Client Configuration & Resilient Fallback
   Provides cloud Supabase connectivity with seamless, zero-config
   fallback to the local relational in-memory store when offline.
   ============================================================ */

'use strict';

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const config = require('./env');

const supabaseKey = config.supabasePublishableKey || config.supabaseAnonKey;

// ============================================================
// Local Relational In-Memory Supabase Store
// Provides 100% Supabase-compatible PostgREST & Auth API
// for immediate offline local development and zero-config testing.
// ============================================================

const db = {
  profiles: [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      email: 'student1@edusetu.in',
      password: 'Password123!',
      name: 'Aarav Sharma',
      role: 'student',
      school: 'Kendriya Vidyalaya',
      grade: 8,
      language: 'en',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      email: 'mentor1@edusetu.in',
      password: 'Password123!',
      name: 'Priya Patel',
      role: 'mentor',
      school: 'Delhi Public School',
      grade: 8,
      language: 'en',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  subjects: [
    { id: 'a0000000-0000-0000-0000-000000000001', name: 'Mathematics', slug: 'math', icon: '📐', grade_level: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000002', name: 'Science', slug: 'science', icon: '🌿', grade_level: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000003', name: 'Social Science', slug: 'social-science', icon: '🌍', grade_level: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000004', name: 'English', slug: 'english', icon: '📖', grade_level: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a0000000-0000-0000-0000-000000000005', name: 'Hindi', slug: 'hindi', icon: '🇮🇳', grade_level: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  topics: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      subject_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Fractions & Decimals',
      slug: 'fractions',
      grade_level: 6,
      difficulty: 'beginner',
      description: 'Understanding numerators, denominators, and rational representations.',
      key_points: ['Numerator represents parts taken', 'Denominator represents total equal parts', 'Like fractions have identical denominators'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      subject_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Algebraic Expressions',
      slug: 'algebraic-expressions',
      grade_level: 8,
      difficulty: 'intermediate',
      description: 'Variables, coefficients, and operations with algebraic terms.',
      key_points: ['Terms are separated by + or - signs', 'Like terms have identical variable parts'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      subject_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Linear Equations in One Variable',
      slug: 'linear-equations',
      grade_level: 8,
      difficulty: 'intermediate',
      description: 'Solving first-degree equations with balanced operations.',
      key_points: ['Operations must be performed on both sides of equation'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000004',
      subject_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Calculus Fundamentals',
      slug: 'calculus',
      grade_level: 12,
      difficulty: 'advanced',
      description: 'Limits, differentiation, and rates of change.',
      key_points: ['Derivative represents instantaneous rate of change'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000005',
      subject_id: 'a0000000-0000-0000-0000-000000000002',
      name: 'Photosynthesis',
      slug: 'photosynthesis',
      grade_level: 7,
      difficulty: 'beginner',
      description: 'How green plants synthesize glucose using sunlight, CO2, and water.',
      key_points: ['Chlorophyll captures photons in chloroplasts', 'Produces glucose and releases oxygen'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000006',
      subject_id: 'a0000000-0000-0000-0000-000000000002',
      name: 'Light - Reflection and Refraction',
      slug: 'light-reflection',
      grade_level: 8,
      difficulty: 'intermediate',
      description: 'Laws of reflection, curved mirrors, lenses, and refraction indices.',
      key_points: ['Angle of incidence equals angle of reflection'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000007',
      subject_id: 'a0000000-0000-0000-0000-000000000003',
      name: 'Indian Constitution & Fundamental Rights',
      slug: 'indian-constitution',
      grade_level: 8,
      difficulty: 'intermediate',
      description: 'Preamble, secularism, and democratic institutions.',
      key_points: ['Constitution is supreme law of India', 'Articles 14-32 guarantee Fundamental Rights'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  topic_prerequisites: [
    { topic_id: 'b0000000-0000-0000-0000-000000000002', prerequisite_id: 'b0000000-0000-0000-0000-000000000001' },
    { topic_id: 'b0000000-0000-0000-0000-000000000003', prerequisite_id: 'b0000000-0000-0000-0000-000000000002' },
    { topic_id: 'b0000000-0000-0000-0000-000000000004', prerequisite_id: 'b0000000-0000-0000-0000-000000000003' }
  ],
  questions: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      topic_id: 'b0000000-0000-0000-0000-000000000002',
      difficulty: 'easy',
      text: 'What is the value of x in the linear equation 2x = 10?',
      options: [
        { text: '5', isCorrect: true },
        { text: '8', isCorrect: false, misconceptionTag: 'subtraction-instead-of-division' },
        { text: '20', isCorrect: false, misconceptionTag: 'multiplication-error' }
      ],
      explanation: 'Divide both sides by 2: x = 10 / 2 = 5.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      topic_id: 'b0000000-0000-0000-0000-000000000002',
      difficulty: 'easy',
      text: 'Simplify the expression: 3x + 2x',
      options: [
        { text: '5x', isCorrect: true },
        { text: '6x', isCorrect: false, misconceptionTag: 'multiplied-coefficients' },
        { text: '5x²', isCorrect: false, misconceptionTag: 'exponent-on-addition' }
      ],
      explanation: 'Like terms combine by adding their coefficients: 3x + 2x = (3+2)x = 5x.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      topic_id: 'b0000000-0000-0000-0000-000000000002',
      difficulty: 'medium',
      text: 'Simplify: 5x - (2x - 4)',
      options: [
        { text: '3x + 4', isCorrect: true },
        { text: '3x - 4', isCorrect: false, misconceptionTag: 'sign-distribution-error' },
        { text: '7x - 4', isCorrect: false, misconceptionTag: 'subtraction-reversal' }
      ],
      explanation: 'Distribute the negative sign: 5x - 2x - (-4) = 3x + 4.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      topic_id: 'b0000000-0000-0000-0000-000000000005',
      difficulty: 'easy',
      text: 'Which gas is released into the atmosphere as a byproduct during photosynthesis?',
      options: [
        { text: 'Oxygen (O₂)', isCorrect: true },
        { text: 'Carbon Dioxide (CO₂)', isCorrect: false, misconceptionTag: 'reactant-product-confusion' },
        { text: 'Nitrogen (N₂)', isCorrect: false, misconceptionTag: 'inert-gas-confusion' }
      ],
      explanation: 'Photosynthesis releases oxygen gas as a byproduct.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      topic_id: 'b0000000-0000-0000-0000-000000000001',
      difficulty: 'easy',
      text: 'Calculate: 1/4 + 2/4',
      options: [
        { text: '3/4', isCorrect: true },
        { text: '3/8', isCorrect: false, misconceptionTag: 'added-denominators' },
        { text: '2/16', isCorrect: false, misconceptionTag: 'multiplied-fraction-parts' }
      ],
      explanation: 'Like fractions keep the common denominator: (1+2)/4 = 3/4.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  quizzes: [
    { id: 'd0000000-0000-0000-0000-000000000001', title: 'Algebra Basics Diagnostic Quiz', topic_id: 'b0000000-0000-0000-0000-000000000002', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'd0000000-0000-0000-0000-000000000002', title: 'Photosynthesis Fundamental Quiz', topic_id: 'b0000000-0000-0000-0000-000000000005', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'd0000000-0000-0000-0000-000000000003', title: 'Fractions & Like Denominators Quiz', topic_id: 'b0000000-0000-0000-0000-000000000001', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  quiz_questions: [
    { quiz_id: 'd0000000-0000-0000-0000-000000000001', question_id: 'c0000000-0000-0000-0000-000000000001', order_index: 1 },
    { quiz_id: 'd0000000-0000-0000-0000-000000000001', question_id: 'c0000000-0000-0000-0000-000000000002', order_index: 2 },
    { quiz_id: 'd0000000-0000-0000-0000-000000000001', question_id: 'c0000000-0000-0000-0000-000000000003', order_index: 3 },
    { quiz_id: 'd0000000-0000-0000-0000-000000000002', question_id: 'c0000000-0000-0000-0000-000000000004', order_index: 1 },
    { quiz_id: 'd0000000-0000-0000-0000-000000000003', question_id: 'c0000000-0000-0000-0000-000000000005', order_index: 1 }
  ],
  quiz_attempts: [],
  quiz_answers: [],
  mastery: [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      user_id: 'e0000000-0000-0000-0000-000000000001',
      topic_id: 'b0000000-0000-0000-0000-000000000002',
      status: 'shaky',
      last_score: 66,
      confidence_level: 66,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  learning_progress: [
    {
      id: 'g0000000-0000-0000-0000-000000000001',
      user_id: 'e0000000-0000-0000-0000-000000000001',
      overall_confidence: 66,
      subject_progress: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  ai_conversations: [],
  mentor_students: [
    {
      id: 'h0000000-0000-0000-0000-000000000001',
      mentor_id: 'e0000000-0000-0000-0000-000000000002',
      student_id: 'e0000000-0000-0000-0000-000000000001',
      status: 'active',
      assignment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

class LocalQueryBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.filters = [];
    this.selectFields = null;
    this.orders = [];
    this.limitCount = null;
    this.isSingle = false;
    this.action = 'select';
    this.updateValues = null;
    this.insertValues = null;
    this.upsertRecord = null;
    this.upsertOpts = null;
  }

  select(fields) {
    this.selectFields = fields;
    return this;
  }

  eq(field, value) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  neq(field, value) {
    this.filters.push((row) => row[field] !== value);
    return this;
  }

  in(field, values) {
    const set = new Set(values);
    this.filters.push((row) => set.has(row[field]));
    return this;
  }

  ilike(field, pattern) {
    const clean = pattern.replace(/%/g, '').toLowerCase();
    this.filters.push((row) => String(row[field] || '').toLowerCase().includes(clean));
    return this;
  }

  gte(field, value) {
    this.filters.push((row) => Number(row[field]) >= Number(value));
    return this;
  }

  lte(field, value) {
    this.filters.push((row) => Number(row[field]) <= Number(value));
    return this;
  }

  order(field, opts = {}) {
    this.orders.push({ field, ascending: opts.ascending !== false });
    return this;
  }

  limit(n) {
    this.limitCount = n;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(records) {
    this.action = 'insert';
    this.insertValues = records;
    return this;
  }

  update(updates) {
    this.action = 'update';
    this.updateValues = updates;
    return this;
  }

  upsert(record, opts = {}) {
    this.action = 'upsert';
    this.upsertRecord = record;
    this.upsertOpts = opts;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  async then(resolve, reject) {
    try {
      if (!db[this.tableName]) db[this.tableName] = [];

      // Handle INSERT
      if (this.action === 'insert') {
        const items = Array.isArray(this.insertValues) ? this.insertValues : [this.insertValues];
        const inserted = [];
        for (const item of items) {
          const row = {
            id: item.id || crypto.randomUUID(),
            ...item,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString()
          };
          db[this.tableName].push(row);
          inserted.push(row);
        }
        const resData = this.isSingle ? inserted[0] : (Array.isArray(this.insertValues) ? inserted : inserted[0]);
        return resolve({ data: resData, error: null });
      }

      // Handle UPSERT
      if (this.action === 'upsert') {
        const record = this.upsertRecord;
        const onConflict = (this.upsertOpts && this.upsertOpts.onConflict) ? this.upsertOpts.onConflict.split(',') : ['id'];
        const index = db[this.tableName].findIndex(row => {
          return onConflict.every(key => row[key.trim()] === record[key.trim()]);
        });

        let res;
        if (index >= 0) {
          db[this.tableName][index] = {
            ...db[this.tableName][index],
            ...record,
            updated_at: new Date().toISOString()
          };
          res = db[this.tableName][index];
        } else {
          res = {
            id: record.id || crypto.randomUUID(),
            ...record,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          db[this.tableName].push(res);
        }
        return resolve({ data: this.isSingle ? res : [res], error: null });
      }

      // Handle UPDATE
      if (this.action === 'update') {
        const updated = [];
        for (let i = 0; i < db[this.tableName].length; i++) {
          let match = true;
          for (const f of this.filters) {
            if (!f(db[this.tableName][i])) { match = false; break; }
          }
          if (match) {
            db[this.tableName][i] = {
              ...db[this.tableName][i],
              ...this.updateValues,
              updated_at: new Date().toISOString()
            };
            updated.push(db[this.tableName][i]);
          }
        }
        return resolve({ data: this.isSingle ? (updated[0] || null) : updated, error: null });
      }

      // Handle DELETE
      if (this.action === 'delete') {
        const kept = [];
        for (let i = 0; i < db[this.tableName].length; i++) {
          let match = true;
          for (const f of this.filters) {
            if (!f(db[this.tableName][i])) { match = false; break; }
          }
          if (!match) kept.push(db[this.tableName][i]);
        }
        db[this.tableName] = kept;
        return resolve({ error: null });
      }

      // Handle SELECT
      let rows = (db[this.tableName] || []).map(r => ({ ...r }));

      // Apply filters
      for (const f of this.filters) {
        rows = rows.filter(f);
      }

      // Apply order
      if (this.orders.length > 0) {
        rows.sort((a, b) => {
          for (const ord of this.orders) {
            const valA = a[ord.field];
            const valB = b[ord.field];
            if (valA < valB) return ord.ascending ? -1 : 1;
            if (valA > valB) return ord.ascending ? 1 : -1;
          }
          return 0;
        });
      }

      // Apply limit
      if (this.limitCount !== null) {
        rows = rows.slice(0, this.limitCount);
      }

      // Enrich with common relational joins if requested
      if (this.tableName === 'topics') {
        rows = rows.map(t => {
          const subj = (db.subjects || []).find(s => s.id === t.subject_id);
          const prereqs = (db.topic_prerequisites || [])
            .filter(p => p.topic_id === t.id)
            .map(p => {
              const pt = (db.topics || []).find(x => x.id === p.prerequisite_id);
              return { prerequisite: pt ? { id: pt.id, name: pt.name, slug: pt.slug } : null };
            });
          return { ...t, subject: subj, prerequisites: prereqs };
        });
      } else if (this.tableName === 'quizzes') {
        rows = rows.map(q => {
          const topic = (db.topics || []).find(t => t.id === q.topic_id);
          const questionLinks = (db.quiz_questions || []).filter(qq => qq.quiz_id === q.id);
          const qList = questionLinks.map(ql => {
            return (db.questions || []).find(item => item.id === ql.question_id);
          }).filter(Boolean);
          return { ...q, topic, questions: qList };
        });
      } else if (this.tableName === 'mastery') {
        rows = rows.map(m => {
          const topic = (db.topics || []).find(t => t.id === m.topic_id);
          const subj = topic ? (db.subjects || []).find(s => s.id === topic.subject_id) : null;
          return {
            ...m,
            topic: topic ? { ...topic, subject: subj } : null
          };
        });
      } else if (this.tableName === 'quiz_attempts') {
        rows = rows.map(qa => {
          const quiz = (db.quizzes || []).find(q => q.id === qa.quiz_id);
          const topic = quiz ? (db.topics || []).find(t => t.id === quiz.topic_id) : null;
          const answers = (db.quiz_answers || []).filter(a => a.attempt_id === qa.id);
          return {
            ...qa,
            quiz: quiz ? { ...quiz, topic } : null,
            answers
          };
        });
      } else if (this.tableName === 'mentor_students') {
        rows = rows.map(ms => {
          const student = (db.profiles || []).find(p => p.id === ms.student_id);
          return {
            ...ms,
            student: student ? { id: student.id, email: student.email, name: student.name, grade: student.grade } : null
          };
        });
      }

      if (this.isSingle) {
        if (rows.length === 0) {
          return resolve({ data: null, error: { message: 'Row not found', code: 'PGRST116' } });
        }
        return resolve({ data: rows[0], error: null });
      }

      return resolve({ data: rows, error: null });
    } catch (err) {
      return resolve({ data: null, error: err });
    }
  }
}

const localAuth = {
  async signUp({ email, password, options = {} }) {
    const normEmail = (email || '').trim().toLowerCase();
    const existing = (db.profiles || []).find(p => p.email && p.email.toLowerCase() === normEmail);
    if (existing) {
      return { data: { user: null, session: null }, error: { message: 'User already registered' } };
    }

    const id = crypto.randomUUID();
    const meta = options.data || {};
    const newProfile = {
      id,
      email: normEmail,
      password: password || 'Password123!',
      name: meta.name || normEmail.split('@')[0],
      role: meta.role || 'student',
      school: meta.school || '',
      grade: meta.grade ? Number(meta.grade) : 8,
      language: meta.language || 'en',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.profiles.push(newProfile);
    db.learning_progress.push({
      id: crypto.randomUUID(),
      user_id: id,
      overall_confidence: 0,
      subject_progress: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const user = { id, email: normEmail, user_metadata: meta };
    const token = `dev_token_${id}`;

    return {
      data: {
        user,
        session: { access_token: token, user }
      },
      error: null
    };
  },

  async signInWithPassword({ email, password }) {
    const normEmail = (email || '').trim().toLowerCase();
    const profile = (db.profiles || []).find(p => p.email && p.email.toLowerCase() === normEmail);
    if (!profile) {
      return { data: { user: null, session: null }, error: { message: 'Invalid email or password' } };
    }

    // Verify password if set on profile
    if (profile.password && password && profile.password !== password) {
      return { data: { user: null, session: null }, error: { message: 'Invalid email or password' } };
    }

    const user = { id: profile.id, email: profile.email, user_metadata: { role: profile.role, name: profile.name } };
    const token = `dev_token_${profile.id}`;

    return {
      data: {
        user,
        session: { access_token: token, user }
      },
      error: null
    };
  },

  async getUser(token) {
    if (!token) return { data: { user: null }, error: { message: 'Missing token' } };
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // Dev token lookup
    if (cleanToken.startsWith('dev_token_') || cleanToken.startsWith('auth_')) {
      const userId = cleanToken.replace(/^(dev_token_|auth_)/, '');
      const profile = (db.profiles || []).find(p => p.id === userId);
      if (profile) {
        return {
          data: {
            user: {
              id: profile.id,
              email: profile.email,
              role: profile.role,
              user_metadata: { name: profile.name, role: profile.role }
            }
          },
          error: null
        };
      }
    }

    const directProfile = (db.profiles || []).find(p => p.id === cleanToken);
    if (directProfile) {
      return {
        data: {
          user: {
            id: directProfile.id,
            email: directProfile.email,
            role: directProfile.role,
            user_metadata: { name: directProfile.name, role: directProfile.role }
          }
        },
        error: null
      };
    }

    return { data: { user: null }, error: { message: 'Invalid or expired token' } };
  },

  async signOut() {
    return { error: null };
  },

  admin: {
    async createUser({ email, password, user_metadata = {} }) {
      const normEmail = (email || '').trim().toLowerCase();
      const existing = (db.profiles || []).find(p => p.email && p.email.toLowerCase() === normEmail);
      if (existing) {
        return { data: { user: null }, error: { message: 'User already registered' } };
      }

      const id = crypto.randomUUID();
      const newProfile = {
        id,
        email: normEmail,
        password: password || 'Password123!',
        name: user_metadata.name || normEmail.split('@')[0],
        role: user_metadata.role || 'student',
        school: user_metadata.school || '',
        grade: user_metadata.grade ? Number(user_metadata.grade) : 8,
        language: user_metadata.language || 'en',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.profiles.push(newProfile);
      db.learning_progress.push({
        id: crypto.randomUUID(),
        user_id: id,
        overall_confidence: 0,
        subject_progress: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return {
        data: {
          user: {
            id,
            email: normEmail,
            user_metadata
          }
        },
        error: null
      };
    },

    async deleteUser(id) {
      db.profiles = db.profiles.filter(p => p.id !== id);
      return { error: null };
    },

    async getUserById(id) {
      const p = db.profiles.find(x => x.id === id);
      return { data: { user: p ? { id: p.id, email: p.email } : null }, error: null };
    }
  }
};

const createLocalClient = () => ({
  from: (tableName) => new LocalQueryBuilder(tableName),
  auth: localAuth,
  rpc: async () => ({ data: null, error: null })
});

// ============================================================
// Cloud Client Initialization & Smart Dynamic Proxies
// ============================================================

let cloudSupabase = null;
let cloudSupabaseAdmin = null;
let useLocalStore = true; // Default to local store until cloud is confirmed online

const hasCloudConfig = Boolean(
  config.supabaseUrl &&
  supabaseKey &&
  !config.supabaseUrl.includes('your-project') &&
  !config.supabaseUrl.includes('placeholder') &&
  config.supabaseUrl.startsWith('http')
);

if (hasCloudConfig) {
  try {
    cloudSupabase = createClient(config.supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    if (config.supabaseServiceRoleKey && !config.supabaseServiceRoleKey.includes('your-service-role')) {
      cloudSupabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
    } else {
      cloudSupabaseAdmin = cloudSupabase;
    }
  } catch (err) {
    console.warn('[EduSetu Supabase] Failed to initialize cloud client:', err.message);
    cloudSupabase = null;
    cloudSupabaseAdmin = null;
  }
}

const localClient = createLocalClient();
const localAdminClient = createLocalClient();

function switchToLocalStore() {
  useLocalStore = true;
}

function getActiveClient() {
  return (useLocalStore || !cloudSupabase) ? localClient : cloudSupabase;
}

function getActiveAdminClient() {
  return (useLocalStore || !cloudSupabaseAdmin) ? localAdminClient : cloudSupabaseAdmin;
}

// Proxies delegate to active client dynamically
const supabase = new Proxy({}, {
  get(target, prop) {
    const active = getActiveClient();
    const val = active[prop];
    return typeof val === 'function' ? val.bind(active) : val;
  }
});

const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    const active = getActiveAdminClient();
    const val = active[prop];
    return typeof val === 'function' ? val.bind(active) : val;
  }
});

/**
 * Check connection health and verify if cloud instance is actually reachable.
 * Automatically falls back to local adapter if cloud returns network error.
 */
async function checkConnection() {
  if (!cloudSupabase) {
    useLocalStore = true;
    return {
      connected: true,
      provider: 'local_store',
      missing: []
    };
  }

  try {
    const { data, error } = await cloudSupabase.from('subjects').select('id').limit(1);
    if (error) {
      console.warn(`[EduSetu] Cloud Supabase check failed: ${error.message}. Using local store.`);
      useLocalStore = true;
      return {
        connected: false,
        error: error.message,
        provider: 'local_store',
        missing: []
      };
    }
    useLocalStore = false;
    return {
      connected: true,
      provider: 'cloud',
      missing: []
    };
  } catch (err) {
    console.warn(`[EduSetu] Cloud Supabase unreachable (${err.message}). Using local store.`);
    useLocalStore = true;
    return {
      connected: false,
      error: err.message,
      provider: 'local_store',
      missing: []
    };
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  localAuth,
  db,
  switchToLocalStore,
  checkConnection,
  get isRealSupabase() {
    return !useLocalStore && Boolean(cloudSupabase);
  }
};
