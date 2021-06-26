const mysql = require('mysql');
const ThingDatabase = require('./thingDatabase');
class Database {
	connection = null;

	constructor() {}

	connect() {
		this.connection = mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
		});
		this.connection.connect();
		//Setup all databases here
		this.authDatabase = new ThingDatabase('accounts', 'Auth', this, this.connection);
		this.hosterDatabase = new ThingDatabase('hoster', 'Hoster', this, this.connection);
		this.serviceDatabase = new ThingDatabase('services', 'Service', this, this.connection);
	}

	disconnect() {
		if (this.connection != null) {
			this.connection.end();
			this.connection = null;
		}
	}

	reconnect() {
		this.disconnect();
		this.connect();
	}

	get getAuth() {
		return this.authDatabase;
	}

	get getHoster() {
		return this.hosterDatabase;
	}

	get getService() {
		return this.serviceDatabase;
	}
}

module.exports = Database;
