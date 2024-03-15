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

const ClusterController = require('../controllers/cluster.controller');
const classController = new ClusterController()

// Handle form submission
router.post('/addCluster', (req, res) => {
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

        classController.InsertData(req.body);
        return res.json({ message: "Connexion sucess !", config: sourceConfig });
    })
    sourceConnection.end();
})


// Handle form submission
router.post('/getClusterByUser', verifyToken, async (req, res) => {
    try {
        const cluster = await classController.GetDataByUser(req.body.userId);

        if (cluster) {
            return res.json({ message: 'Data successfully found', data: cluster, status: "success" });
        }

        return res.json({ message: 'Search failed => Data not exist !', data: null, status: "error" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la recuperation des cluster.' });
    }
})


// Handle form submission
router.post('/getClusterById', verifyToken, async (req, res) => {
    try {
        const cluster = await classController.GetDataById(req.body.clusterId);

        if (cluster) {
            return res.json({ message: 'Data successfully found', data: cluster, status: "success" });
        }

        return res.json({ message: 'Search failed => Data not exist !', data: null, status: "error" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la recuperation des cluster.' });
    }
})


router.post('/connectCluster', verifyToken, async (req, res) => {
    try {
        const cluster = await classController.GetDataById(req.body.clusterId);

        if (cluster) {
            const sourceConfig = {
                clusterId: cluster.id,
                dataConfig: {
                    host: cluster.host,
                    user: cluster.user,
                    password: cluster.password,
                    database: cluster.database
                }
            }

            localStorage.setItem('sourceConfig_JSON', JSON.stringify(sourceConfig));
            await classController.UpdateData({ status: true, id: req.body.clusterId });
            return res.json({ message: 'Data successfully found', data: cluster, status: "success" });
        }

        return res.json({ message: 'Search failed => Data not exist !', data: null, status: "error" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la recuperation des cluster.' });
    }
})


//###########################################################
router.post('/getTableCluster', async (req, res) => {
    const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
    const sourceConnection = mysql.createConnection(sourceConfig.dataConfig);

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


router.post('/executeQuery', async (req, res) => {
    try {
        const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
        const sourceConnection = mysql.createConnection(sourceConfig.dataConfig);

        // Execute the query
        sourceConnection.query(req.body.queryContent, (error, resultTable) => {
            if (error) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            return res.json({ message: 'All Column !', table_data: resultTable });
        });
        sourceConnection.end();
    } catch (error) {
        return res.json({ message: 'All Column !', table_data: [] });
    }
})


router.post('/createView', async (req, res) => {
    console.log(req.body);

    const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
    const sourceConnection = mysql.createConnection(sourceConfig.dataConfig);
    // const destinationConnection = mysql.createConnection(sourceConfig.dataConfig);

    // Create a view with the retrieved data
    const createViewQuery = `CREATE OR REPLACE VIEW ${req.body.viewName}_view AS SELECT * FROM (${req.body.queryContent}) AS ${req.body.viewName}_data`;
    sourceConnection.query(createViewQuery, (err, resultView) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('View created: acteur_view', resultView);
        return res.json({ message: 'All Column !', data: resultView });
    });
    sourceConnection.end();
})


router.post('/transfertData', async (req, res) => {
    console.log(req.body);

    const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
    const sourceConnection = mysql.createConnection(sourceConfig.dataConfig);
    const destinationConnection = mysql.createConnection(sourceConfig.dataConfig);

    // Export view from source database
    exportView(sourceConnection, req.body.viewName, (err, createViewSql) => {
        if (err) {
            console.error('Error exporting view:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        // Import view into destination database
        importView(destinationConnection, req.body.viewName, createViewSql, (err) => {
            if (err) {
                console.error('Error importing view:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.render('success', { message: 'View export/import completed successfully.' });
        });

        res.send('Export operation completed successfully.');
    });
})

//###########################################################
router.post('/logoutCluster', async (req, res) => {
    try {
        const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));

        if (sourceConfig.clusterId === req.body.clusterId) {
            localStorage.removeItem('sourceConfig_JSON');
            await classController.UpdateData({ status: false, id: sourceConfig.clusterId });
            return res.json({ message: 'Data successfully found', config: sourceConfig, status: "success" });
        }
    } catch (error) {
        return res.json({ message: 'Error to logout Database !', status: "error" });
    }
})


module.exports = router;