const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);
  if (!token) return res.status(403).send("Access Denied");

  jwt.verify(token, process.env.JWT_AUTH_SECRET, (err, user) => {
    if (err) return res.status(403).send({message:"Invalid Token", error: err.message});
    req.user = user; // Attach the user info to the request object
    next();
  });
};

module.exports = authenticateToken;
