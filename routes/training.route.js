import express from "express";
import { addTraining, getTrainings,getEnabledTrainings,searchTrainings, getTrainingById,getTrainingByUrl,
     deleteTraining, updateTraining,onOffTraining,cloneTraining,
     } from "../controllers/training.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addTraining").post( addTraining);
router.route("/getTrainings").get( getTrainings);
router.route("/getEnabledTrainings").get( getEnabledTrainings);
router.route("/searchTrainings").post( searchTrainings);
router.route("/getTrainingById/:id").put( getTrainingById);
router.route("/getTrainingByUrl/:id").put( getTrainingByUrl);
router.route("/updateTraining/:id").post( updateTraining);
router.route("/onOffTraining/:id").post( onOffTraining);
router.route("/cloneTraining/:id").post( cloneTraining);
router.route("/deleteTraining/:id").delete(deleteTraining);



export default router;