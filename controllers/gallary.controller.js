import { Gallary } from '../models/gallary.model.js'; // Import the Gallary model
import sharp from 'sharp';

export const addGallery = async (req, res) => {
    try {
        const { others, gallaryEnabled, userId } = req.body;

        // Compress image function
        const compressImage = async (base64Image) => {
            const base64Data = base64Image.split(';base64,').pop();
            const buffer = Buffer.from(base64Data, 'base64');
            const compressedBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();
            return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        };

        // Compress all images in the gallery, skipping invalid files
        const compressedImages = others[0].images.length
            ? await Promise.all(
                others[0].images.map(async (image) => {
                    // Skip invalid image files that don't start with 'data:image'
                    if (!image.file || !image.file.startsWith('data:image')) {
                        return null; // Return null for invalid images
                    }
                    // Compress the valid image and return the new compressed file
                    const compressedFile = await compressImage(image.file);
                    return { ...image, file: compressedFile }; // Assign compressed file back to image
                })
            )
            : [];

        // Filter out any null values (invalid images)
        others[0].images = compressedImages.filter(image => image !== null);

        // Create a new gallery document
        const newGallery = new Gallary({
            others,
            gallaryEnabled,
            userId,
        });

        await newGallery.save();
        res.status(201).json({ newGallery, success: true });
    } catch (error) {
        console.error('Error uploading gallery:', error);
        res.status(500).json({ message: 'Failed to upload gallery', success: false });
    }
};



// Get all Galleries
export const getGalleries = async (req, res) => {
    try {
        const galleries = await Gallary.find();
        if (!galleries) {
            return res.status(404).json({ message: "No galleries found", success: false });
        }
        return res.status(200).json({ galleries, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch galleries', success: false });
    }
};

// Get Gallery by ID
export const getGalleryById = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const gallery = await Gallary.findById(galleryId);
        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found", success: false });
        }
        return res.status(200).json({ gallery, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch gallery', success: false });
    }
};

// Update Gallery by ID
export const updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const {  others, gallaryEnabled, userId } = req.body;

        // Compress image function
        const compressImage = async (base64Image) => {
            const base64Data = base64Image.split(';base64,').pop();
            const buffer = Buffer.from(base64Data, 'base64');
            const compressedBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();
            return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        };

        // Compress all images in the gallery, skipping invalid files
        const compressedImages = others[0].images.length
            ? await Promise.all(
                others[0].images.map(async (image) => {
                    // Skip invalid image files that don't start with 'data:image'
                    if (!image.file || !image.file.startsWith('data:image')) {
                        return null; // Return null for invalid images
                    }
                    // Compress the valid image and return the new compressed file
                    const compressedFile = await compressImage(image.file);
                    return { ...image, file: compressedFile }; // Assign compressed file back to image
                })
            )
            : [];

        // Filter out any null values (invalid images)
        others[0].images = compressedImages.filter(image => image !== null);

        const updatedData = { others, gallaryEnabled, userId };

        const updatedGallery = await Gallary.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!updatedGallery) {
            return res.status(404).json({ message: "Gallery not found", success: false });
        }
        return res.status(200).json({ updatedGallery, success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete Gallery by ID
export const deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallary.findByIdAndDelete(id);
        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found", success: false });
        }
        return res.status(200).json({ gallery, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete gallery', success: false });
    }
};
