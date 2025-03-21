import express from "express";
import { addTeamMember, getTeamMembers, getTeamMemberById, deleteTeamMember, updateTeamMember} from "../controllers/team.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addTeamMember").post( addTeamMember);
router.route("/getTeamMembers").get( getTeamMembers);
router.route("/getTeamMemberById/:id").put( getTeamMemberById);
router.route("/updateTeamMember/:id").post( updateTeamMember);
router.route("/deleteTeamMember/:id").delete(deleteTeamMember);

export default router;