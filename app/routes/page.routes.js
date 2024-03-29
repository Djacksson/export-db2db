const express = require('express');
const router = express.Router();
const { exportView, importView } = require('../funcs/view-func');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const mysql = require('mysql');

const UserController = require('../controllers/user.controller');
const ClusterController = require('../controllers/cluster.controller');
const classUser = new UserController();
const classCluster = new ClusterController();

router.get('/', (req, res) => res.render('index'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/register', (req, res) => res.render('register'));
router.get('/managedb', (req, res) => res.render('managedb'));
router.get('/backup', (req, res) => res.render('backup'));

router.get('/request', (req, res) => {
    try {
        const sourceConfig = JSON.parse(localStorage.getItem('sourceConfig_JSON'));
        const sourceConnection = mysql.createConnection(sourceConfig.dataConfig);
        const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?";

        sourceConnection.query(query, [sourceConnection.config.database], async (err, results) => {
            if (err) {
                return res.json({ message: 'Error connecting to MySQL database:', err });
            }

            await classCluster.GetDataById(sourceConfig.clusterId)
                .then(async (cluster) => {
                    user = await classUser.GetDataById(cluster.userId)
                    return res.render('request', { user_clusters: user.clusters, clusterId: sourceConfig.clusterId, db_name: sourceConfig.dataConfig.database, db_table: results });
                })
                .catch((err) => {
                    return res.render('request', { user_clusters: [], clusterId: sourceConfig.clusterId, db_name: sourceConfig.dataConfig.database, db_table: results });
                })
        });
        sourceConnection.end();
    } catch (error) {
        return res.render('request', { clusterId: "", db_name: "none", db_table: [] });
    }
});







module.exports = router;
