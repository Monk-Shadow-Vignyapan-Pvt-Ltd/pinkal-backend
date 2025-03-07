import { Sale } from '../models/sale.model.js';

// Add a new sale
export const addSale = async (req, res) => {
    try {
        const { serviceId, saleDescription, rank, saleEnabled, userId } = req.body;
        
        const sale = new Sale({
            serviceId,
            saleDescription,
            rank,
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
        if (!sales) return res.status(404).json({ message: "No sales found", success: false });
        return res.status(200).json({ sales, success: true });
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
        const { serviceId, saleDescription, rank, saleEnabled, userId } = req.body;
        
        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { serviceId, saleDescription, rank, saleEnabled, userId },
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