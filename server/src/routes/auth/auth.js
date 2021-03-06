const express = require('express');
const controller = require('./auth.controller');
const { jsonSuccess } = require('../../utils/jsonMessages');
const router = express.Router();
const authManager = require('../../utils/authManager');

let database;
function setDatabase(_database) {
    database = _database;
    controller.setDatabase(database);
}

router.get('/', (req, res) => {
    res.json(jsonSuccess('Auth-Router works just fine'));
});
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', authManager.authentication, controller.logout);
router.get('/emailValidation/:token', controller.emailValidation);

module.exports = {
    router,
    setDatabase
};
