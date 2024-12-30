import express from "express";
import {auth} from "../middleware/auth.js"
import { globalSearch} from "../controllers/global_search.controller.js";

const router = express.Router();

router.route("/globalSearch").post( globalSearch);

export default router;
