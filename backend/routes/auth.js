const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/Fetchuser");

const secret = "secret for you";

// ROUTE 1 : Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Name's length should be at least 3").isLength({ min: 3 }),
    body("email", "Incorrect email").isEmail(),
    body("password", "Password's length should be at least 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      success = false;
      return res.status(400).json({ success, error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    // Create user if email is unique
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      // Generate JWT
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, secret);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

// ROUTE 2 : Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
 
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, secret);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error("Error during login:", error);
      if (error.name === "SomeSpecificError") {
        res.status(500).json({ error: "A specific error occurred" });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
      
  }
);

// ROUTE 3 : Get logged in User details using: POST "/api/auth/getuser".  login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
