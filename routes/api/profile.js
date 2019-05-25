import { Router } from "express";
const router = Router();

// @route       GET api/users
// @desc        Test route
// @accesss     Public
router.get("/", (req, res) => res.send("Profile route"));

export default router;
