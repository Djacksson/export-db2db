require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { exportView, importView } = require('../funcs/view-func');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const mysql = require('mysql');
const { Parser } = require('node-sql-parser');
const parser = new Parser();

const { verifyToken } = require('../middlewares/user.middleware');
const UserController = require('../controllers/user.controller');
const classController = new UserController()

//###########################################################
// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const existUser = await classController.getUserByEmail(req.body.email);

        if (!existUser) {
            hashpwd = await bcrypt.hash(req.body.password, 10)
            dataUser = {
                username: req.body.username,
                email: req.body.email,
                password: hashpwd,
            }

            const result = await classController.InsertData(dataUser);
            if (result) {
                return res.json({ message: 'User successfully inserted', data: result, status: "success" });
            }

            return res.json({ message: 'Insert failed => Error server !', data: existUser, status: "error" });
        }

        return res.json({ message: 'Insert failed => User exist !', data: existUser, status: "error" });
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur est survenue lors de l\'enrégistrement du User.' });
    }
});



//###########################################################
// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await classController.getUserByEmail(email);

        if (existUser) {
            const checkPassword = await bcrypt.compareSync(password, existUser.password);

            if (!checkPassword) {
                return res.json({ message: 'Invalid password !', data: null, status: "error"  });
            }
        
            const token = jwt.sign({ userId: existUser.id, email: existUser.email }, process.env.SECRET_KEY);
            return res.json({ message: 'Login successfully done', data: token, status: "success" });
        }

        return res.json({ message: 'Login failed => User not exist !', data: existUser, status: "error" });
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur est survenue lors du login du User.' });
    }
    
});



//###########################################################
// Vérifie le token reçu par l'utilisateur
router.get('/protected', verifyToken, async (req, res) => {
    try {
        const existUser = await classController.getUserByEmail(req.user.email);

        if (existUser) {
            return res.json({ message: 'Verify successfully done', data: existUser, status: "success" });
        }

        return res.json({ message: 'Verify failed => User not exist !', data: existUser, status: "error" });
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur est survenue lors du login du User.' });
    }
});



//###########################################################
router.post('/logout', verifyToken, async (req, res) => {
    try {
        const existUser = await classController.getUserByEmail(req.user.email);

        if (existUser) {
            return res.json({ message: 'Logout successfully done', data: existUser, status: "success" });
        }

        return res.json({ message: 'Logout failed => User not exist !', data: existUser, status: "error" });
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur est survenue lors du logout du User.' });
    }
})





module.exports = router;