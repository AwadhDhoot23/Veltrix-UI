require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User.models'); // Adjust path if needed
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdmin = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("✅ Connected to Database.\n");

    rl.question('Enter new admin username: ', (username) => {
      rl.question('Enter new admin email: ', (email) => {
        rl.question('Enter new admin password: ', async (password) => {
          try {
            // Check if user exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
              console.log("\n❌ Error: User with that email or username already exists!");
              process.exit(1);
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            await User.create({
              username,
              email,
              password: hashedPassword
            });

            console.log("\n🎉 Admin user created successfully!");
            console.log(`You can now log in with email: ${email}`);
          } catch (error) {
            console.error("\n❌ Error creating user:", error.message);
          } finally {
            mongoose.connection.close();
            rl.close();
            process.exit(0);
          }
        });
      });
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

createAdmin();
