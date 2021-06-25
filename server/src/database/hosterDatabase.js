const { queryPartGeneration, removeKeyFromObject } = require('./utils');
class hosterDatabase {
	constructor(database, connection) {
		this.database = database;
		this.connection = connection;
		console.log('Hoster Database Initialized');
	}

	createHoster(hoster) {
		this.connection.query(
			'INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?)',
			[
				hoster.uuid,
				hoster.name,
				hoster.email,
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
	async updateHoster(search, hoster) {
		try {
			removeKeyFromObject(hoster, 'uuid');

			if (!Object.keys(hoster).length > 0) {
				throw new Error('Invalid hoster update Object');
			}

			let uuid = '';
			if (!search.uuid) {
				const searchresult = await this.gethoster(search);
				uuid = searchresult[0].UUID;
			} else {
				uuid = search.uuid;
			}

			hoster.update = true;

			let query = 'UPDATE accounts SET ';
			const part = queryPartGeneration(hoster);
			query += part.query;
			query += ' WHERE UUID = ?';

			const values = part.values;
			values.push(uuid);

			this.connection.query(query, values, (error, results, fields) => {
				if (error) {
					this.database.reconnect();
					this.updatehoster(search, hoster);
				}
			});
			return await this.gethoster({ uuid: uuid });
		} catch (error) {
			const errormsg = `hoster Update Failed: searchTerm: ${JSON.stringify(
				search
			)} Update: ${JSON.stringify(hoster)}  Error: ${error.message}`;
			throw new Error(errormsg);
		}
	}

	async getHoster(search) {
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
						this.gethoster(search);
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
