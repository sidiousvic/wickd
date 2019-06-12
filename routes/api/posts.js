import Router from "express";
const router = Router();
import { check, validationResult } from "express-validator/check";
import auth from "../../middleware/auth";
import Post from "../../models/Post";
import Profile from "../../models/Profile";
import User from "../../models/User";

// @route       POST api/posts
// @desc        Create a post
// @accesss     Private
router.get(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        test: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
