import bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { StatusCodes } from 'http-status-codes';

// IMPORTS
import BookStoreModel from "../models/models.js";

export const getAllBooks = async (req, res) => {
    const books = await BookStoreModel.find();
    res.status(StatusCodes.OK).json({ data: books });
};

export const createUserAccount = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_role } = req.body;
        
        const hash = bcrypt.hashSync(user_password, 10);

        const user = await BookStoreModel.create({ user_name, user_email, user_password: hash });
        res.status(StatusCodes.CREATED).json({ msg: 'success', user });
    } catch (err) {
        console.log(err);
    }
};

export const userAuth = async (req, res) => {
    try {
        const { user_name, user_password } = req.body;
        const user = await BookStoreModel.findOne({ user_name }, 'user_name user_password user_role');

        //if (!user) throw new Error('username or password is incorrect, please try again!');
        if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'username or password is incorrect, please try again!' });

        const credentials = bcrypt.compareSync(user_password, user.user_password);

        if (!credentials) throw new Error('username or password is incorrect, please try again!');

        // CREATE ACCESS TOKEN
        const accessToken = sign({ username: user.user_name, role: user.user_role, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // CREATE REFRESH TOKEN
        const refreshToken = sign({ username: user.user_name, role: user.user_role, id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

        res.cookie('refresh-token', refreshToken, {
           httpOnly: true,
           secure: true,
           sameSite: 'None',
           maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // STORING REFRESH TOKEN IN DATABASE
        await BookStoreModel.findByIdAndUpdate(user._id, { refreshToken });
        
        // res.status(StatusCodes.OK).json({ accessToken }); // we can send the access token to the frontend developer grab it.
        res.redirect('/user/dashboard');
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
};

export const logoutUser = async (req, res) => {
    const cookies = req.cookies;

    // if (!cookies['access-token'] && !cookies['refresh-token']) return res.sendStatus(204); // No content to send back
    if (!cookies['refresh-token']) return res.sendStatus(204); // No content to send back

    const token = verify(cookies['refresh-token'], process.env.JWT_REFRESH_SECRET);

    const foundUser = await BookStoreModel.findOne({ user_name: token.username }, 'refreshToken user_name');

    if (!foundUser) {
        res.clearCookie('refresh-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.clearCookie('access-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        return res.sendStatus(204);
    };

    // DELETE REFRESH TOKEN IN DATABASE
    await BookStoreModel.findByIdAndUpdate(foundUser._id, { refreshToken: '/' });

    res.clearCookie('refresh-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.clearCookie('access-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.sendStatus(204);
};

export const deleteUserAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await BookStoreModel.findByIdAndDelete(id);
        res.status(StatusCodes.OK).json({ status: 'success', msg: 'user account deleted' });
    } catch (err) {
        console.log(err);
    }
};

export const addNewBook = async (req, res) => {
    try {
        const { book_name, price, author, image, genre, description } = req.body;
        console.log(req.body);
        console.log(req.params.id);
        await BookStoreModel.findByIdAndUpdate(req.params.id, { $addToSet: { books: { book_name, price, author, image, genre, description } } }, { runValidators: true });
        res.status(StatusCodes.CREATED).json({ status: 'success', msg: 'new book added' });
    } catch (err) {
        console.log(err);
    }
};

export const deleteBook = async (req, res) => {
    try {
        await BookStoreModel.findByIdAndUpdate({ _id: req.params.doc }, { $pull: { books: { _id: req.params.id }}}, { runValidators: true });
        res.status(StatusCodes.OK).json({ status: 'success', msg: 'book deleted' });
    } catch (err) {
        console.log(err);
    }
};

export const updateUserPicture = async (req, res) => {
    try {
        await BookStoreModel.findByIdAndUpdate(req.params.id, { user_picture: req.file?.originalname }, { runValidators: true });
        res.status(201).json({ status: 'success' });
    } catch (err) {
        console.log(err);
    }
};

// VIEWS
export const renderDashboard = (req, res) => {
    res.render('dashboard');
};

export const renderLogin = (req, res) => {
    res.render('login');
};

export const renderAdminPage = (req, res) => {
    res.render('admin-dashboard');
};