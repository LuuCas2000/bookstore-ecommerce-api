import mongoose from 'mongoose';

const BookStoreSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: String,
        required: true,
        unique: false,
        default: '0.00'
    },
    author: {
        type: String,
        required: true,
        unique: false,
        default: 'Unknown'
    },
    image: {
        type: String,
        required: true,
        unique: false
    },
    genre: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        default: 'No description provided',
        unique: false
    }
});

const UserAccountSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    user_email: {
        type: String,
        required: true,
        unique: true
    },
    user_password: {
        type: String,
        required: true,
        unique: true,
        minLength: [8, 'Password must contain at least 8 characters']
    },
    user_role: {
        type: Array,
        required: false,
        default: ['buyer']
    },
    user_picture: {
        type: String,
        required: false,
        default: '/'
    },
    refreshToken: {
        type: String,
        required: true,
        default: '/'
    },
    books: {
        type: [BookStoreSchema],
        required: false
    }
}, { minimize: false });

const BookStoreModel = mongoose.model('book-store', UserAccountSchema, 'book-users');

export default BookStoreModel;