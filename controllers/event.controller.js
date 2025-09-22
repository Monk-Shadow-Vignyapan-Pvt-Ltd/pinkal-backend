import { Event } from "../models/event.model.js";
import sharp from 'sharp';

// Create or Update (Upsert) Singleton Event
export const upsertEvent = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            date,
        } = req.body;

        const processedData = { 
            title,
            description,
            date, };

        // Helper function to process base64 image to WebP
        const compressToWebP = async (base64Image) => {
            const base64Data = base64Image.split(';base64,').pop();
            const buffer = Buffer.from(base64Data, 'base64');
            const webpBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside' }) // optional resize
                .webp({ quality: 80 })
                .toBuffer();
            return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
        };

        if (image && image.startsWith('data:image')) {
            processedData.image = await compressToWebP(image);
        } else {
            processedData.image = ""; // save empty string if no image provided
        }


        const updatedEvent = await Event.findByIdAndUpdate(
            'singleton',
            processedData,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({ event: updatedEvent, success: true });
    } catch (error) {
        console.error('Error upserting event:', error);
        res.status(500).json({ message: 'Failed to upsert event', success: false });
    }
};

// Fetch Singleton Event
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById('singleton');

        if (!event) {
            return res.status(404).json({ message: 'Event not found', success: false });
        }

        res.status(200).json({ event, success: true });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Failed to fetch event', success: false });
    }
};

