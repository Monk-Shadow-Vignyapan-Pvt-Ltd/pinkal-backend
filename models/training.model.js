import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema({
    trainingName: { type: String, required: true ,unique: true },
    trainingDescription: { type: String, required: true },
    trainingImage: {
        type: String, // Store image as base64 or use a URL reference
        required: true,
    },
    
    others: {
        type: mongoose.Schema.Types.Mixed,  // Use Mixed for flexible structure (JSON-like object)
        required: false
    },
     trainingEnabled:{
        type:Boolean,
        required:true
     },
     trainingUrl: { type: String, required: true ,unique: true },
     oldUrls: {
        type: mongoose.Schema.Types.Mixed,  // Use Mixed for flexible structure (JSON-like object)
        required: false
    },
     seoTitle:{
        type: String,
        required: false,
      },
     seoDescription: {
        type: String,
        required: false,
      },
      schema: {
      type: String, // Store image as base64 or use a URL reference
      required: false,
    },
     userId:{
        type: mongoose.Schema.Types.ObjectId, 
          required:false
      }

}, { timestamps: true });

export const Training = mongoose.model("Training", trainingSchema);
