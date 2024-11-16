import express from "express";
import { addSubService, getSubServices, getSubServiceById, deleteSubService, updateSubService} from "../controllers/sub_service.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addSubService").post( addSubService);
router.route("/getSubServices").get( getSubServices);
router.route("/getSubServiceById/:id").put( getSubServiceById);
router.route("/updateSubService/:id").post( updateSubService);
router.route("/deleteSubService/:id").delete(deleteSubService);

export default router;