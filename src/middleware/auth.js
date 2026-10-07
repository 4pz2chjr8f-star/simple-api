export function auth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (apiKey != "my-secret-key") {
    return res.status(401).json({ message: "Invalid API key" });
  }

  next();
}
