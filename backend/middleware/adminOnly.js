export default function adminOnly(req, res, next) {
  try {
    // user already injected by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "org") {
      return res.status(403).json({ message: "Admins only" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Admin check failed" });
  }
}
