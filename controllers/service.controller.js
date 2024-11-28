import { Service } from '../models/service.model.js';
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sharp from 'sharp';

// Add a new service
export const addService = async (req, res) => {
    try {
        const { serviceName, serviceDescription, serviceImage,serviceType, beforeAfterImage, whyChoose, howWorks,beforeAfterGallary, others, categoryId, serviceEnabled,userId} = req.body;
        
        // Validate base64 image data
        if (!serviceImage || !serviceImage.startsWith('data:image') || !beforeAfterImage || !beforeAfterImage.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const base64Data = serviceImage.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // Resize and compress the image using sharp
        const compressedBuffer = await sharp(buffer)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedServiceBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

        const base64beforeAfterData = beforeAfterImage.split(';base64,').pop();
        const bufferbeforeAfter = Buffer.from(base64beforeAfterData, 'base64');

        // Resize and compress the image using sharp
        const compressedbeforeAfterBuffer = await sharp(bufferbeforeAfter)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedbeforeAfterBase64 = `data:image/jpeg;base64,${compressedbeforeAfterBuffer.toString('base64')}`;



        const service = new Service({
            serviceName,
            serviceDescription,
            serviceImage:compressedServiceBase64, // Store the base64 image data
            serviceType,
            beforeAfterImage:compressedbeforeAfterBase64, // Store the before/after base64 image data
            whyChoose,
            howWorks,
            beforeAfterGallary,
            others,
            categoryId,
            serviceEnabled,
            userId
        });

        await service.save();
        res.status(201).json({ service, success: true });
    } catch (error) {
        console.error('Error uploading service:', error);
        res.status(500).json({ message: 'Failed to upload service', success: false });
    }
};

// Get all services
export const getServices = async (req, res) => {
    try {
        const services = await Service.find().populate('categoryId'); // Populating category data
        if (!services) return res.status(404).json({ message: "Services not found", success: false });
        return res.status(200).json({ services });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch services', success: false });
    }
};

// Get service by ID
export const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId).populate('categoryId'); // Populating category data
        if (!service) return res.status(404).json({ message: "Service not found!", success: false });
        return res.status(200).json({ service, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch service', success: false });
    }
};

// Update service by ID
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { serviceName, serviceDescription, serviceImage,serviceType, beforeAfterImage, whyChoose, howWorks,beforeAfterGallary, others, categoryId, serviceEnabled,userId } = req.body;

        // Validate base64 image data
        if (serviceImage && !serviceImage.startsWith('data:image') || beforeAfterImage && !beforeAfterImage.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const base64Data = serviceImage.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // Resize and compress the image using sharp
        const compressedBuffer = await sharp(buffer)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedServiceBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

        const base64beforeAfterData = beforeAfterImage.split(';base64,').pop();
        const bufferbeforeAfter = Buffer.from(base64beforeAfterData, 'base64');

        // Resize and compress the image using sharp
        const compressedbeforeAfterBuffer = await sharp(bufferbeforeAfter)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedbeforeAfterBase64 = `data:image/jpeg;base64,${compressedbeforeAfterBuffer.toString('base64')}`;

        const updatedData = {
            serviceName,
            serviceDescription,
            ...(compressedServiceBase64 && { serviceImage: compressedServiceBase64 }), // Only update image if new image is provided
            serviceType,
            ...(compressedbeforeAfterBase64 && { beforeAfterImage:compressedbeforeAfterBase64 }), // Only update before/after image if new image is provided
            whyChoose,
            howWorks,
            beforeAfterGallary,
            others,
            categoryId,
            serviceEnabled,
            userId
        };

        const service = await Service.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!service) return res.status(404).json({ message: "Service not found!", success: false });
        return res.status(200).json({ service, success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete service by ID
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByIdAndDelete(id);
        if (!service) return res.status(404).json({ message: "Service not found!", success: false });
        return res.status(200).json({ service, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete service', success: false });
    }
};
