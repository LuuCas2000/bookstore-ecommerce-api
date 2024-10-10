import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import methodOverride from 'method-override';

dotenv.config({ path: 'config.env' });

const app = express();

// IMPORTS
import connectDB from './database/connectDB.js';
import userRouter from './routes/user.js';

import { refreshRouter } from './routes/refresh.js';
import { logoutRouter } from './routes/logout.js';
import { authRouter } from './routes/auth.js';

// VIEW SETTING
app.set('view engine', 'ejs');
app.use(express.static(path.join(import.meta.dirname, 'views'))); 

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(helmet());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT;
const url = process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD);

connectDB(url);

// REFRESH TOKEN ROUTE
app.use('/refresh', refreshRouter);

// LOGOUT USER ROUTE
app.use('/logout', logoutRouter);

// AUTHENTICATE USER ROUTER
app.use('/auth', authRouter);

// USER ROUTE
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});