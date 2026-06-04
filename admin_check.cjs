const dns = require('dns');
const fs = require('fs');
const envText = fs.readFileSync('.env', 'utf8');
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)$/);
  if (m) {
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[m[1]] = v;
  }
}
dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, family: 4 });
    const admins = await mongoose.connection.db.collection('admins').find({}, { projection: { password: 0 } }).toArray();
    console.log('Admins in DB:', JSON.stringify(admins, null, 2));
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
