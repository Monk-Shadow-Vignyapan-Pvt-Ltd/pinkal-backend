import express from "express";
import { addSubService, getSubServices, getSubServiceById,getSubServicesByServiceId, deleteSubService, updateSubService,getSubServicesFrontend,getSubServicesBeforeAfter,cloneSubService} from "../controllers/sub_service.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addSubService").post( addSubService);
router.route("/getSubServices").get( getSubServices);
router.route("/getSubServiceById/:id").put( getSubServiceById);
router.route("/getSubServicesByServiceId/:id").get( getSubServicesByServiceId);
router.route("/updateSubService/:id").post( updateSubService);
router.route("/cloneSubService/:id").post( cloneSubService);
router.route("/deleteSubService/:id").delete(deleteSubService);
router.route("/getSubServicesFrontend").get(getSubServicesFrontend);
router.route("/getSubServicesBeforeAfter").get(getSubServicesBeforeAfter);

export default router;