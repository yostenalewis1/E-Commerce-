// for register and login
const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const customError = require("../customError");
const jwt = require('jsonwebtoken')
//REGISTER
router.post("/register", async (req, res,next) => {
  const {
    email,
    firstname,
    lastname,
    username,
    password,
    phonenumber,
    address,
  } = req.body;


  if (!email || !firstname || !lastname || !username || !password || !phonenumber || !address) {
    next(
      customError({
        statusCode: 404,
        message: "All fields are required",
      })
    );
  }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(
        customError({
          statusCode: 404,
          message: "User already exists ",
        })
      );}

  const newUser = new User({
    email,
    firstname,
    lastname,
    username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.pass_secretkey
    ).toString(),
    phonenumber,
    address,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  }  catch (err) {
    if (err.name === 'ValidationError') {
      const errorMessages = {};

      for (field in err.errors) {
        if (field === 'email' && err.errors[field].kind === 'regexp') {
         return next(
            customError({
              statusCode: 404,
              message: "Invalid email format",
            }))
        } else if (field === 'firstname') {
          if (err.errors[field].kind === 'minlength') {
            next(
              customError({
                statusCode: 404,
                message: "Firstname should have at least 3 characters",
              }))
          }  
        } else if (field === 'lastname') {
          if (err.errors[field].kind === 'minlength') { 
            next(
            customError({
              statusCode: 404,
              message: "Lastname should have at least 3 characters",
            }))
           
          }  
        } else if (field === 'username') {
          if (err.errors[field].kind === 'minlength') {
            next(
              customError({
                statusCode: 404,
                message: "Username should have at least 3 characters'",
              }))
            
          } 
        }
        
      }
      res.status(400).json({ errors: errorMessages });
    } else {
      res.status(500).json(err);
    }
  }
});

////////////////////////login

router.post("/login", async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
    return  next(
        customError({
          statusCode: 404,
          message: "User not found !!",
        }))
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.pass_secretkey
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return  next(
        customError({
          statusCode: 404,
          message: "Incorrect password !!",
        }))
    }

//create jsonwebtoken
  const accessToken = jwt.sign({
    id:user._id,
    isAdmin :user.isAdmin,
  },process.env.secretkey,
  {expiresIn :"2d"})


    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({...userWithoutPassword,accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
