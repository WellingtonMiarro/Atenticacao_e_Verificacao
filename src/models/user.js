const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    createAd:{
        type: Date,
        default: Date.now,
    }
});
UserSchema.pre('save',async function(next){
    const hash = await bcrypt.hash(this.password, 10); // this acessa dentro do esquema, passando o tamanho da chave gerada
    this.password = hash;
    next();
})

const User = mongoose.model('User', UserSchema);
module.exports = User;