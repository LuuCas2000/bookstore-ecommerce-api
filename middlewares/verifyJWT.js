import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

export const verifyJWT = (req, res, next) => {
    //const authHeader = req.headers['cookie'];
    const authToken = req.cookies['refresh-token'];
    if (!authToken) return res.sendStatus(401);
    console.log(authToken);
    //const token = accessToken.split('access-token=')[1]
    verify(authToken, process.env.JWT_REFRESH_SECRET, (err, token) => {
        console.log(err);
        if (err) return res.sendStatus(403); // stands for forbidden (invalid token)
        req.user = token.username;
        req.roles = token.role;
        next();
    });
};