const bcrypt = require("bcryptjs")
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const User = require("../models/user")

// Sign Up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Check username length is more than 3
    if (username.length < 4) {
      return res.status(400).json({ message: "Username length should be more than 3" });
    }

    // Check username already exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check email already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check password length more than 5
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password's length should be greater than 5" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      address: address,
    });

    await newUser.save();
    return res.status(200).json({ message: "Sign Up Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error " });
  }
});

// Sign in 
router.post("/sign-in", async (req, res) => {
  try {
    const {username, password} = req.body;

    const existingUsername = await User.findOne({username});
    if(!existingUsername) {
      res.status(400).json({message: "Invalid Credentials"})
    }

    await bcrypt.compare(password, existingUsername.password, (err,data)=> {
      if(data) {
        const authClaims = [
          {name: existingUsername.username},
          {role: existingUsername.role},
        ];

        const token = jwt.sign({ authClaims}, "bookStore123", {
          expiresIn: "30d",
        });
        res.status(200).json({id: existingUsername._id, role: existingUsername.role, token: token});
      }else {
        res.status(400).json({message: "Invalid Credentials"})
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error "})
  }
})

// get-user-information 
router.get("/get-user-information", authenticateToken, async (req,res) => {
  try {
    const {id} =req.headers;
    const data = await User.findById(id);
    return res.status(200).json(data);
    console.log(data)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error "})
  }
})

// update address
router.put("/update-address", authenticateToken, async (req,res)=> {
  try {
    const {id} =req.headers;
    const {address} = req.body;
    const data = await  User.findByIdAndUpdate(id, { address: address});
    return res.status(200).json({ message: "Address Updated Successfully", data})
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error "})
  }
})

module.exports = router;
