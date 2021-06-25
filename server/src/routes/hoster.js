const express = require('express');
const controller = require('./hoster.controller');
const { jsonSuccess } = require('../utils/jsonMessages');
const router = express.Router();

let database;
function setDatabase(_database) {
    database = _database;
    controller.setDatabase(database);
}

router.get('/', (req, res) => {
	res.json(jsonSuccess('Hoster-Router works just fine'));
});
router.post('/create', controller.register);
router.update('/update', controller.login);
router.get('/list', controller.emailValidation);

module.exports = {
    router,
    setDatabase
};
