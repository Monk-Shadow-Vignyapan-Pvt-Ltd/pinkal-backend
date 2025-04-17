import mongoose from "mongoose";
import { initializeDefaultStatuses } from "../controllers/status.controller.js";
import bcrypt from "bcryptjs"; // For hashing passwords
import { User } from "../models/user.model.js"; // Adjust path as needed
import archiver from 'archiver'; // Import archiver for zip compression
import { fileURLToPath } from 'url';

// Example: Your Mongoose model for the collection you want to query
import { SubService } from "../models/sub_service.model.js";
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import cron from 'node-cron';
import { exec } from 'child_process';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

// MongoDB configurations
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const DB_URI = process.env.MONGO_URI;

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'clathiya403@gmail.com',
//     pass: 'mepf llze qmlf cauf',
//   },
// });

// export const backupMongoDB = () => {
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const backupDir = path.join(__dirname, '../../backups'); // Adjust path if necessary
//     const dumpDir = path.join(backupDir, `dump-${timestamp}`);
//     const zipPath = path.join(backupDir, `backup-${timestamp}.zip`);
//     const dumpCommand = `mongodump --uri="${DB_URI}" --out="${dumpDir}"`;
  
//     exec(dumpCommand, (error, stdout, stderr) => {
//         if (error) {
//             console.error('❌ Dump Error:', error.message);
//         }
//         if (stderr) {
//            // console.error('❌ Dump STDERR:', stderr);
//         }
//         if (stdout) {
//             console.log('✅ Dump STDOUT:', stdout);
//         }
  
//       console.log('✅ MongoDB dump successful.');
  
//       // Create ZIP from dump folder
//       const output = fs.createWriteStream(zipPath);
//       const archive = archiver('zip', { zlib: { level: 9 } });
  
//       output.on('close', () => {
//         console.log(`✅ ZIP created: ${zipPath} (${archive.pointer()} bytes)`);
  
//         // Send email and cleanup
//         const mailOptions = {
//           from: 'clathiya403@gmail.com',
//           to: 'chirag@monkshadow.com', // Change this to your actual email
//           subject: 'Daily Database Backup',
//           text: 'Attached is the daily MongoDB backup.',
//           attachments: [
//             {
//               filename: path.basename(zipPath),
//               path: zipPath,
//             },
//           ],
//         };
  
//         transporter.sendMail(mailOptions, (emailErr, info) => {
//           if (emailErr) {
//             console.error('❌ Email Error:', emailErr);
//           } else {
//             console.log('📧 Backup email sent:', info.response);
//           }
  
//           // Cleanup ZIP & dump folder regardless of email success
//           try {
//             if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
//             if (fs.existsSync(dumpDir)) fs.rmSync(dumpDir, { recursive: true, force: true });
//             console.log('🧹 Cleaned up ZIP and dump folder.');
//           } catch (cleanupErr) {
//             console.error('❌ Cleanup error:', cleanupErr);
//           }
//         });
//       });
  
//       archive.on('error', err => {
//         console.error('❌ Archiving error:', err);
//       });
  
//       archive.pipe(output);
//       archive.directory(dumpDir, false);
//       archive.finalize();
//     });
//   };
  

// // Cron job to schedule backup every 7 days
// cron.schedule('0 0 * * *', () => {
//     backupMongoDB(); // Trigger backup every day at midnight
//   });
  
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
        
        // Initialize default statuses (if required)
        await initializeDefaultStatuses();

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
                    { name: "News-Letter", actions: { permission: true } },
                    { name: 'Sale', actions: { permission: true, } },
                ],
            });

            await defaultUser.save();
            console.log("Default admin user created successfully.");
        } else {
            console.log("Default admin user already exists.");
        }

        // const collections = await mongoose.connection.db.listCollections().toArray();
        // const allCollectionsData = {};

        // // Loop through each collection and fetch data
        // for (const collection of collections) {
        //     const collectionName = collection.name;
        //     const collectionData = await mongoose.connection.db.collection(collectionName).find().toArray();

        //     // Sanitize collection name and its data
        //     allCollectionsData[collectionName] = collectionData;
        // }

        // // Create a temporary JSON file
        // const filePath = './database_data.json';
        // const jsonData = JSON.stringify(allCollectionsData, null, 2);

        // // Write the raw JSON file (it will be compressed later)
        // fs.writeFileSync(filePath, jsonData);
        // console.log("JSON file generated successfully.");

        // // Now create a zip archive containing the JSON file
        // const zipFilePath = './database_data.zip'; // The destination zip file path
        // const output = fs.createWriteStream(zipFilePath);
        // const archive = archiver('zip', { zlib: { level: 9 } }); // level 9 for maximum compression

        // // Pipe archive data to the output file
        // archive.pipe(output);

        // // Append the JSON file to the ZIP archive
        // archive.file(filePath, { name: 'database_data.json' });

        // // Finalize the archive (this will start the compression process)
        // await archive.finalize();

        // console.log("ZIP file created successfully.");

        // // Clean up the temporary JSON file if you don't need it anymore
        // fs.unlinkSync(filePath);

        // // Return the path to the generated ZIP file
        // return zipFilePath;

    } catch (error) {
        console.log('Failed to connect or create zip file', error);
    }
}

export default connectDB;
