const router = require('express').Router();
const {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken')
const User= require('../models/user')
////////////////////////////////////////////update 
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>
{
// to see whether token bleong to users or admin or not authentication
if(req.body.password)
{
    req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.pass_secretkey
      ).toString();
}
try {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedUser);
} catch (err) {
  res.status(500).json(err);
}
});

///////////////////////////////////////////DELETE 
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  ////////////////////////////////////////////////GET USER
  router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
/////////////////////////////////////GET ALL USERSSSS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
     try {
      const users =  await User.find() 
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });





module.exports= router