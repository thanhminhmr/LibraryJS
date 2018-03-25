
// Database setup

module.exports = require('mysql').createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'library_db'
});
/*
{
    books: {
        list: function(callback) {
            connection.query('SELECT * FROM `books`', callback);
        },
        getById: function() {
            connection.query(mysql.format('SELECT * FROM `books` WHERE `id` = ?', [id]));
        },
        update: function() {
            connection.query('');
        }
    },
    otherMethod: function() {}
}
*/