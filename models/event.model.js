// models/Doctor.js
import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: 'singleton',
    },
   image: {
        type: String,
        required: false,
        },
    title: {
        type: String,
        required: false,        
    },
    description: {
        type: String,   
        required: false,
    },
    date: {
        type: String,
        required: false,
        },
    
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
