const { jsonSuccess, jsonError } = require('../../utils/jsonMessages');
const { userRegisterSchema, userLoginSchema } = require('../../database/schemas');
const { sendVerificationMessage } = require('../../utils/mailer')
const { v4 } = require('uuid');
const authManager = require('../../utils/authManager');
const bcrypt = require('bcryptjs');

let database;
const setDatabase = (_database) => {
    database = _database;
};

const register = async (req, res, next) => {
    const validation = userRegisterSchema.validate(req.body);
    if (validation.error) {
        res.json(jsonError(validation.error.details[0].message));
    } else {
        const user = validation.value
        const search = { ...user }; //Spreading to disable the reference
        delete search.password;
        search.unique = true;
        const result = await database.getAuth.get(search);

        if (result.length == 0) {
            const obj = jsonSuccess('Registered');
            const token = generateVerificationToken();
            user.verificationToken = '';
            user.uuid = v4();
            // user.verified = user.verified ? user.verified : 'false';
            user.verified = true;
            user.password = await bcrypt.hash(user.password, 8);
            await database.getAuth.create(user);
            // sendVerificationMessage(user.username, user.email, token);

            delete user.password;
            delete user.verificationToken;
            obj.user = user;
            res.json(obj);
        } else {
            res.json(jsonError('The email or the username is already taken!'));
        }
    }
};

const login = async (req, res, next) => {
    const validation = userLoginSchema.validate(req.body);
    if (validation.error) {
        res.json(jsonError(validation.error.details[0].message));
    } else {
        const user = validation.value;
        const result = await database.getAuth.get({ username: user.username, unique: true });
        if (result.length > 0) {
            console.log(user, result[0]);
            if (await bcrypt.compare(user.password, result[0].password)) {
                const obj = jsonSuccess('Successfully logged In');
                const token = v4();
                obj.token = token;
                authManager.addToken(token, user)
                res.json(obj);
            } else {
                res.json(jsonError('Invalid password!'))
            }
        } else {
            const value = user.username ? 'username' : 'email';
            res.json(jsonError('Invalid ' + value + '!'))
        }
    }
};


const logout = async (req, res, next) => {
    authManager.removeToken(req.credentials.token);
    res.json(jsonSuccess('Successfully loggedout'));
}

const emailValidation = async (req, res, next) => {
    const token = req.params.token;
    const result = await database.getAuth.get({
        unique: true,
        verificationToken: token,
        verified: 'false',
    });
    if (result.length > 0) {
        const user = await database.getAuth.update({ uuid: result[0].UUID }, { verified: 'true', verificationToken: '' });
        const response = jsonSuccess('Valid Token! Account verified!');
        response.user = user[0];
        delete response.user.password;
        res.json(response);
    } else {
        res.json(jsonError('Invalid Token please Try Again!'));
    }

};

function generateVerificationToken() {
    let token = '';
    for (let i = 0; i < 7; i++) {
        token += v4();
    }
    token = token.split('-').join('');
    return token;
};

module.exports = {
    setDatabase,
    register,
    login,
    logout,
    emailValidation
}