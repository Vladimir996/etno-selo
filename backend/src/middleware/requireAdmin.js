const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Niste prijavljeni." });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Sesija je istekla, prijavite se ponovo." });
  }
}

module.exports = requireAdmin;
