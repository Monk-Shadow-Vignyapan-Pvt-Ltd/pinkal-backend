// models/Doctor.js
import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({
    pageName:{
        type: String,
        required: true,
    },
    seoTitle: {
        type: String,
        required: true,
      },
    blogOrServiceId:{
        type: mongoose.Schema.Types.ObjectId, 
        required:false
      },
      seoDescription: {
        type: String,
        required: false,
      },
      seoUrl:{
        type: String,
        required: true,
      },
       oldUrls: {
              type: mongoose.Schema.Types.Mixed,  // Use Mixed for flexible structure (JSON-like object)
              required: false
          },
    
}, { timestamps: true });

export const Seo = mongoose.model("Seo", seoSchema);
