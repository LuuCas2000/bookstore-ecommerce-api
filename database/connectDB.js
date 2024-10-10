import mongoose from 'mongoose';

const connectDB = async (url) => {
    console.log('connected to database');
    await mongoose.connect(url);
};

export default connectDB;