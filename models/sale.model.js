// models/Doctor.js
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    serviceId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    saleDescription: {
        type: String,
        required: true,
      },
      rank:{
        type: String, // Store image as base64 or use a URL reference
        required: true,    
      },
      saleEnabled:{
        type:Boolean,
        required:true
     },
     userId:{
             type: mongoose.Schema.Types.ObjectId, 
               required:false
           }
      
    
}, { timestamps: true });

export const Sale = mongoose.model("Sale", saleSchema);
