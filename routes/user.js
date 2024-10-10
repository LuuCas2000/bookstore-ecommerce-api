import express from 'express';
import { body } from 'express-validator';

// IMPORTS
import { getAllBooks, createUserAccount, userAuth, deleteUserAccount, addNewBook, deleteBook, renderDashboard, renderLogin, renderAdminPage, updateUserPicture } from '../controllers/controllers.js';
import validateInput from '../input-validation.js';
import { upload } from '../multer-config.js';

import { verifyRoles } from '../middlewares/verifyRoles.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

const userRouter = express.Router();

// DASHBOARD VIEW
userRouter.route('/dashboard')
.get(verifyJWT, renderDashboard); 

// LOGIN VIEW
userRouter.route('/login')
.get(renderLogin);

userRouter.route('/users')
.get(getAllBooks);

userRouter.route('/admin')
.get(verifyJWT, verifyRoles('admin'), renderAdminPage);

// CREATE USER ACCOUNT
userRouter.route('/user/create').post(validateInput([
    body('user_name').notEmpty().withMessage('username field must not be empty').trim().escape(),
    body('user_email').notEmpty().withMessage('email field must not be empty').isEmail().trim().escape().normalizeEmail(),
    body('user_password').notEmpty().isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches('[0-9]').withMessage('Password must contain a number')
    .matches('[A-Z]').withMessage('Password must contain an uppercase letter').trim().escape(),
]), createUserAccount);

// DELETE USER ACCOUNT
userRouter.route('/user/delete/:id')
.delete(verifyJWT, verifyRoles('admin'), deleteUserAccount);

// ADD BOOK
userRouter.route('/user/book/add/:id')
.patch(verifyJWT, addNewBook);

// DELETE BOOK
userRouter.route('/user/book/delete/:doc/:id')
.patch(verifyJWT, deleteBook);

// UPDATE USER PROFILE
userRouter.route('/user/profile/picture/:id')
.patch(verifyJWT, upload.single('user_picture'), updateUserPicture);

export default userRouter;