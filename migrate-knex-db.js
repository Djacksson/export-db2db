const db = require('./app/configs/db.config');

db.migrate.latest()
    .then(() => {
        console.log('Migration réussie.');
        process.exit(0);
    })
    .catch(error => {
        console.error('Erreur lors de la migration :',error);
        process.exit(1);
    }); 