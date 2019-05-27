import { Router } from "express";
const router = Router();
import auth from "../../middleware/auth";
import User from "../../models/Users";

// @route       GET api/users
// @desc        Test route
// @accesss     Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
