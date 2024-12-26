import { Service } from '../models/service.model.js';
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sharp from 'sharp';

// Add a new service
export const addService = async (req, res) => {
    try {
        const { serviceName, serviceDescription, serviceImage,serviceType, beforeAfterImage,afterImage, whyChoose,whyChooseName, howWorks,howWorksName,beforeAfterGallary = [], others, categoryId, serviceEnabled,userId} = req.body;
        
        // Validate base64 image data
        if (!serviceImage || !serviceImage.startsWith('data:image') ) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const compressImage = async (base64Image) => {
            const base64Data = base64Image.split(';base64,').pop();
            const buffer = Buffer.from(base64Data, 'base64');
            const compressedBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();
            return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        };

        // Compress the main service image
        const compressedServiceBase64 = await compressImage(serviceImage);

        // Compress the before/after image
        if(beforeAfterImage && !beforeAfterImage.startsWith('data:image')){
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }
        let compressedBeforeAfterBase64 = '';

        if(beforeAfterImage){
            compressedBeforeAfterBase64 = await compressImage(beforeAfterImage);
        }

        console.log(compressedBeforeAfterBase64);

        if(afterImage && !afterImage.startsWith('data:image')){
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }
        let compressedAfterBase64 = '';

        if(afterImage){
            compressedAfterBase64 = await compressImage(afterImage);
        }

        // Compress all images in beforeAfterGallary array, if it exists and is not empty
        const compressedBeforeAfterGallary = beforeAfterGallary.length
            ? await Promise.all(
                  beforeAfterGallary.map(async (image) => {
                      if (!image.startsWith('data:image')) {
                          throw new Error('Invalid image in beforeAfterGallary');
                      }
                      return await compressImage(image);
                  })
              )
            : [];

        const service = new Service({
            serviceName,
            serviceDescription,
            serviceImage:compressedServiceBase64, // Store the base64 image data
            serviceType,
            beforeAfterImage:beforeAfterImage ? compressedBeforeAfterBase64 : beforeAfterImage, // Store the before/after base64 image data
            afterImage:afterImage ? compressedAfterBase64 : afterImage,
            whyChoose,
            whyChooseName,
            howWorks,
            howWorksName,
            beforeAfterGallary:compressedBeforeAfterGallary,
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
        const { serviceName, serviceDescription, serviceImage,serviceType, beforeAfterImage,afterImage, whyChoose,whyChooseName, howWorks,howWorksName,beforeAfterGallary = [], others, categoryId, serviceEnabled,userId } = req.body;

        // Validate base64 image data
        if (serviceImage && !serviceImage.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const compressImage = async (base64Image) => {
            const base64Data = base64Image.split(';base64,').pop();
            const buffer = Buffer.from(base64Data, 'base64');
            const compressedBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();
            return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        };

        // Compress the main service image
        const compressedServiceBase64 = await compressImage(serviceImage);

        if(beforeAfterImage && !beforeAfterImage.startsWith('data:image')){
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }
        let compressedBeforeAfterBase64 = '';
        if(beforeAfterImage){
            compressedBeforeAfterBase64 = await compressImage(beforeAfterImage);
        }

        if(afterImage && !afterImage.startsWith('data:image')){
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }
        let compressedAfterBase64 = '';

        if(afterImage){
            compressedAfterBase64 = await compressImage(afterImage);
        }

        // Compress all images in beforeAfterGallary array, if it exists and is not empty
        const compressedBeforeAfterGallary = beforeAfterGallary.length
            ? await Promise.all(
                  beforeAfterGallary.map(async (image) => {
                      if (!image.startsWith('data:image')) {
                          throw new Error('Invalid image in beforeAfterGallary');
                      }
                      return await compressImage(image);
                  })
              )
            : [];
        const updatedData = {
            serviceName,
            serviceDescription,
            ...(compressedServiceBase64 && { serviceImage: compressedServiceBase64 }), // Only update image if new image is provided
            serviceType,
            beforeAfterImage:beforeAfterImage ? compressedBeforeAfterBase64 : beforeAfterImage, // Only update before/after image if new image is provided
            afterImage:afterImage ? compressedAfterBase64 : afterImage,
            whyChoose,
            whyChooseName,
            howWorks,
            howWorksName,
            beforeAfterGallary:compressedBeforeAfterGallary,
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


export const getServicesFrontend = async (req, res) => {
    try {
        const services = await Service.find()
        .select('serviceName categoryId serviceType serviceEnabled')
        .populate('categoryId'); // Populating category data
        if (!services) return res.status(404).json({ message: "Services not found", success: false });
        return res.status(200).json({ services });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch services', success: false });
    }
};

export const getServicesBeforeAfter = async (req, res) => {
    try {
        const services = await Service.find()
        .select('serviceName beforeAfterGallary serviceEnabled');
        if (!services) return res.status(404).json({ message: "Services not found", success: false });
        return res.status(200).json({ services });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch services', success: false });
    }
};

// Clone service by ID
export const cloneService = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the service to clone
        const serviceToClone = await Service.findById(id);
        if (!serviceToClone) {
            return res.status(404).json({ message: "Service to clone not found!", success: false });
        }

        // Remove the _id field to avoid duplication error
        const clonedData = { ...serviceToClone.toObject() };
        delete clonedData._id;

        // Create a new service with the cloned data
        const clonedService = new Service(clonedData);
        await clonedService.save();

        return res.status(201).json({ clonedService, success: true });
    } catch (error) {
        console.error('Error cloning service:', error);
        res.status(500).json({ message: 'Failed to clone service', success: false });
    }
};


