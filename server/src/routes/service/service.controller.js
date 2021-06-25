const { jsonSuccess, jsonError } = require('../../utils/jsonMessages');
const { serviceSchema } = require('../../database/schemas');
const { v4 } = require('uuid');

let database;
const setDatabase = (_database) => {
	database = _database;
};

const create = async (req, res, next) => {
	const validation = serviceSchema.validate(req.body);
	if (validation.error) {
		res.json(jsonError(validation.error.details[0].message));
	} else {
		const hoster = validation.value;
		const result = await database.getService.getService({
			...hoster,
			unique: true,
		});
		if (result.length == 0) {
			const obj = jsonSuccess('Hoster Created');
			hoster.uuid = v4();
			await database.getService.createHoster(hoster);
			obj.hoster = hoster;
			res.json(obj);
		} else {
			res.json(jsonError('Hoster name already exists'));
		}
	}
};

const update = async (req, res, next) => {
	const id = req.params.id;
	const validation = serviceSchema.validate(req.body);
	if (validation.error) {
		res.json(jsonError(validation.error.details[0].message));
	} else {
		const hoster = validation.value;
		const obj = jsonSuccess('Hoster Updated');
		await database.getService.updateHoster({ UUID: id, unique: true }, hoster);
		obj.hoster = hoster;
		res.json(obj);
	}
};

const list = async (req, res, next) => {
	const hosters = await database.getService.getService({});
	res.json(hosters);
};

module.exports = {
	setDatabase,
	create,
	update,
	list,
};
