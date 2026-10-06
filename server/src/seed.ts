import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import { User, Transaction, CategoryBudget, GeneralBudget } from './models/index.js';
import mongoose from 'mongoose';

/**
 * Seeds the database with the same data that was in db.json.
 * Run with: npm run seed
 */
async function seed() {
  await connectDB();

  console.log('Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Transaction.deleteMany({}),
    CategoryBudget.deleteMany({}),
    GeneralBudget.deleteMany({}),
  ]);

  console.log('Cleared existing data');

  // Create user with hashed password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('1!Qwerty', salt);

  const user = await User.create({
    username: 'user',
    password: hashedPassword,
  });

  const userId = user._id;
  console.log(`Created user: "${user.username}" (password: 1!Qwerty)`);

  // Seed transactions
  const transactions = [
    { userId, category: 'salary', description: 'October salary', amount: 1100, timestamp: '2025-10-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'groceries', description: 'Supermarket', amount: 85, timestamp: '2025-10-05T17:40:00.000Z', type: 'expense' },
    { userId, category: 'salary', description: 'November salary', amount: 1100, timestamp: '2025-11-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'entertainment', description: 'Cinema', amount: 30, timestamp: '2025-11-12T20:15:00.000Z', type: 'expense' },
    { userId, category: 'salary', description: 'December salary', amount: 1100, timestamp: '2025-12-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'shopping', description: 'Winter jacket', amount: 280, timestamp: '2025-12-04T16:10:00.000Z', type: 'expense' },
    { userId, category: 'groceries', description: 'Groceries', amount: 95, timestamp: '2025-12-10T18:30:00.000Z', type: 'expense' },
    { userId, category: 'salary', description: 'January salary', amount: 1200, timestamp: '2026-01-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'groceries', description: 'Monthly groceries', amount: 600, timestamp: '2026-01-03T12:20:00.000Z', type: 'expense' },
    { userId, category: 'dining_out', description: 'Restaurant', amount: 45, timestamp: '2026-01-04T19:10:00.000Z', type: 'expense' },
    { userId, category: 'transportation', description: 'Gas', amount: 60, timestamp: '2026-01-06T08:30:00.000Z', type: 'expense' },
    { userId, category: 'health_hygiene', description: 'Doctor checkup', amount: 150, timestamp: '2026-01-08T15:45:00.000Z', type: 'expense' },
    { userId, category: 'entertainment', description: 'Bar with friends', amount: 55, timestamp: '2026-01-10T21:00:00.000Z', type: 'expense' },
    { userId, category: 'freelance', description: 'Web design project', amount: 450, timestamp: '2026-02-01T10:15:00.000Z', type: 'income' },
    { userId, category: 'investments', description: 'Dividend payment', amount: 120, timestamp: '2026-02-01T11:30:00.000Z', type: 'income' },
    { userId, category: 'groceries', description: 'Weekly groceries', amount: 150, timestamp: '2026-02-01T09:45:00.000Z', type: 'expense' },
    { userId, category: 'dining_out', description: 'Lunch', amount: 25, timestamp: '2026-02-01T13:00:00.000Z', type: 'expense' },
    { userId, category: 'transportation', description: 'Monthly bus pass', amount: 40, timestamp: '2026-02-01T08:20:00.000Z', type: 'expense' },
    { userId, category: 'rent_housing', description: 'February rent', amount: 500, timestamp: '2026-02-01T00:01:00.000Z', type: 'expense' },
    { userId, category: 'entertainment', description: 'Netflix subscription', amount: 15, timestamp: '2026-02-01T14:30:00.000Z', type: 'expense' },
    { userId, category: 'health_hygiene', description: 'Prescription refill', amount: 35, timestamp: '2026-02-01T11:00:00.000Z', type: 'expense' },
    { userId, category: 'shopping', description: 'New shoes', amount: 120, timestamp: '2026-02-01T15:45:00.000Z', type: 'expense' },
    { userId, category: 'salary', description: 'February salary', amount: 1500, timestamp: '2026-02-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'salary', description: 'March salary', amount: 1500, timestamp: '2026-03-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'freelance', description: 'Landing page project', amount: 600, timestamp: '2026-03-05T14:00:00.000Z', type: 'income' },
    { userId, category: 'investments', description: 'ETF dividend', amount: 140, timestamp: '2026-03-07T10:30:00.000Z', type: 'income' },
    { userId, category: 'groceries', description: 'Monthly groceries', amount: 420, timestamp: '2026-03-03T18:00:00.000Z', type: 'expense' },
    { userId, category: 'dining_out', description: 'Weekend dinner', amount: 90, timestamp: '2026-03-08T20:00:00.000Z', type: 'expense' },
    { userId, category: 'transportation', description: 'Fuel refill', amount: 130, timestamp: '2026-03-06T09:00:00.000Z', type: 'expense' },
    { userId, category: 'rent_housing', description: 'March rent', amount: 500, timestamp: '2026-03-01T00:01:00.000Z', type: 'expense' },
    { userId, category: 'entertainment', description: 'Concert ticket', amount: 120, timestamp: '2026-03-10T19:30:00.000Z', type: 'expense' },
    { userId, category: 'health_hygiene', description: 'Gym membership', amount: 80, timestamp: '2026-03-04T12:00:00.000Z', type: 'expense' },
    { userId, category: 'shopping', description: 'Spring clothes', amount: 200, timestamp: '2026-03-09T16:00:00.000Z', type: 'expense' },
    { userId, category: 'salary', description: 'April salary', amount: 1500, timestamp: '2026-04-01T09:00:00.000Z', type: 'income' },
    { userId, category: 'freelance', description: 'UI redesign project', amount: 500, timestamp: '2026-04-05T14:00:00.000Z', type: 'income' },
    { userId, category: 'investments', description: 'Stock dividends', amount: 130, timestamp: '2026-04-07T10:30:00.000Z', type: 'income' },
    { userId, category: 'groceries', description: 'Weekly groceries', amount: 350, timestamp: '2026-04-03T18:00:00.000Z', type: 'expense' },
    { userId, category: 'dining_out', description: 'Dinner out', amount: 70, timestamp: '2026-04-06T20:00:00.000Z', type: 'expense' },
    { userId, category: 'transportation', description: 'Fuel', amount: 100, timestamp: '2026-04-04T09:00:00.000Z', type: 'expense' },
    { userId, category: 'rent_housing', description: 'April rent', amount: 500, timestamp: '2026-04-01T00:01:00.000Z', type: 'expense' },
    { userId, category: 'entertainment', description: 'Movie night', amount: 60, timestamp: '2026-04-08T19:30:00.000Z', type: 'expense' },
    { userId, category: 'health_hygiene', description: 'Pharmacy', amount: 90, timestamp: '2026-04-02T12:00:00.000Z', type: 'expense' },
    { userId, category: 'shopping', description: 'Electronics accessories', amount: 180, timestamp: '2026-04-09T16:00:00.000Z', type: 'expense' },
  ];

  await Transaction.insertMany(transactions);
  console.log(`Created ${transactions.length} transactions`);

  // Seed category budgets
  const categoryBudgets = [
    { userId, category: 'groceries', limit: 500, month: '2025-12' },
    { userId, category: 'shopping', limit: 300, month: '2025-12' },
    { userId, category: 'groceries', limit: 500, month: '2026-01' },
    { userId, category: 'transportation', limit: 180, month: '2026-01' },
    { userId, category: 'health_hygiene', limit: 250, month: '2026-01' },
    { userId, category: 'entertainment', limit: 150, month: '2026-01' },
    { userId, category: 'dining_out', limit: 450, month: '2026-01' },
    { userId, category: 'groceries', limit: 500, month: '2026-02' },
    { userId, category: 'transportation', limit: 160, month: '2026-02' },
    { userId, category: 'health_hygiene', limit: 200, month: '2026-02' },
    { userId, category: 'entertainment', limit: 10, month: '2026-02' },
    { userId, category: 'dining_out', limit: 150, month: '2026-02' },
    { userId, category: 'groceries', limit: 500, month: '2026-03' },
    { userId, category: 'dining_out', limit: 200, month: '2026-03' },
    { userId, category: 'transportation', limit: 180, month: '2026-03' },
    { userId, category: 'rent_housing', limit: 500, month: '2026-03' },
    { userId, category: 'entertainment', limit: 150, month: '2026-03' },
    { userId, category: 'health_hygiene', limit: 220, month: '2026-03' },
    { userId, category: 'shopping', limit: 300, month: '2026-03' },
    { userId, category: 'groceries', limit: 500, month: '2026-04' },
    { userId, category: 'dining_out', limit: 200, month: '2026-04' },
    { userId, category: 'transportation', limit: 180, month: '2026-04' },
    { userId, category: 'rent_housing', limit: 500, month: '2026-04' },
    { userId, category: 'entertainment', limit: 150, month: '2026-04' },
    { userId, category: 'health_hygiene', limit: 220, month: '2026-04' },
  ];

  await CategoryBudget.insertMany(categoryBudgets);
  console.log(`Created ${categoryBudgets.length} category budgets`);

  // Seed general budgets
  const generalBudgets = [
    { userId, month: '2025-12', totalLimit: 2000 },
    { userId, month: '2026-01', totalLimit: 2200 },
    { userId, month: '2026-02', totalLimit: 2200 },
    { userId, month: '2026-03', totalLimit: 2500 },
    { userId, month: '2026-04', totalLimit: 2600 },
  ];

  await GeneralBudget.insertMany(generalBudgets);
  console.log(`   Created ${generalBudgets.length} general budgets`);

  console.log('\nDatabase seeded successfully!');
  console.log('Login: username="user", password="1!Qwerty"');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
