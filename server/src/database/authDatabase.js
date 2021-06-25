const { queryPartGeneration, removeKeyFromObject } = require('./utils');
class authDatabase {
	constructor(database, connection) {
		this.database = database;
		this.connection = connection;
		console.log('Auth Database Initialized');
	}

	createUser(user) {
		this.connection.query(
			'INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)',
			[
				user.uuid,
				user.username,
				user.email,
				user.password,
				user.verified ? user.verified : 'false',
				user.verificationToken,
			],
			(error, results, fields) => {
				if (error) {
					this.database.reconnect();
					this.createUser(user);
				}
			}
		);
	}

	//TODO: Update Users function (to update multiple users)
	async updateUser(search, user) {
		try {
			removeKeyFromObject(user, 'uuid');

			if (!Object.keys(user).length > 0) {
				throw new Error('Invalid user update Object');
			}

			let uuid = '';
			if (!search.uuid) {
				const searchresult = await this.getUser(search);
				uuid = searchresult[0].UUID;
			} else {
				uuid = search.uuid;
			}

			user.update = true;

			let query = 'UPDATE accounts SET ';
			const part = queryPartGeneration(user);
			query += part.query;
			query += ' WHERE UUID = ?';

			const values = part.values;
			values.push(uuid);

			this.connection.query(query, values, (error, results, fields) => {
				if (error) {
					this.database.reconnect();
					this.updateUser(search, user);
				}
			});
			return await this.getUser({ uuid: uuid });
		} catch (error) {
			const errormsg = `User Update Failed: searchTerm: ${JSON.stringify(
				search
			)} Update: ${JSON.stringify(user)}  Error: ${error.message}`;
			throw new Error(errormsg);
		}
	}

	async getUser(search) {
		let query = 'SELECT * FROM accounts WHERE ';
		const part = queryPartGeneration(search);
		query += part.query;
		const values = part.values;
		return new Promise(async (resolve, reject) => {
			await this.connection.query(
				query,
				values,
				async (error, results, fields) => {
					const data = [];
					if (error) {
						throw error;
						this.database.reconnect();
						this.getUser(search);
					}
					await results.forEach((result) => {
						data.push(result);
					});
					resolve(data);
				}
			);
		});
	}
}

module.exports = authDatabase;
