// models/Doctor.js
import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    title:{
      type: String, 
      required: true,
     },
    description:{
      type: String, // Store image as base64 or use a URL reference
      required: true,
    },
    priceType:{
        type: String, // Store image as base64 or use a URL reference
        required: true,
      },
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
          required:false
      }
    
}, { timestamps: true });

export const Price = mongoose.model("Price", priceSchema);
