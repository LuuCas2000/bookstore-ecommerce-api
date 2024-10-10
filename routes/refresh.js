import express from 'express';

export const refreshRouter = express.Router();

// IMPORTS
import { handleRefreshToken } from '../middlewares/HandleRefreshToken.js';

refreshRouter.route('/')
.get(handleRefreshToken);