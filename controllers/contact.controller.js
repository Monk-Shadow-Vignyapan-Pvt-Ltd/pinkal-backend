import { Contact } from '../models/contact.model.js'; // Adjust path based on your file structure

// Add a new contact
export const addContact = async (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !phone || !email || !message) {
            return res.status(400).json({ message: 'Please provide all required fields', success: false });
        }

        // Create a new contact document
        const newContact = new Contact({
            name,
            phone,
            email,
            subject,
            message,
        });

        // Save the contact document to the database
        await newContact.save();

        res.status(201).json({ newContact, success: true });
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'Failed to add contact', success: false });
    }
};

// Get all contacts
export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found", success: false });
        }
        return res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch contacts', success: false });
    }
};
