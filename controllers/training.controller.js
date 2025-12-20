import { Training } from "../models/training.model.js";
import sharp from "sharp";

/* ----------------------------------------
   Helpers
---------------------------------------- */

const compressImage = async (base64Image) => {
  const base64Data = base64Image.split(";base64,").pop();
  const buffer = Buffer.from(base64Data, "base64");

  const compressedBuffer = await sharp(buffer)
    .resize(800, 600, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toBuffer();

  return `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
};

const createUrl = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

/* ----------------------------------------
   Add Training
---------------------------------------- */
export const addTraining = async (req, res) => {
  try {
    let {
      trainingName,
      trainingDescription,
      trainingImage,
      others,
      trainingEnabled,
      trainingUrl,
      seoTitle,
      seoDescription,
      schema,
      userId,
    } = req.body;

    if (!trainingImage || !trainingImage.startsWith("data:image")) {
      return res.status(400).json({ success: false, message: "Invalid image" });
    }

    const compressedImage = await compressImage(trainingImage);

    const training = new Training({
      trainingName,
      trainingDescription,
      trainingImage: compressedImage,
      others,
      trainingEnabled,
      trainingUrl,
      seoTitle,
      seoDescription,
      schema,
      userId,
    });

    await training.save();
    res.status(201).json({ training, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add training" });
  }
};

/* ----------------------------------------
   Get Trainings (Admin)
---------------------------------------- */
export const getTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });

    res.status(200).json({
      trainings,
      success: true,
      
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/* ----------------------------------------
   Get Enabled Trainings (Frontend)
---------------------------------------- */
export const getEnabledTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({ trainingEnabled: true })
      .select("trainingName trainingUrl trainingDescription trainingImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ trainings, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/* ----------------------------------------
   Get Training by ID
---------------------------------------- */
export const getTrainingById = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ training, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/* ----------------------------------------
   Get Training by URL
---------------------------------------- */
export const getTrainingByUrl = async (req, res) => {
  try {
    const trainingUrl = req.params.id;
    const training = await Training.findOne({ trainingUrl });
    if (!training)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ training, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/* ----------------------------------------
   Search Trainings
---------------------------------------- */
export const searchTrainings = async (req, res) => {
  try {
    const regex = new RegExp(req.query.search, "i");

    const trainings = await Training.find({
      trainingName: regex,
    });

    res.status(200).json({ trainings, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

/* ----------------------------------------
   Update Training
---------------------------------------- */
export const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    let update = req.body;

    const existing = await Training.findById(id);
    if (!existing)
      return res.status(404).json({ success: false, message: "Not found" });

    /* oldUrls logic */
    let oldUrls = existing.oldUrls || [];
    if (
      update.trainingUrl &&
      update.trainingUrl !== existing.trainingUrl &&
      !oldUrls.includes(existing.trainingUrl)
    ) {
      oldUrls.push(existing.trainingUrl);
    }

    if (update.trainingImage?.startsWith("data:image")) {
      update.trainingImage = await compressImage(update.trainingImage);
    } else {
      delete update.trainingImage;
    }

    update.oldUrls = oldUrls;

    const training = await Training.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ training, success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ----------------------------------------
   Enable / Disable Training
---------------------------------------- */
export const onOffTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndUpdate(
      req.params.id,
      { trainingEnabled: req.body.trainingEnabled },
      { new: true }
    );

    res.status(200).json({ training, success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ----------------------------------------
   Delete Training
---------------------------------------- */
export const deleteTraining = async (req, res) => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

/* ----------------------------------------
   Clone Training
---------------------------------------- */
export const cloneTraining = async (req, res) => {
  try {
    const original = await Training.findById(req.params.id);
    if (!original)
      return res.status(404).json({ success: false, message: "Not found" });

    const cloned = { ...original.toObject() };
    delete cloned._id;

    let suffix = 1;
    let newName = original.trainingName;
    let newUrl = original.trainingUrl;

    while (await Training.findOne({ trainingName: newName })) {
      suffix++;
      newName = `${original.trainingName}-${suffix}`;
      newUrl = createUrl(newName);
    }

    cloned.trainingName = newName;
    cloned.trainingUrl = newUrl;

    const newTraining = new Training(cloned);
    await newTraining.save();

    res.status(201).json({ training: newTraining, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Clone failed" });
  }
};
