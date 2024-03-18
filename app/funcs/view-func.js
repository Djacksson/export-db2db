// Function to export view from source database
async function exportView(baseConnexion, sqlQuery, callback) {
    // const sql = `SHOW CREATE VIEW ${viewName}`;
    baseConnexion.query(sqlQuery, (err, results) => {
        if (err) {
            callback(err);
            return;
        }
        const createViewSql = results[0];
        callback(null, createViewSql);
    });
}

// Function to import view into destination database
async function importView(baseConnexion, viewName, createViewSql, callback) {
    const sql = `CREATE OR REPLACE VIEW view_${viewName} AS SELECT * FROM (${createViewSql}) AS ${viewName}_data`;
    baseConnexion.query(sql, (err, resultView) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, resultView);
    });
}

// Function to create table into destination database
async function createTable(sourceConnection, destinationConnection, tableName, callback) {
    const schemaQuery = `
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = ?;
  `;

    sourceConnection.query(schemaQuery, [tableName], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('Schema:',results);

        // const createTableQuery = `
        // CREATE TABLE IF NOT EXISTS ${tableName} (
        //   ${results.map(column => `${column.COLUMN_NAME} ${column.DATA_TYPE} ${column.IS_NULLABLE === 'NO' ? 'NOT NULL' : ''}`).join(',')});`;

        // destinationConnection.query(createTableQuery, [tableName], (err, resultTable) => {
        //     if (err) {
        //         callback(err, null);
        //         return;
        //     }

        //     console.log('Table created',resultTable);
        //     callback(null, true);
        // })
    })
}

// Function to create table into destination database
async function importTable(baseConnexion, tableName, tableData, callback) {
    console.log('Tab name', tableName);
    baseConnexion.query(`INSERT INTO ${tableName} SET ?`, tableData, (err, resultTab) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, resultTab);
    });
}

module.exports = {
    importView,
    exportView,
    createTable,
    importTable,
}