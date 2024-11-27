import mongoose from "mongoose";
import { initializeDefaultStatuses } from "../controllers/status.controller.js";
import bcrypt from "bcryptjs"; // For hashing passwords
import { User } from "../models/user.model.js"; // Adjust path as needed


// Example: Your Mongoose model for the collection you want to query
import { SubService } from "../models/sub_service.model.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
        
        // Initialize default statuses (if required)
        await initializeDefaultStatuses();

        // Extract data from the specific collection
        // const data = await SubService.find(); // Find all documents in the collection

        // // // Print the extracted data
        // console.log('Data from YourCollection:');
        // console.log(data);

        const defaultAdminEmail = "admin@gmail.com";
    const defaultAdminPassword = "admin123"; // Plaintext password (for example)

    const existingUser = await User.findOne({ email: defaultAdminEmail });

    if (!existingUser) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 8);

      const defaultUser = new User({
        _id: new mongoose.Types.ObjectId("674053fefe934a5c26a74db3"), // Use the provided ObjectId
        email: defaultAdminEmail,
        password: hashedPassword, // Store hashed password
        username: "admin",
        isAdmin: true,
        roles: [
          { name: "Users", actions: { permission: true } },
          { name: "Banner", actions: { permission: true } },
          { name: "Category", actions: { permission: true } },
          { name: "Service", actions: { permission: true } },
          { name: "Testimonial", actions: { permission: true } },
          { name: "FAQs", actions: { permission: true } },
          { name: "Blogs", actions: { permission: true } },
          { name: "Contact", actions: { permission: true } },
          { name: "Survey", actions: { permission: true } },
          { name: "Seo", actions: { permission: true } },
        ],
      });

      await defaultUser.save();
      console.log("Default admin user created successfully.");
    } else {
      console.log("Default admin user already exists.");
    }

    } catch (error) {
        console.log('Failed to connect', error);
    }
}

export default connectDB;
