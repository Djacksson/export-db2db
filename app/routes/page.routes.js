const express = require('express');
const router = express.Router();
const { exportView, importView } = require('../funcs/view-func');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const mysql = require('mysql');
const { Parser } = require('node-sql-parser');
const parser = new Parser();

router.get('/', (req, res) => res.render('index'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/register', (req, res) => res.render('register'));
router.get('/managedb', (req, res) => res.render('managedb'));
router.get('/request', (req, res) => res.render('request'));
router.get('/backup', (req, res) => res.render('backup'));

router.get('/request', (req, res) => {
    const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
    const sourceConnection = mysql.createConnection(sourceConfig);
    const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?";

    sourceConnection.query(query, [sourceConnection.config.database], (err, results) => {
        if (err) {
            return res.json({ message: 'Error connecting to MySQL database:', err });
        }
        return res.render('request', { db_table: results });
    });
    sourceConnection.end();
});







module.exports = router;
