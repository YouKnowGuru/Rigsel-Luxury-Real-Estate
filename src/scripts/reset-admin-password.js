const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

function loadEnv() {
    const envPath = path.join(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^#=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
                process.env[key] = value;
            }
        });
    }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const NEW_PASSWORD = process.argv[2] || 'admin123';

async function resetPassword() {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const AdminSchema = new mongoose.Schema({
            username: { type: String, unique: true },
            password: { type: String },
            role: { type: String, default: 'admin' }
        });

        const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

        let admin = await Admin.findOne({ username: ADMIN_USERNAME });

        if (admin) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);
            await Admin.updateOne({ _id: admin._id }, { password: hashedPassword });
            console.log(`Password reset successfully for admin: ${admin.username}`);
            console.log(`New password: ${NEW_PASSWORD}`);
        } else {
            console.log(`Admin user '${ADMIN_USERNAME}' not found in database.`);
            console.log('Creating new admin user...');
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);
            await Admin.create({
                username: ADMIN_USERNAME,
                password: hashedPassword,
                role: 'superadmin'
            });
            console.log(`Admin user created: ${ADMIN_USERNAME} / ${NEW_PASSWORD}`);
        }

        await mongoose.connection.close();
        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetPassword();
