import { Team } from '../models/team.model.js';
import sharp from 'sharp';

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

// Add a new team member
export const addTeamMember = async (req, res) => {
    try {
        let { title, image, description, userId } = req.body;
        
        if (image && image.startsWith('data:image')) {
            image = await compressImage(image);
        }

        const teamMember = new Team({
            title,
            image,
            description,
            userId
        });

        await teamMember.save();
        res.status(201).json({ teamMember, success: true });
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({ message: 'Failed to add team member', success: false });
    }
};

// Get all team members
export const getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await Team.find();
        if (!teamMembers) return res.status(404).json({ message: "No team members found", success: false });
        res.status(200).json({ teamMembers, success: true });
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Failed to fetch team members', success: false });
    }
};

// Get team member by ID
export const getTeamMemberById = async (req, res) => {
    try {
        const teamMember = await Team.findById(req.params.id);
        if (!teamMember) return res.status(404).json({ message: "Team member not found", success: false });
        res.status(200).json({ teamMember, success: true });
    } catch (error) {
        console.error('Error fetching team member:', error);
        res.status(500).json({ message: 'Failed to fetch team member', success: false });
    }
};

// Update team member by ID
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        let { title, image, description, userId } = req.body;

        if (image && image.startsWith('data:image')) {
            image = await compressImage(image);
        }

        const updatedTeamMember = await Team.findByIdAndUpdate(
            id,
            { title, image, description, userId },
            { new: true, runValidators: true }
        );

        if (!updatedTeamMember) return res.status(404).json({ message: "Team member not found", success: false });
        res.status(200).json({ updatedTeamMember, success: true });
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete team member by ID
export const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeamMember = await Team.findByIdAndDelete(id);
        if (!deletedTeamMember) return res.status(404).json({ message: "Team member not found", success: false });
        res.status(200).json({ deletedTeamMember, success: true });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ message: 'Failed to delete team member', success: false });
    }
};
