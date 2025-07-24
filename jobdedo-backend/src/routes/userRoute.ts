import { Router } from "express";
import UserMiddleware from "../middleware/userMiddleware";
import UserService from "../services/userService";
import { uploadFiles } from "../utils/upload";

const router = Router();
const userMiddleware = new UserMiddleware();
const userService = new UserService();

router.post(
  "/login",
  userMiddleware.login.bind(userMiddleware),
  userService.login.bind(userService),
);
router.post(
  "/signin",
  userMiddleware.signin.bind(userMiddleware),
  // userMiddleware.createUser.bind(userMiddleware),
  userService.signUpUser.bind(userService),
);
router.post(
  "/create",
  // userMiddleware.verifyAdmin.bind(userMiddleware),
  userMiddleware.createUser.bind(userMiddleware),
  userService.createUser.bind(userService),
);
router.get(
  "/profile",
  userMiddleware.verifyAdmin.bind(userMiddleware),
  userService.getProfile.bind(userService),
);
router.get(
  "/my/user",
  userMiddleware.verify.bind(userMiddleware),
  userService.getProfile.bind(userService),
);
router.get(
  "/all-users",
  userMiddleware.verifyAdmin.bind(userMiddleware),
  userService.getAllUsers.bind(userService),
);
router.delete(
  "/remove/:id",
  userMiddleware.deleteId.bind(userMiddleware),
  userService.deleteById.bind(userService),
);
router.put(
  "/block/:id",
  userMiddleware.deleteId.bind(userMiddleware),
  userService.updateIsBlocked.bind(userService),
);
router.put("/update/:id", userService.updateUser.bind(userService));
router.put(
  "/update-my",
  userMiddleware.verify.bind(userMiddleware),
  userService.updateUserMine.bind(userService),
);

router.put(
  "/update-resume",
  userMiddleware.verify.bind(userMiddleware),
  uploadFiles,
  userService.updateResume.bind(userService),
);

router.put(
  "/add/education",
  userMiddleware.verify.bind(userMiddleware),
  userService.addEducation.bind(userService),
);
router.put(
  "/add/exp",
  userMiddleware.verify.bind(userMiddleware),
  userService.addExperince.bind(userService),
);
router.put(
  "/add/lang",
  userMiddleware.verify.bind(userMiddleware),
  userService.addLanguage.bind(userService),
);

router.post(
  "/employeer/add/company",
  userMiddleware.verify.bind(userMiddleware),
  userService.addCompany.bind(userService),
);

router.get(
  "/employeer/get/company",
  userMiddleware.verify.bind(userMiddleware),
  userService.getCompanies.bind(userService),
);
router.put(
  "/update-profile",
  userMiddleware.verify.bind(userMiddleware),
  uploadFiles,
  userService.updateProfileImage.bind(userService),
);

router.get(
  "/company/employees",
  userMiddleware.verify.bind(userMiddleware),
  userService.getEmployees.bind(userService),
);

router.get(
  "/canidates/with-resume",
  userMiddleware.verify.bind(userMiddleware),
  userService.getUsersWithResume.bind(userService),
);
export default router;
