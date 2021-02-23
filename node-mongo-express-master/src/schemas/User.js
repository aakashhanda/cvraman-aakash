const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    title: String,
    status: {
        type: Boolean,
        default: false
    }
});

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    todos: [TodoSchema],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('user',UserSchema);
