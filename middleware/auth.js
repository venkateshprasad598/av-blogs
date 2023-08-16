const client = require("../utils/redis");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No Token Provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    client.exists(token, (err, reply) => {
      if (err) throw err;
      if (reply === 1) {
        next();
      } else {
        return res.status(401).json({ msg: "Incorrect Token" });
      }
    });
  } catch (error) {
    return res.status(404).json({ msg: "Not authorized to access this route" });
  }
};

module.exports = authenticationMiddleware;
