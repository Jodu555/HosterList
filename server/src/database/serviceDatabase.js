const { queryPartGeneration, removeKeyFromObject } = require('./utils');

const TABLE_NAME = 'services';
class serviceDatabase {
	constructor(database, connection) {
		this.database = database;
		this.connection = connection;
		console.log('Service Database Initialized');
	}

	createService(service) {
		this.connection.query(
			'INSERT INTO ' + TABLE_NAME + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				service.uuid,
				service.hoster_UUID,
				service.type,
				service.name,
				service.virtualisierung,
				service.neofetch_data,
				service.swap_RAM,
				service.upgrade_possibillity,
				service.uptime_percentage,
				service.testPeriod,
			],
			(error, results, fields) => {
				if (error) {
					throw error;
					this.database.reconnect();
					this.createService(service);
				}
			}
		);
	}

	//TODO: Update Users function (to update multiple users)
	async updateService(search, service) {
		try {
			removeKeyFromObject(service, 'uuid');

			if (!Object.keys(service).length > 0) {
				throw new Error('Invalid Service update Object');
			}

			let uuid = '';
			if (!search.uuid) {
				const searchresult = await this.getService(search);
				uuid = searchresult[0].UUID;
			} else {
				uuid = search.uuid;
			}

			service.update = true;

			let query = 'UPDATE ' + TABLE_NAME + ' SET ';
			const part = queryPartGeneration(service);
			query += part.query;
			query += ' WHERE UUID = ?';

			const values = part.values;
			values.push(uuid);

			this.connection.query(query, values, (error, results, fields) => {
				if (error) {
					this.database.reconnect();
					this.updateService(search, service);
				}
			});
			return await this.getService({ uuid: uuid });
		} catch (error) {
			const errormsg = `Service Update Failed: searchTerm: ${JSON.stringify(
				search
			)} Update: ${JSON.stringify(service)}  Error: ${error.message}`;
			throw new Error(errormsg);
		}
	}

	async getService(search) {
        
		let query = 'SELECT * FROM ' + TABLE_NAME + ' WHERE ';
		const part = queryPartGeneration(search);
		query += part.query;
		const values = part.values;

        if(Object.keys(search) == 0) {
            query = "SELECT * FROM " + TABLE_NAME;
        }

		return new Promise(async (resolve, reject) => {
			await this.connection.query(
				query,
				values,
				async (error, results, fields) => {
					const data = [];
					if (error) {
						throw error;
						this.database.reconnect();
						this.getService(search);
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

module.exports = serviceDatabase;
