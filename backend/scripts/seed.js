const mongoose = require('mongoose');
const path = require('path');
const config = require('../config/env');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Mastery = require('../models/Mastery');

const { connectDB, disconnectDB } = require('../config/db');

const runSeed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Question.deleteMany({});
    await Quiz.deleteMany({});
    await Mastery.deleteMany({});
    // We will leave other collections empty for now (QuizAttempt, MentorStudent, etc)
    
    console.log('Seeding Users...');
    const student1 = await User.create({ email: 'student1@edusetu.in', password: 'password123', role: 'student' });
    const mentor1 = await User.create({ email: 'mentor1@edusetu.in', password: 'password123', role: 'mentor' });

    console.log('Seeding Subjects...');
    const math = await Subject.create({ name: 'Mathematics', slug: 'math', icon: '📐', gradeLevel: 8 });
    const science = await Subject.create({ name: 'Science', slug: 'science', icon: '🌿', gradeLevel: 8 });

    console.log('Seeding Topics...');
    const addition = await Topic.create({ name: 'Addition & Subtraction', slug: 'addition-subtraction', subject: math._id, gradeLevel: 8, description: 'Basic arithmetic operations.' });
    const algebra = await Topic.create({ name: 'Algebraic Expressions', slug: 'algebraic-expressions', subject: math._id, gradeLevel: 8, description: 'Variables and equations.', prerequisites: [addition._id] });
    const biology = await Topic.create({ name: 'Photosynthesis', slug: 'photosynthesis', subject: science._id, gradeLevel: 8, description: 'How plants make food.' });

    console.log('Seeding Questions & Quizzes...');
    // Algebra Questions
    const q1 = await Question.create({
      topic: algebra._id,
      text: 'What is the value of x in the equation 2x + 3 = 11?',
      options: [
        { text: 'x = 4', isCorrect: true },
        { text: 'x = 7', isCorrect: false, misconceptionTag: 'sign-error' },
        { text: 'x = 14', isCorrect: false, misconceptionTag: 'addition-instead-of-subtraction' }
      ],
      explanation: 'Subtract 3 from 11 to get 8, then divide by 2 to get x = 4.'
    });

    const q2 = await Question.create({
      topic: algebra._id,
      text: 'Simplify: 3x + 2y - x',
      options: [
        { text: '2x + 2y', isCorrect: true },
        { text: '4x + 2y', isCorrect: false, misconceptionTag: 'sign-error' },
        { text: '5xy', isCorrect: false, misconceptionTag: 'combining-unlike-terms' }
      ],
      explanation: 'Combine the like terms (3x and -x) to get 2x. The +2y remains the same.'
    });

    // Create Quiz
    const algebraQuiz = await Quiz.create({
      title: 'Algebra Basics Quiz',
      topic: algebra._id,
      questions: [q1._id, q2._id]
    });

    console.log('Seeding Student Profiles and Mastery...');
    await StudentProfile.create({
      user: student1._id,
      name: 'Aarav Sharma',
      grade: 8,
      language: 'en',
      enrolledSubjects: [math._id, science._id]
    });

    await Mastery.create({
      user: student1._id,
      topic: addition._id,
      status: 'mastered',
      confidenceLevel: 95
    });
    await Mastery.create({
      user: student1._id,
      topic: algebra._id,
      status: 'shaky',
      confidenceLevel: 40
    });

    console.log('Seed completed successfully!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

runSeed();
