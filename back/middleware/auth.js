// Imports
const jwt = require('jsonwebtoken');

// Authentification
module.exports = (req, res, next) => {
    // We recuperate the token in the request headers
    const authHeader = req.headers.authorization;

    // If the user has a session token,
    // We verify that it is not expired
    // if it is we send back a 403 error
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, user) => {
            if (err) {
                // console.log(err);
                return res.status(403).json(err);
            }
            next();
        });
    }
    // If there is no token in the headers, the access is denied
    else {
        res.status(401).json({error:"accès non authorisé"});
    }
};