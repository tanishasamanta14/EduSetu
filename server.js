/* ============================================================
   EduSetu — Main Server Entry Point
   Initializes configurations and starts the Express application.
   ============================================================ */

'use strict';

const app = require('./server/app');
const config = require('./server/config/env');
const { connectDB } = require('./server/config/db');

// Connect to Database and start server
connectDB().then(async () => {
  // If memory server is used, seed it automatically so frontend has data
  if (config.mongoUri.includes('localhost')) {
    console.log('Detected Memory Server. Auto-seeding for development...');
    try {
      const User = require('./server/models/User');
      if (await User.countDocuments() === 0) {
        // Quick seed
        const Subject = require('./server/models/Subject');
        const Topic = require('./server/models/Topic');
        const StudentProfile = require('./server/models/StudentProfile');
        
        const testUser = await User.create({ email: 'student1@edusetu.in', password: 'password123', role: 'student' });
        await StudentProfile.create({ user: testUser._id, name: 'Aarav Sharma', grade: 8, language: 'en' });

        const math = await Subject.create({ name: 'Mathematics', slug: 'math', icon: '📐', gradeLevel: 8 });
        const algebraTopic = await Topic.create({ name: 'Algebraic Expressions', slug: 'algebraic-expressions', subject: math._id, gradeLevel: 8, difficulty: 'intermediate', description: 'Variables and equations.' });
        await Topic.create({ name: 'Calculus', slug: 'calculus', subject: math._id, gradeLevel: 12, difficulty: 'advanced', description: 'Differentiation and integration.' });
        
        // Seed Quiz & Questions
        const Quiz = require('./server/models/Quiz');
        const Question = require('./server/models/Question');
        
        const q1 = await Question.create({
          topic: algebraTopic._id,
          text: 'What is the value of x in 2x = 10?',
          options: [
            { text: '5', isCorrect: true },
            { text: '8', isCorrect: false, misconceptionTag: 'subtraction-error' },
            { text: '20', isCorrect: false, misconceptionTag: 'multiplication-error' }
          ],
          difficulty: 'easy'
        });

        const q2 = await Question.create({
          topic: algebraTopic._id,
          text: 'Simplify: 3x + 2x',
          options: [
            { text: '5x', isCorrect: true },
            { text: '6x', isCorrect: false, misconceptionTag: 'multiplication-instead' },
            { text: '5x^2', isCorrect: false, misconceptionTag: 'exponent-error' }
          ],
          difficulty: 'easy'
        });

        await Quiz.create({
          title: 'Algebra Basics Quiz',
          topic: algebraTopic._id,
          questions: [q1._id, q2._id]
        });

        // Seed Mentor
        const MentorStudent = require('./server/models/MentorStudent');
        const mentorUser = await User.create({ email: 'mentor1@edusetu.in', password: 'password123', role: 'mentor' });
        await MentorStudent.create({ mentor: mentorUser._id, student: testUser._id });
        
      }
    } catch(e) { console.error('Auto-seed failed', e); }
  }

// Start Server
const server = app.listen(config.port, '127.0.0.1', () => {
  const hasKey = !!(config.grokApiKey && config.grokApiKey !== 'your-grok-api-key-here');
  
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log(`  ║   EduSetu Server running on port ${config.port.toString().padEnd(4)}    ║`);
  console.log(`  ║   http://localhost:${config.port.toString().padEnd(20)}  ║`);
  console.log('  ╠══════════════════════════════════════════╣');
  
  if (hasKey) {
    console.log('  ║   ✅ Grok API key loaded                 ║');
  } else {
    console.log('  ║   ⚠️  Grok API key NOT configured        ║');
    console.log('  ║   → Edit .env and add your key           ║');
  }
  
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});

}); // End of connectDB().then()

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
