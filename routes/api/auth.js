import { Router } from "express";
const router = Router();
import auth from "../../middleware/auth";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
const { check, validationResult } = require("express-validator/check");

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

// @route       POST api/auth
// @desc        Authenticate user and get token
// @accesss     Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please input a password with 6 or more characters",
      "Password is required"
    ).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // Return jsonwebtoken
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }

    // console.log(req.body);
    // res.send("User route");
  }
);
