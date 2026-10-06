-- ============================================================
-- EduSetu — Seed Data for PostgreSQL / Supabase
-- Seed: seed.sql
-- ============================================================

-- 1. Insert Initial Subjects
INSERT INTO public.subjects (id, name, slug, icon, grade_level, is_active)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Mathematics', 'math', '📐', 8, true),
  ('a0000000-0000-0000-0000-000000000002', 'Science', 'science', '🌿', 8, true),
  ('a0000000-0000-0000-0000-000000000003', 'Social Science', 'social-science', '🌍', 8, true),
  ('a0000000-0000-0000-0000-000000000004', 'English', 'english', '📖', 8, true),
  ('a0000000-0000-0000-0000-000000000005', 'Hindi', 'hindi', '🇮🇳', 8, true)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, icon = EXCLUDED.icon, grade_level = EXCLUDED.grade_level;

-- 2. Insert Topics
INSERT INTO public.topics (id, subject_id, name, slug, grade_level, difficulty, description, key_points, is_active)
VALUES
  -- Math Topics
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Fractions & Decimals', 'fractions', 6, 'beginner', 'Understanding numerators, denominators, and rational representations.', '["Numerator represents parts taken", "Denominator represents total equal parts", "Like fractions have identical denominators"]'::jsonb, true),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Algebraic Expressions', 'algebraic-expressions', 8, 'intermediate', 'Variables, coefficients, and operations with algebraic terms.', '["Terms are separated by + or - signs", "Like terms have identical variable parts", "Apply distributive law carefully with negative signs"]'::jsonb, true),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Linear Equations in One Variable', 'linear-equations', 8, 'intermediate', 'Solving first-degree equations with balanced operations.', '["Operations must be performed on both sides of equation", "Transpose terms by reversing sign"]'::jsonb, true),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Calculus Fundamentals', 'calculus', 12, 'advanced', 'Limits, differentiation, and rates of change.', '["Derivative represents instantaneous rate of change", "Product rule and chain rule for compound expressions"]'::jsonb, true),
  
  -- Science Topics
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'Photosynthesis', 'photosynthesis', 7, 'beginner', 'How green plants synthesize glucose using sunlight, CO2, and water.', '["Chlorophyll captures photons in chloroplasts", "Produces glucose and releases oxygen byproduct"]'::jsonb, true),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Light - Reflection and Refraction', 'light-reflection', 8, 'intermediate', 'Laws of reflection, curved mirrors, lenses, and refraction indices.', '["Angle of incidence equals angle of reflection", "Light bends toward normal when entering denser medium"]'::jsonb, true),

  -- Social Science
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'Indian Constitution & Fundamental Rights', 'indian-constitution', 8, 'intermediate', 'Preamble, secularism, and democratic institutions.', '["Constitution is supreme law of India", "Articles 14-32 guarantee Fundamental Rights"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, key_points = EXCLUDED.key_points;

-- 3. Topic Prerequisites
INSERT INTO public.topic_prerequisites (topic_id, prerequisite_id)
VALUES
  ('b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'), -- Fractions -> Algebraic Expressions
  ('b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002'), -- Algebraic Expressions -> Linear Equations
  ('b0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003')  -- Linear Equations -> Calculus
ON CONFLICT DO NOTHING;

-- 4. Insert Questions with Diagnostic Misconception Rubrics
INSERT INTO public.questions (id, topic_id, difficulty, text, options, explanation)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    'easy',
    'What is the value of x in the linear equation 2x = 10?',
    '[
      {"text": "5", "isCorrect": true},
      {"text": "8", "isCorrect": false, "misconceptionTag": "subtraction-instead-of-division"},
      {"text": "20", "isCorrect": false, "misconceptionTag": "multiplication-error"}
    ]'::jsonb,
    'Divide both sides by 2: x = 10 / 2 = 5.'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    'easy',
    'Simplify the expression: 3x + 2x',
    '[
      {"text": "5x", "isCorrect": true},
      {"text": "6x", "isCorrect": false, "misconceptionTag": "multiplied-coefficients"},
      {"text": "5x²", "isCorrect": false, "misconceptionTag": "exponent-on-addition"}
    ]'::jsonb,
    'Like terms combine by adding their coefficients: 3x + 2x = (3+2)x = 5x.'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'medium',
    'Simplify: 5x - (2x - 4)',
    '[
      {"text": "3x + 4", "isCorrect": true},
      {"text": "3x - 4", "isCorrect": false, "misconceptionTag": "sign-distribution-error"},
      {"text": "7x - 4", "isCorrect": false, "misconceptionTag": "subtraction-reversal"}
    ]'::jsonb,
    'Distribute the negative sign across parentheses: 5x - 2x - (-4) = 3x + 4.'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000005',
    'easy',
    'Which gas is released into the atmosphere as a byproduct during photosynthesis?',
    '[
      {"text": "Oxygen (O₂)", "isCorrect": true},
      {"text": "Carbon Dioxide (CO₂)", "isCorrect": false, "misconceptionTag": "reactant-product-confusion"},
      {"text": "Nitrogen (N₂)", "isCorrect": false, "misconceptionTag": "inert-gas-confusion"}
    ]'::jsonb,
    'Plants consume carbon dioxide and water to produce glucose, releasing oxygen gas as a byproduct.'
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000001',
    'easy',
    'Calculate: 1/4 + 2/4',
    '[
      {"text": "3/4", "isCorrect": true},
      {"text": "3/8", "isCorrect": false, "misconceptionTag": "added-denominators"},
      {"text": "2/16", "isCorrect": false, "misconceptionTag": "multiplied-fraction-parts"}
    ]'::jsonb,
    'When adding like fractions, add the numerators and keep the common denominator: (1+2)/4 = 3/4.'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Quizzes
INSERT INTO public.quizzes (id, title, topic_id, is_active)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Algebra Basics Diagnostic Quiz', 'b0000000-0000-0000-0000-000000000002', true),
  ('d0000000-0000-0000-0000-000000000002', 'Photosynthesis Fundamental Quiz', 'b0000000-0000-0000-0000-000000000005', true),
  ('d0000000-0000-0000-0000-000000000003', 'Fractions & Like Denominators Quiz', 'b0000000-0000-0000-0000-000000000001', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Link Quizzes to Questions
INSERT INTO public.quiz_questions (quiz_id, question_id, order_index)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 1),
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 2),
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 3),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 1),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005', 1)
ON CONFLICT DO NOTHING;
