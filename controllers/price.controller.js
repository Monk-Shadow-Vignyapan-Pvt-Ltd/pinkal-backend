import { Price } from '../models/price.model.js';

// Add a new price
export const addPrice = async (req, res) => {
    try {
        const { title, description, priceType, userId } = req.body;
        
        const price = new Price({ title, description, priceType, userId });
        await price.save();
        
        res.status(201).json({ price, success: true });
    } catch (error) {
        console.error('Error adding price:', error);
        res.status(500).json({ message: 'Failed to add price', success: false });
    }
};

// Get all prices
export const getPrices = async (req, res) => {
    try {
        const prices = await Price.find();
        
        if (!prices) return res.status(404).json({ message: 'No prices found', success: false });
        
        res.status(200).json({ prices, success: true });
    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).json({ message: 'Failed to fetch prices', success: false });
    }
};

// Get price by ID
export const getPriceById = async (req, res) => {
    try {
        const price = await Price.findById(req.params.id);
        if (!price) return res.status(404).json({ message: 'Price not found', success: false });
        
        res.status(200).json({ price, success: true });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).json({ message: 'Failed to fetch price', success: false });
    }
};

// Update price by ID
export const updatePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priceType, userId } = req.body;
        
        const updatedPrice = await Price.findByIdAndUpdate(
            id,
            { title, description, priceType, userId },
            { new: true, runValidators: true }
        );

        if (!updatedPrice) return res.status(404).json({ message: 'Price not found', success: false });
        
        res.status(200).json({ updatedPrice, success: true });
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(400).json({ message: 'Failed to update price', success: false });
    }
};

// Delete price by ID
export const deletePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPrice = await Price.findByIdAndDelete(id);
        
        if (!deletedPrice) return res.status(404).json({ message: 'Price not found', success: false });
        
        res.status(200).json({ deletedPrice, success: true });
    } catch (error) {
        console.error('Error deleting price:', error);
        res.status(500).json({ message: 'Failed to delete price', success: false });
    }
};
