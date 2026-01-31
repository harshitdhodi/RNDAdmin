const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  try {
    // Accept token from Authorization header (Bearer) or cookie
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log("Unauthorized user: No token provided");
      return res.status(403).json({ message: "Unauthenticated user" });
    }

    // Use same secret as login (createToken)
    const secret = process.env.JWT_SECRET_KEY || "secret";
    const decodedToken = await jwt.verify(token, secret);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken.id) {
      console.log("Token doesn't contain a valid user ID");
      return res.status(403).json({ message: "Invalid token structure" });
    }

    // Attach the user ID to the request object
    req.newAdmin = decodedToken.id;
 
    next();
  } catch (err) {
    console.log("Error verifying token:", err.message);
    console.log("Unable to authenticate user, invalid token");
    res.status(403).json({ message: "Forbidden: Invalid or missing token" });
  }
};

module.exports = { requireAuth };
