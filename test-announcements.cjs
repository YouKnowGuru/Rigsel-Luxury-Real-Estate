const mongoose = require('mongoose');

async function test() {
  try {
    // Read .env file
    const fs = require('fs');
    const envContent = fs.readFileSync('.env', 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const [key, ...val] = line.split('=');
      if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
    });
    
    const uri = env.MONGODB_URI;
    if (!uri) {
      console.log('MONGODB_URI not found in .env');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Get Announcement model
    const announcementSchema = new mongoose.Schema({
      title: String,
      content: String,
      summary: String,
      category: String,
      priority: String,
      isPinned: Boolean,
      isPublished: Boolean,
      publishedAt: Date,
      expiresAt: Date,
      coverImage: String,
      author: String,
      viewCount: Number,
    }, { timestamps: true });
    
    const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
    
    // Count all announcements
    const total = await Announcement.countDocuments();
    console.log('Total announcements in DB:', total);
    
    // Show all announcements
    const all = await Announcement.find().lean();
    console.log('\nAll announcements:');
    all.forEach(a => {
      console.log('  -', a.title, '| published:', a.isPublished, '| publishedAt:', a.publishedAt, '| expiresAt:', a.expiresAt);
    });
    
    // Test the public query
    const now = new Date();
    const publicQuery = {
      isPublished: true,
      publishedAt: { $lte: now },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    };
    
    const publicCount = await Announcement.countDocuments(publicQuery);
    console.log('\nPublic query matches:', publicCount);
    
    // Test with $and
    const andQuery = {
      $and: [
        { isPublished: true },
        { publishedAt: { $lte: now } },
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: now } },
          ],
        },
      ],
    };
    
    const andCount = await Announcement.countDocuments(andQuery);
    console.log('$and query matches:', andCount);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected');
  }
}

test();
