# Supabase Database & Architecture — EduSetu

This directory contains the reproducible database schema migrations and seed scripts for the **EduSetu** relational PostgreSQL architecture hosted on Supabase.

---

## 1. Directory Structure

```
supabase/
├── migrations/
│   └── 20261006000000_initial_schema.sql  # 11 relational tables, triggers, indexes, RLS policies
├── seed/
│   └── seed.sql                          # Subjects, topics, prerequisites, diagnostic questions, quizzes
└── README.md
```

---

## 2. Setting Up in Supabase

### Option A: Using the Supabase Dashboard (Web)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase project dashboard.
3. Open `supabase/migrations/20261006000000_initial_schema.sql`, copy all contents, paste into the SQL editor, and click **Run**.
4. Open `supabase/seed/seed.sql`, copy all contents, paste into the SQL editor, and click **Run**.
5. Go to **Project Settings** -> **API** to copy:
   - **Project URL** -> `SUPABASE_URL`
   - **anon / public key** -> `SUPABASE_ANON_KEY`
   - **service_role key** (secret) -> `SUPABASE_SERVICE_ROLE_KEY`
6. Add these to your `.env` file in the EduSetu root.

### Option B: Using the Supabase CLI

```bash
# Link your local project to Supabase
supabase link --project-ref <your-project-ref>

# Apply migrations
supabase db push

# Seed initial educational content
psql "<YOUR_SUPABASE_DB_URL>" -f supabase/seed/seed.sql
```

---

## 3. Relational Schema Summary

| Table | Primary Key | Key Relationships & Purpose |
|---|---|---|
| `profiles` | `UUID` (references `auth.users`) | User metadata, grade, language, role (`student`, `mentor`, `admin`). |
| `subjects` | `UUID` | Educational subjects (`Mathematics`, `Science`, `English`, etc.). |
| `topics` | `UUID` | Belongs to `subjects(id)`, grade-level, difficulty. |
| `topic_prerequisites` | `(topic_id, prerequisite_id)` | Self-referencing prerequisite skill-tree network. |
| `questions` | `UUID` | Belongs to `topics(id)`, diagnostic JSONB options with misconception tags. |
| `quizzes` | `UUID` | Topic-level diagnostic evaluations. |
| `quiz_questions` | `(quiz_id, question_id)` | Junction mapping questions to quizzes with ordering. |
| `quiz_attempts` | `UUID` | Student attempts, score, percentage, pass/fail status. |
| `quiz_answers` | `UUID` | Individual responses evaluated with misconception tag and correctness. |
| `mastery` | `UUID` | Student concept mastery status (`mastered`, `shaky`, `developing`, `weak`). |
| `learning_progress` | `UUID` | Rolling confidence score, subject progress. |
| `ai_conversations` | `UUID` | History of AI Tutor interactions per student. |
| `mentor_students` | `UUID` | Assigned linkages between mentors and students. |

---

## 4. Row Level Security (RLS)

All tables have RLS enabled with explicit policies:
- **Profiles**: Students view/update their own profile; mentors view assigned students.
- **Educational Content**: Subjects, topics, and quizzes are readable publicly/authenticated; modifications restricted.
- **Attempts & Answers**: Students can only insert and read their own attempts; mentors can view assigned students.
- **Mastery & Progress**: Students can only read/update their own mastery records; assigned mentors have read access.
- **AI Conversations**: Strictly isolated to the owner `user_id`.
