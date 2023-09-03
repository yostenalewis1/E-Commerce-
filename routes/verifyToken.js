const jwt = require("jsonwebtoken");
const customError = require("../customError");

 
//middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader
    jwt.verify(token, process.env.secretkey, (err, user) => {
      if (err) 
      {res.status(404).json("token is not valid!!");
    }
      req.user = user;
      next(); 
    });
  } else {
    return res.status(401).json("you are not authenticated!! ");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(404).json("you arent allowed to do that !! ");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not admin !!");
      }
    });
  };
  
  module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  };