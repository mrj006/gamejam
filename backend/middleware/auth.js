const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.cookies["access-token"];

  if (!token) {
    return res.send({
      message: "A token is required for authentication",
      code: 403,
    });
  }
  
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.send({
      message: "Invalid Token",
      code: 401
    });
  }
  return res.send({code: 200});
};

module.exports = verifyToken;