const { jsonSuccess, jsonError } = require('../../utils/jsonMessages');
const { hosterSchema } = require('../../database/schemas');
const { v4 } = require('uuid');

let database;
const setDatabase = (_database) => {
	database = _database;
};

const create = async (req, res, next) => {
	const validation = hosterSchema.validate(req.body);
	if (validation.error) {
		res.json(jsonError(validation.error.details[0].message));
	} else {
		const hoster = validation.value;
		const result = await database.getHoster.getHoster({
			...hoster,
			unique: true,
		});
		if (result.length == 0) {
			const obj = jsonSuccess('Hoster Created');
			hoster.uuid = v4();
			await database.getHoster.createHoster(hoster);
			obj.hoster = hoster;
			res.json(obj);
		} else {
			res.json(jsonError('Hoster name already exists'));
		}
	}
};

const update = async (req, res, next) => {
	const id = req.params.id;
	const validation = hosterSchema.validate(req.body);
	if (validation.error) {
		res.json(jsonError(validation.error.details[0].message));
	} else {
		const hoster = validation.value;
		const obj = jsonSuccess('Hoster Updated');
		await database.getHoster.updateHoster({ UUID: id, unique: true }, hoster);
		obj.hoster = hoster;
		res.json(obj);
	}
};

const list = async (req, res, next) => {
	const hosters = await database.getHoster.getHoster({});
	res.json(hosters);
};

const remove = async (req, res, next) => {
	const id = req.params.id;
	const result = await database.getHoster.getHoster({
		UUID: id,
		unique: true,
	});
	if(result.length > 0) {
		await database.getHoster.deleteHoster({UUID: id});
		res.json(jsonSuccess('Hoster successfully deleted!'));
	} else {
		res.json(jsonError('Hoster does not exist!'));
	}
};

module.exports = {
	setDatabase,
	create,
	update,
	list,
	remove
};
