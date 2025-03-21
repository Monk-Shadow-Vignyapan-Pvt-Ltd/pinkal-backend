// models/Doctor.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    title:{
      type: String, 
      required: true,
     },
    image:{
      type: String, // Store image as base64 or use a URL reference
      required: true,
    },
    description:{
      type: String, // Store image as base64 or use a URL reference
      required: true,
    },
    
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
          required:false
      }
    
}, { timestamps: true });

export const Team = mongoose.model("Team", teamSchema);
