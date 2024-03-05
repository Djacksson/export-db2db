const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

//############################################################
//############################################################
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("./node_modules"));


const pageRoutes = require('./routes/page.routes')
const clusterRoutes = require('./routes/cluster.routes')
const userRoutes = require('./routes/user.routes')

// Render the form
app.use('/', pageRoutes)
app.use('/user', userRoutes)
app.use('/data', clusterRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port: http://localhost:${PORT}`);
});
