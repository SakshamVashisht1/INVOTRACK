
const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];

    console.log('Authorization Header:', auth);

    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require'});
    }
    try {
        const decoded = jwt.verify(auth,"12345");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

module.exports = ensureAuthenticated;