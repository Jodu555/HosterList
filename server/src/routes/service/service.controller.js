const { jsonSuccess, jsonError } = require('../../utils/jsonMessages');
const { serviceSchema, serviceUpdateSchema } = require('../../database/schemas');
const { parse } = require('../../utils/neofetchParser');
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
		const service = validation.value;
		const result = await database.getService.get({
			...service,
			unique: true,
		});
		if (result.length == 0) {
			const hosterResult = await database.getHoster.get({
				UUID: service.hoster_UUID,
				unique: true,
			});
			if(hosterResult.length > 0) {
				const obj = jsonSuccess('Service Created');
				service.uuid = v4();
				service.neofetch_data = parse(service.neofetch_data);
				service.neofetch_data = JSON.stringify(service.neofetch_data);
				await database.getService.create(service);
				obj.service = service;
				res.json(obj);
			} else {
				res.json(jsonError('Hoster UUID does not exist!'));
			}
		} else {
			res.json(jsonError('Service already exists'));
		}
	}
};

const update = async (req, res, next) => {
	const id = req.params.id;
	const validation = serviceUpdateSchema.validate(req.body);
	if (validation.error) {
		res.json(jsonError(validation.error.details[0].message));
	} else {
		const service = validation.value;
		const obj = jsonSuccess('Service Updated');
		await database.getService.update({ UUID: id, unique: true }, service);
		obj.service = service;
		res.json(obj);
	}
};

const list = async (req, res, next) => {
	const service = await database.getService.get({});
	const obj = jsonSuccess('Services Loaded');
	obj.services = service;
	res.json(obj);
};

const listByHoster = async (req, res, next) => {
	const id = req.params.hosterID;
	const service = await database.getService.get({hoster_UUID: id});
	const obj = jsonSuccess('Services Loaded');
	obj.services = service;
	res.json(obj);
};

const remove = async (req, res, next) => {
	const id = req.params.id;
	const result = await database.getService.get({
		UUID: id,
		unique: true,
	});
	if(result.length > 0) {
		await database.getService.delete({UUID: id});
		res.json(jsonSuccess('Service successfully deleted!'));
	} else {
		res.json(jsonError('Service does not exist!'));
	}
};

module.exports = {
	setDatabase,
	create,
	update,
	list,
	listByHoster,
	remove
};
