import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { user: { id, role }, iat, exp }
    req.user = decoded.user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
}
