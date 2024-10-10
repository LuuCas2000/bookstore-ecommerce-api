import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

// IMPORTS
import BookStoreModel from '../models/models.js';

export const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    
    if (!refreshToken) return res.sendStatus(401);

    const foundUser = await BookStoreModel.findOne({ refreshToken }, 'refreshToken user_name');

    if (foundUser.refreshToken !== refreshToken) return res.sendStatus(403);

    verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, token) => {
        if (err || foundUser.user_name !== token.username) return res.sendStatus(403);
        const accessToken = sign({ username: token.username, role: token.role, id: token.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken });
    })
}