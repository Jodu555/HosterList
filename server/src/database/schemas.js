const Joi = require('joi');

const userRegisterSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().alphanum().min(8).max(50).required(),
    email: Joi.string().email().required(),
});

const userLoginSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().alphanum().min(8).max(50).required(),
}).xor('username', 'email');

const hosterSchema = Joi.object({
	name: Joi.string().min(3).max(30),
});

const serviceSchema = Joi.object({
	hoster_UUID: Joi.string().min(35).max(37),
    type: Joi.string(),
    name: Joi.string(),
    virtualisierung: Joi.string(),
    neofetch_data: Joi.string(),
    swap_RAM: Joi.string(),
    upgrade_possibillity: Joi.string(),
    uptime_percentage: Joi.string(),
    testPeriod: Joi.string(),
});

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    hosterSchema,
    serviceSchema
};