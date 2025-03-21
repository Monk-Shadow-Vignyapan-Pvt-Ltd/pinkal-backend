import express from "express";
import { addPrice, getPrices, getPriceById, deletePrice, updatePrice} from "../controllers/price.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addPrice").post( addPrice);
router.route("/getPrices").get( getPrices);
router.route("/getPriceById/:id").put( getPriceById);
router.route("/updatePrice/:id").post( updatePrice);
router.route("/deletePrice/:id").delete(deletePrice);

export default router;