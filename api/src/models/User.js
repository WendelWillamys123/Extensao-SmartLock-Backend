const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: String,
    email: String,
    Macs: [String],
    matricula: String,
    img: String,
});

module.exports = mongoose.model('User', UserSchema);