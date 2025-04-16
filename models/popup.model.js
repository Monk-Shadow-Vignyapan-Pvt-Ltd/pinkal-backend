import mongoose from "mongoose";

const popupSchema = new mongoose.Schema({
    popupImage: {
        type: String, // Store image as base64 or use a URL reference
        required: true,
      },
    popupUrl:{
      type: String, // Store image as base64 or use a URL reference
      required: true,
    },
    time:{
        type: Number, // Store image as base64 or use a URL reference
        required: false, 
    },
    popupEnabled : {
        type: Boolean,  // Boolean field to indicate if a sub-service exists
        required: true,
    },
    
}, { timestamps: true });

export const Popup = mongoose.model("Popup", popupSchema);
