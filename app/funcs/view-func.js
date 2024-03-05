// Function to export view from source database
function exportView(sourceConnection, viewName, callback) {
    const sql = `SHOW CREATE VIEW ${viewName}`;
    sourceConnection.query(sql, (err, results) => {
        if (err) {
            callback(err);
            return;
        }
        const createViewSql = results[0]['Create View'];
        callback(null, createViewSql);
    });
}

// Function to import view into destination database
function importView(destinationConnection, viewName, createViewSql, callback) {
    const sql = `CREATE OR REPLACE VIEW ${viewName} AS ${createViewSql}`;
    destinationConnection.query(sql, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}

module.exports = {
    importView,
    exportView,
}