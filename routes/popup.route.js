import express from "express";
import { upsertPopup, getPopup } from "../controllers/popup.controller.js";

const router = express.Router();

router.route("/upsertPopup").post( upsertPopup);
router.route("/getPopup").get( getPopup);

export default router;
