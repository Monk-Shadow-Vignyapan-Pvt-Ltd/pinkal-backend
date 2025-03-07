import express from "express";
import { addSale, getSales, getSaleById, deleteSale, updateSaleRank,updateSale} from "../controllers/sale.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addSale").post( addSale);
router.route("/getSales").get( getSales);
router.route("/getSaleById/:id").put( getSaleById);
router.route("/updateSale/:id").post( updateSale);
router.route("/updateSaleRank").post( updateSaleRank);
router.route("/deleteSale/:id").delete(deleteSale);

export default router;