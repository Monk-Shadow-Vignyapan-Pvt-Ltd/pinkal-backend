import mongoose from "mongoose";

// Define the schema for the appointment form data
const contactFollowupSchema = new mongoose.Schema({
    contactId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required:true
     },
    status: {
        type: String,
        required: true,
        trim: true,  // Removes leading and trailing whitespace
    },
    followupMessage: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Create the model from the schema
export const ContactFollowup = mongoose.model('ContactFollowup', contactFollowupSchema);


