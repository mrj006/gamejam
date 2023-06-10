const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.cookies["token"];

    if (!token) {
        return res.send({
            message: "A token is required for authentication",
            code: 403,
        });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        req.user = decoded.payload._id;
    } catch (err) {
        return res.send({
            message: "Invalid Token",
            code: 401
        });
    }
    return next();
};

module.exports = verifyToken;