require('dotenv').config()
const jwt = require('jsonwebtoken');

// Middleware pour l'authentification
function verifyToken(req, res, next) {
    const token = req.header('usr-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé => Token manquant !', result: null });
    }

    jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Non autorisé => Token Invalide !', result: null })
        }

        // const currentTime = Math.floor(Date.now() / 1000);
        // const { expireTime } = jwt.decode(token);
        // if (expireTime - currentTime < 1000) {
        //     const refreshToken = jwt.sign({ id_user: decoded.id_user, email_user: decoded.email_user }, process.env.SECRET_TOKEN_KEY)
        //     res.setHeader('Authorization', 'Bearer ' + refreshToken);
        // }

        req.user = decoded;
        next();
    });
}

module.exports = {
    verifyToken,
}