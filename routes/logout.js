import express from 'express';

export const logoutRouter = express.Router();

// IMPORTS
import { logoutUser } from '../controllers/controllers.js';

logoutRouter.route('/')
.get(logoutUser);