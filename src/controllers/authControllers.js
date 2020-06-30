const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const authConfig = require('../config/auth.json');

const router = express.Router();

function gerarToken(params = {}) {
    return jwt.sign(params, authConfig.secret, { //authConfig possui um token unico
        expiresIn: 300, //tempo que o token fica 
    });
}

router.post('/registro', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Usuário já existe!' });

        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({
            msg: 'Usuário criado com sucesso!',
            NomeUser: user.nome,
            token: gerarToken({ id: user.id })
        })

    } catch (err) {
        return res.status(400).send({ error: 'Falha no registro' });
    }

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'usuário nao encontrado' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Senha Inválida' });

    user.password = undefined;

    res.send({
        user,
        token: gerarToken({ id: user.id })
    });
});

module.exports = app => app.use('/', router);