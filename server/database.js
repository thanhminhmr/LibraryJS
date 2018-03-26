
// Database setup

module.exports = require('mysql').createPool({
	connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'library_db'
});
