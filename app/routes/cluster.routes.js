require('dotenv').config()
const express = require('express');
const router = express.Router();
const { exportView, importView } = require('../funcs/view-func');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const mysql = require('mysql');
const { Parser } = require('node-sql-parser');
const parser = new Parser();

const { verifyToken } = require('../middlewares/user.middleware');

// MySQL connection configurations for source and destination databases
const destinationConfig = {
    host: 'destination_host',
    user: 'destination_user',
    password: 'destination_password',
    database: 'destination_database'
};


// Handle form submission
router.post('/connect_db', (req, res) => {
    // Retrieve destination database configuration from form data
    const sourceConfig = {
        host: req.body.host,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database
    };

    // Perform export operation with destinationConfig
    const sourceConnection = mysql.createConnection(sourceConfig);

    sourceConnection.connect((err) => {
        if (err) {
            return res.json({ message: "Connexion failed !", db_table: null });
        }

        localStorage.setItem('sourceConfig_JSON', JSON.stringify(sourceConfig));
        return res.json({ message: "Connexion sucess !", config: sourceConfig });
    })
    sourceConnection.end();
})


//###########################################################
router.post('/show_table', async (req, res) => {
    const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
    const sourceConnection = mysql.createConnection(sourceConfig);

    sourceConnection.query(`SELECT * FROM ${req.body.table_name}`, (err, results) => {
        if (err) {
            console.error(`Error fetching data from table ${req.body.table_name}:`, err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        return res.json({ message: 'All Column !', table_data: results });
    });
    sourceConnection.end();
})

//###########################################################
router.post('/check_query', async (req, res) => {
    try {
        parser.astify(req.body.sqlQuery);
        return res.json({ message: 'All Column !', check_value: true });
    } catch (error) {
        return res.json({ message: 'All Column !', check_value: false });
    }
})


router.post('/excute_query', async (req, res) => {
    console.log('data', req.body);

    // Create connections to source and destination databases
    const destinationConnection = mysql.createConnection(destinationConfig);

    // // Name of the view to export and import
    // const viewName = 'your_view_name';

    // // Export view from source database
    // exportView(sourceConnection, viewName, (err, createViewSql) => {
    //     if (err) {
    //         console.error('Error exporting view:', err);
    //         res.render('error', { message: 'Error exporting view' });
    //         return;
    //     }
    //     // Import view into destination database
    //     importView(destinationConnection, viewName, createViewSql, (err) => {
    //         if (err) {
    //             console.error('Error importing view:', err);
    //             res.render('error', { message: 'Error importing view' });
    //             return;
    //         }
    //         res.render('success', { message: 'View export/import completed successfully.' });
    //     });

    //     res.send('Export operation completed successfully.');
    // });
})




module.exports = router;