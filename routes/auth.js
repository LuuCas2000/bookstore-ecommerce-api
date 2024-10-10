import express from 'express';
import { body } from 'express-validator';

export const authRouter = express.Router();

// IMPORTS
import { userAuth } from '../controllers/controllers.js';
import validateInput from '../input-validation.js';

authRouter.route('/')
.post(validateInput([
    body('user_name').notEmpty().trim().withMessage('username field must not be empty').escape(),
    body('user_password').notEmpty().withMessage('password field must not be empty').trim().escape()
]), userAuth);