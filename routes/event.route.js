import express from "express";
import { upsertEvent,  getEvent,} from "../controllers/event.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/upsertEvent").post( upsertEvent);
router.route("/getEvent").get( getEvent);

export default router;