const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { router: auth, setDatabase: auth_setDatabase } = require('./routes/auth/auth');
const { router: hoster, setDatabase: hoster_setDatabase } = require('./routes/hoster/hoster');
const { router: service, setDatabase: service_setDatabase } = require('./routes/service/service');
const { jsonSuccess, jsonError } = require('./utils/jsonMessages');
const dotenv = require('dotenv').config();
const Database = require('./database/Database');
const authManager = require('./utils/authManager');

const database = new Database();
database.connect();

auth_setDatabase(database);
hoster_setDatabase(database);
service_setDatabase(database);

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());

app.use('/auth', auth);
app.use('/hoster', authManager.authentication, hoster);
app.use('/service', authManager.authentication, service);

app.get('/', (req, res) => {
	res.json(jsonSuccess('Basic Auth API works just fine!'));
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
	console.log(`Express App Listening on ${PORT}`);
});
