const express = require('express');
const controller = require('./hoster.controller');
const { jsonSuccess } = require('../../utils/jsonMessages');
const router = express.Router();

let database;
function setDatabase(_database) {
    database = _database;
    controller.setDatabase(database);
}

router.get('/', (req, res) => {
	res.json(jsonSuccess('Hoster-Router works just fine'));
});
router.post('/create', controller.create);
router.post('/update/:id', controller.update);
router.get('/list', controller.list);
router.get('/get/:id', controller.get);
router.get('/delete/:id', controller.remove);

module.exports = {
    router,
    setDatabase
};
