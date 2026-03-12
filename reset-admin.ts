import connectDB from "./src/lib/mongodb";
import Admin from "./src/models/Admin";
import mongoose from "mongoose";

async function resetPassword() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    
    const username = "admin"; // Change if your username is different
    const newPassword = "Admin123!"; // This is the temporary password
    
    console.log(`Resetting password for user: ${username}`);
    
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.error("Admin user not found. Please check the username.");
      process.exit(1);
    }
    
    admin.password = newPassword;
    await admin.save();
    
    console.log("-----------------------------------------");
    console.log("SUCCESS: Password has been reset.");
    console.log(`Username: ${username}`);
    console.log(`Temporary Password: ${newPassword}`);
    console.log("Please login and change your password immediately.");
    console.log("-----------------------------------------");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error resetting password:", error);
    process.exit(1);
  }
}

resetPassword();
