const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Component = require('./src/models/Component.models.js');

dotenv.config({ path: './.env' });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Re-Seeding...');

    const components = await Component.find();
    if (components.length === 0) {
      console.log('No components found in DB.');
      process.exit(1);
    }

    const slugsMap = {
      'grid-shadow-button': 'GridShadowButton.jsx',
      'spotlight-card': 'SpotlightCard.jsx',
      'spinning-border': 'SpinningBorder.jsx'
    };

    for (let comp of components) {
      if (slugsMap[comp.slug]) {
        const filePath = path.join(__dirname, '..', 'src', 'ui', slugsMap[comp.slug]);
        if (fs.existsSync(filePath)) {
          const actualCode = fs.readFileSync(filePath, 'utf-8');
          comp.code = actualCode;
          await comp.save();
          console.log(`Updated code for ${comp.slug}`);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      }
    }

    console.log('Successfully re-seeded database with full original code!');
    process.exit(0);
  } catch (error) {
    console.error('Re-Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
