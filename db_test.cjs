const dns = require('dns');
const fs = require('fs');

const envText = fs.readFileSync('.env', 'utf8');
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)$/);
  if (m) {
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
}

dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

(async () => {
  const out = { uriPresent: !!process.env.MONGODB_URI };
  try {
    const start = Date.now();
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      family: 4,
    });
    out.connected = true;
    out.connectMs = Date.now() - start;
    const admin = mongoose.connection.db.admin();
    const ping = await admin.ping();
    out.ping = ping;
    out.dbName = mongoose.connection.db.databaseName;
    out.collections = (await mongoose.connection.db.listCollections().toArray()).map(c => c.name);
    await mongoose.disconnect();
  } catch (e) {
    out.connected = false;
    out.error = { code: e.code, name: e.name, message: e.message };
  }
  fs.writeFileSync('db_test_result.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})();
