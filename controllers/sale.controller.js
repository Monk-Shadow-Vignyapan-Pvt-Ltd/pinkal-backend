import { Sale } from '../models/sale.model.js';
import { Service } from '../models/service.model.js';
import { SubService } from '../models/sub_service.model.js';
import sharp from 'sharp';

// Add a new sale
export const addSale = async (req, res) => {
    try {
        let { serviceId, saleDescription, rank,others, saleEnabled, userId } = req.body;
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
        
                // Compress all images in the gallery
                const compressAllImages = async (others) => {
                    if (!Array.isArray(others)) return []; // Return empty array if others is not valid
        
                    return await Promise.all(
                        others.map(async (item) => {
                            try {
                                if (!Array.isArray(item.images)) {
                                    return item;
                                }
        
                                const compressedImages = await Promise.all(
                                    item.images.map(async (image) => {
                                        if (!image.file || !image.file.startsWith('data:image')) {
                                            return null;
                                        }
                                        const compressedFile = await compressImage(image.file);
                                        return { ...image, file: compressedFile };
                                    })
                                );
        
                                return { ...item, images: compressedImages.filter(image => image !== null) };
                            } catch (err) {
                                console.error("Error processing item:", item, err);
                                return item; // Fallback to original item if error occurs
                            }
                        })
                    );
                };
        
                // Process and compress images
                others = await compressAllImages(others);
        
        const sale = new Sale({
            serviceId,
            saleDescription,
            rank,
            others,
            saleEnabled,
            userId
        });

        await sale.save();
        res.status(201).json({ sale, success: true });
    } catch (error) {
        console.error('Error adding sale:', error);
        res.status(500).json({ message: 'Failed to add sale', success: false });
    }
};

// Get all sales
export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find();
        const enhancedSales = await Promise.all(
            sales.map(async (sale) => {

                const service =await Service.findOne({ _id: sale.serviceId});
                const subService = await SubService.findOne({ _id: sale.serviceId});
                
                if (service) {
                    const serviceImage = service.serviceImage ;
                    return { ...sale.toObject(), serviceImage }; // Convert Mongoose document to plain object
                }else if(subService){
                    const serviceImage = subService.subServiceImage ;
                    return { ...sale.toObject(), serviceImage }; // Convert Mongoose document to plain object
                }

                return sale.toObject(); // If no invoiceId, return appointment as-is
            })
        );
        if (!enhancedSales) return res.status(404).json({ message: "No sales found", success: false });
        return res.status(200).json({ sales: enhancedSales, success: true });
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Failed to fetch sales', success: false });
    }
};

// Get sale by ID
export const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: "Sale not found", success: false });
        return res.status(200).json({ sale, success: true });
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ message: 'Failed to fetch sale', success: false });
    }
};

// Update sale by ID
export const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        let { serviceId, saleDescription, rank,others, saleEnabled, userId } = req.body;

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

        // Compress all images in the gallery
        const compressAllImages = async (others) => {
            if (!Array.isArray(others)) return []; // Return empty array if others is not valid

            return await Promise.all(
                others.map(async (item) => {
                    try {
                        if (!Array.isArray(item.images)) {
                            return item;
                        }

                        const compressedImages = await Promise.all(
                            item.images.map(async (image) => {
                                if (!image.file || !image.file.startsWith('data:image')) {
                                    return null;
                                }
                                const compressedFile = await compressImage(image.file);
                                return { ...image, file: compressedFile };
                            })
                        );

                        return { ...item, images: compressedImages.filter(image => image !== null) };
                    } catch (err) {
                        console.error("Error processing item:", item, err);
                        return item; // Fallback to original item if error occurs
                    }
                })
            );
        };

        // Process and compress images
        others = await compressAllImages(others);
        
        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { serviceId, saleDescription, rank,others, saleEnabled, userId },
            { new: true, runValidators: true }
        );

        if (!updatedSale) return res.status(404).json({ message: "Sale not found", success: false });
        return res.status(200).json({ updatedSale, success: true });
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete sale by ID
export const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSale = await Sale.findByIdAndDelete(id);
        if (!deletedSale) return res.status(404).json({ message: "Sale not found", success: false });
        return res.status(200).json({ deletedSale, success: true });
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ message: 'Failed to delete sale', success: false });
    }
};

// Update sale rank
export const updateSaleRank = async (req, res) => {
    try {
        const { id, direction } = req.body;
        
        const sale = await Sale.findById(id);
        if (!sale) return res.status(404).json({ message: 'Sale not found', success: false });
        
        let targetRank = direction === 'up' ? Number(sale.rank) - 1 : Number(sale.rank) + 1;
        const targetSale = await Sale.findOne({ rank: targetRank });

        if (!targetSale) return res.status(400).json({ message: 'Cannot move further', success: false });

        [sale.rank, targetSale.rank] = [targetSale.rank, sale.rank];
        await sale.save();
        await targetSale.save();

        res.status(200).json({ message: 'Rank updated successfully', success: true });
    } catch (error) {
        console.error('Error updating rank:', error);
        res.status(500).json({ message: 'Failed to update rank', success: false });
    }
};