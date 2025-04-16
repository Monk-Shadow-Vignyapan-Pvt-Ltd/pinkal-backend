import { Popup } from "../models/popup.model.js";

// Add or update the single popup document
export const upsertPopup = async (req, res) => {
  try {
    const { popupImage, popupUrl, time, popupEnabled } = req.body;

    // Validate required fields
    if (!popupImage || !popupUrl || typeof popupEnabled !== "boolean") {
      return res.status(400).json({ message: "Invalid or missing fields." });
    }

    // Update if exists, else insert new
    const popup = await Popup.findOneAndUpdate(
      {}, // No filter - we want to update any document (and ensure only one)
      { popupImage, popupUrl, time, popupEnabled },
      { new: true, upsert: true } // new = return the updated doc, upsert = insert if not found
    );

    res.status(200).json({
      message: "Popup added/updated successfully.",
      data: popup,
    });
  } catch (error) {
    console.error("Error in upsertPopup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get the single popup document
export const getPopup = async (req, res) => {
  try {
    const popup = await Popup.findOne(); // only one doc expected
    if (!popup) {
      return res.status(404).json({ message: "Popup not found." });
    }
    res.status(200).json({ data: popup });
  } catch (error) {
    console.error("Error in getPopup:", error);
    res.status(500).json({ message: "Failed to fetch popup." });
  }
};
