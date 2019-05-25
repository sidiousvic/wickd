import Router from "express";
const router = Router();
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { check, validationResult } = require("express-validator/check");

import User from "../../models/Users";

// @route       POST api/users
// @desc        Register user
// @accesss     Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please input a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users Gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      res.send("User registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }

    console.log(req.body);
    res.send("User route");
  }
);

export default router;
