const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/autenticacao');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ( req,res ) => {
    
    res.send({ ok:true });
});

module.exports = app => app.use('/verificar', router); //rota de verificacao