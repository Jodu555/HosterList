const { jsonSuccess, jsonError } = require('../utils/jsonMessages');
const { userRegisterSchema, userLoginSchema } = require('../database/schemas');
const { sendVerificationMessage } = require('../utils/mailer')
const { v4 } = require('uuid');

let database;
const setDatabase = (_database) => {
    database = _database;
};

const create = async (req, res, next) => {

};

const update = async (req, res, next) => {

};

const list = async (req, res, next) => {

};

module.exports = {
    setDatabase,
    
}