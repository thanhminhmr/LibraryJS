var createError = require('http-errors');
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var database = require('./database');

var verifier = function(obj, struct) {
    return typeof obj === 'object' &&
        struct.every(element => {
            return typeof obj[element.name] === element.type ||
                !element.required && typeof obj[element.name] === 'undefined';
        });
}

var purifier = function(obj, struct) {
    let ret = {};
    if (typeof obj === 'object' &&
        struct.every(element => {
            if (typeof obj[element.name] === element.type ||
                !element.required && typeof obj[element.name] === 'undefined') {

                if (typeof obj[element.name] !== 'undefined') ret[element.name] = obj[element.name];
                return true;
            }
            return false;
        })) {
        return ret;
    }
    return false;
}

// ===========================================
// THIS THING IS NOT AN REST API !!!
// JUST `SOMETHING` THAT WORK FOR THE DEMO !!!

// parses incoming requests with JSON
// parses incoming requests with urlencoded
router.use(express.json(), express.urlencoded({ extended: false }),
    function(err, req, res, next) {
        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': err });
    }
);


router.get('/', function(req, res, next) {
    // TEST HERE
    // place to write anything stupid
    res.send(typeof null);
});

// =============================================================================

/**
 * GET /book
 * Return book list
 */
router.get('/book', function(req, res, next) {
    database.query('SELECT `books`.*, COUNT(`loans`.`id`) AS `borrowed` FROM `books`' +
        ' LEFT JOIN `loans` ON `books`.`id` = `loans`.`bookId` GROUP BY `books`.`id`',
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': results });
        });
});

/**
 * POST /book
 * Add a book
 */
router.post('/book', function(req, res, next) {
    // verify data
    if (!verifier(req.body, [
            { name: 'id', type: 'undefined', required: true },
            { name: 'name', type: 'string', required: true },
            { name: 'author', type: 'string', required: true },
            { name: 'publisher', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'otherInfo', type: 'string', required: false },
            { name: 'borrowed', type: 'undefined', required: true }
        ])) {

        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }

    database.query(
        mysql.format('INSERT INTO `books` (`name`, `author`, `publisher`, `quantity`, `otherInfo`) VALUES (?, ?, ?, ?, ?)', [
            req.body.name, req.body.author, req.body.publisher, req.body.quantity, req.body.otherInfo
        ]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { id: results.insertId } });
        }
    );
});

/**
 * GET /book/:id
 * Return book info by id
 */
router.get('/book/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('SELECT `books`.*, COUNT(`loans`.`id`) AS `borrowed` FROM `books`' +
            ' LEFT JOIN `loans` ON `books`.`id` = `loans`.`bookId` WHERE `books`.`id` = ? GROUP BY `books`.`id`', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);
            // something it's wrong here
            if (results.length > 1) return next(createError(500));
            // Everything's Alright - Laura Shigihara
            if (results.length == 0) {
                res.json({ 'status': 404, 'msg': 'Not Found', 'result': null });
            } else {
                res.json({ 'status': 200, 'msg': 'OK', 'result': results[0] });
            }
        }
    );
});

/**
 * PATCH /book/:id
 * Update book info by id
 */
router.patch('/book/:id(\\d+)', function(req, res, next) {
    // Purify data
    let purified = purifier(req.body, [
        { name: 'id', type: 'undefined', required: true },
        { name: 'name', type: 'string', required: false },
        { name: 'author', type: 'string', required: false },
        { name: 'publisher', type: 'string', required: false },
        { name: 'quantity', type: 'number', required: false },
        { name: 'otherInfo', type: 'string', required: false },
        { name: 'borrowed', type: 'undefined', required: true }
    ]);

    if (!purified || typeof purified !== 'object' || Object.keys(purified).length === 0) {
        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }

    database.query(
        mysql.format('UPDATE `books` SET ? WHERE `id` = ?', [purified, req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { changed: results.changedRows } });
        }
    );
});

/**
 * DELETE /book/:id
 * Delete a book by id
 */
router.delete('/book/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('DELETE FROM `books` WHERE `id` = ?', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { affected: results.affectedRows } });
        }
    );
});

// =============================================================================

/**
 * GET /user
 * Return user list
 */
router.get('/user', function(req, res, next) {
    database.query('SELECT `users`.`id`, `users`.`username`, `users`.`role`, `users`.`fullname`,' +
        ' `users`.`birthdate`, `users`.`gender`, `users`.`otherInfo`, COUNT(`loans`.`id`) AS `borrowed` FROM `users`' +
        ' LEFT JOIN `loans` ON `users`.`id` = `loans`.`userId` GROUP BY `users`.`id`',
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': results });
        });
});

/**
 * POST /user
 * Add an user (there is a requirement about username & password)
 */
router.post('/user', function(req, res, next) {
    // verify data
    if (!verifier(req.body, [
            { name: 'id', type: 'undefined', required: true },
            { name: 'username', type: 'string', required: true },
            { name: 'password', type: 'string', required: true },
            { name: 'role', type: 'number', required: true },
            { name: 'fullname', type: 'string', required: true },
            { name: 'birthdate', type: 'string', required: true },
            { name: 'gender', type: 'number', required: true },
            { name: 'otherInfo', type: 'string', required: false },
            { name: 'borrowed', type: 'undefined', required: true }
        ]) && /^\w{4,63}$/.test(req.body.username) && /^[ -~]{6,63}$/.test(req.body.password)) {

        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }

    database.query(
        mysql.format('INSERT INTO `users` (`username`, `password`, `role`, `fullname`, `birthdate`, `gender`, `otherInfo`) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            req.body.username, req.body.password, req.body.role, req.body.fullname, req.body.birthdate, req.body.gender, req.body.otherInfo
        ]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { id: results.insertId } });
        }
    );
});

/**
 * GET /user/:id
 * Return user info by id
 */
router.get('/user/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('SELECT `users`.`id`, `users`.`username`, `users`.`role`, `users`.`fullname`,' +
            ' `users`.`birthdate`, `users`.`gender`, `users`.`otherInfo`, COUNT(`loans`.`id`) AS `borrowed` FROM `users`' +
            ' LEFT JOIN `loans` ON `users`.`id` = `loans`.`userId`  WHERE `users`.`id` = ? GROUP BY `users`.`id`', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);
            // something it's wrong here
            if (results.length > 1) return next(createError(500));
            // Everything's Alright - Laura Shigihara
            if (results.length == 0) {
                res.json({ 'status': 404, 'msg': 'Not Found', 'result': null });
            } else {
                res.json({ 'status': 200, 'msg': 'OK', 'result': results[0] });
            }
        }
    );
});

/**
 * GET /user/:username
 * Return user info by username
 */
router.get('/user/:username(\\w{4,63})', function(req, res, next) {
    database.query(
        mysql.format('SELECT `users`.`id`, `users`.`username`, `users`.`role`, `users`.`fullname`,' +
            ' `users`.`birthdate`, `users`.`gender`, `users`.`otherInfo`, COUNT(`loans`.`id`) AS `borrowed` FROM `users`' +
            ' LEFT JOIN `loans` ON `users`.`id` = `loans`.`userId` WHERE `users`.`username` = ? GROUP BY `users`.`id`', [req.params.username]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);
            // something it's wrong here
            if (results.length > 1) return next(createError(500));
            // Everything's Alright - Laura Shigihara
            if (results.length == 0) {
                res.json({ 'status': 404, 'msg': 'Not Found', 'result': null });
            } else {
                res.json({ 'status': 200, 'msg': 'OK', 'result': results[0] });
            }
        }
    );
});

/**
 * PATCH /user/:id
 * Update user info by id
 */
router.patch('/user/:id(\\d+)', function(req, res, next) {
    // Purify data
    let purified = purifier(req.body, [
        { name: 'id', type: 'undefined', required: true },
        { name: 'username', type: 'undefined', required: true },
        { name: 'password', type: 'string', required: false },
        { name: 'role', type: 'number', required: false },
        { name: 'fullname', type: 'string', required: false },
        { name: 'birthdate', type: 'string', required: false },
        { name: 'gender', type: 'number', required: false },
        { name: 'otherInfo', type: 'string', required: false },
        { name: 'borrowed', type: 'undefined', required: true }
    ]);

    if (!purified || typeof purified !== 'object' || Object.keys(purified).length === 0 ||
        (typeof purified.password !== 'undefined' && /^[ -~]{6,63}$/.test(purified.password))) {
        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }

    database.query(
        mysql.format('UPDATE `users` SET ? WHERE `id` = ?', [purified, req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { changed: results.changedRows } });
        }
    );
});

/**
 * PATCH /user/:username
 * Update user info by username
 */
router.patch('/user/:username(\\w{4,63})', function(req, res, next) {
    // Purify data
    let purified = purifier(req.body, [
        { name: 'id', type: 'undefined', required: true },
        { name: 'username', type: 'undefined', required: true },
        { name: 'password', type: 'string', required: false },
        { name: 'role', type: 'number', required: false },
        { name: 'fullname', type: 'string', required: false },
        { name: 'birthdate', type: 'string', required: false },
        { name: 'gender', type: 'number', required: false },
        { name: 'otherInfo', type: 'string', required: false },
        { name: 'borrowed', type: 'undefined', required: true }
    ]);

    if (!purified || typeof purified !== 'object' || Object.keys(purified).length === 0 ||
        (typeof purified.password !== 'undefined' && /^[ -~]{6,63}$/.test(purified.password))) {
        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }

    database.query(
        mysql.format('UPDATE `users` SET ? WHERE `username` = ?', [purified, req.params.username]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { changed: results.changedRows } });
        }
    );
});

/**
 * DELETE /user/:id
 * Delete an user by id
 */
router.delete('/user/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('DELETE FROM `users` WHERE `id` = ?', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { affected: results.affectedRows } });
        }
    );
});

/**
 * DELETE /user/:username
 * Delete an user by username
 */
router.delete('/user/:username(\\w{4,63})', function(req, res, next) {
    database.query(
        mysql.format('DELETE FROM `users` WHERE `username` = ?', [req.params.username]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { affected: results.affectedRows } });
        }
    );
});

// =============================================================================

/**
 * GET /loan
 * Return loan list
 */
router.get('/loan', function(req, res, next) {
    database.query('SELECT * FROM `loans`',
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': results });
        });
});

/**
 * GET /loan/user/:id
 * Return loan list by userId
 */
router.get('/loan/user/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('SELECT * FROM `loans` WHERE `loans`.`userId` = ?', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': results });
        }
    );
});

/**
 * GET /loan/user/:username
 * Return loan list by username
 */
router.get('/loan/user/:username(\\w{4,63})', function(req, res, next) {
    database.query(
        mysql.format('SELECT `loans`.* FROM `loans`, `users` WHERE `loans`.`userId` = `users`.`id` AND `users`.`username` = ?', [req.params.username]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': results });
        }
    );
});

/**
 * GET /loan/book/:id
 * Return loan list by bookId
 */
router.get('/loan/book/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('SELECT * FROM `loans` WHERE `loans`.`bookId` = ?', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': results });
        }
    );
});

/**
 * POST /loan
 * Add loan
 */
router.post('/loan', function(req, res, next) {
    // verify data
    if (!verifier(req.body, [
            { name: 'id', type: 'undefined', required: true },
            { name: 'bookId', type: 'number', required: true },
            { name: 'userId', type: 'number', required: true },
            { name: 'borrowDate', type: 'string', required: true },
            { name: 'dueDate', type: 'string', required: true },
            { name: 'otherInfo', type: 'string', required: false }
        ])) {

        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }
    // date from string
    req.body.borrowDate = new Date(req.body.borrowDate);
    req.body.dueDate = new Date(req.body.dueDate);

    database.query(
        mysql.format('INSERT INTO `loans` (`bookId`, `userId`, `borrowDate`, `dueDate`, `otherInfo`) VALUES (?, ?, ?, ?, ?)', [
            req.body.bookId, req.body.userId, req.body.borrowDate, req.body.dueDate, req.body.otherInfo
        ]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { id: results.insertId } });
        }
    );
});

/**
 * GET /loan/:id
 * Return loan info by id
 */
router.get('/loan/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('SELECT * FROM `loans` WHERE `loans`.`id` = ?', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);
            // something it's wrong here
            if (results.length > 1) return next(createError(500));
            // Everything's Alright - Laura Shigihara
            if (results.length == 0) {
                res.json({ 'status': 404, 'msg': 'Not Found', 'result': null });
            } else {
                res.json({ 'status': 200, 'msg': 'OK', 'result': results[0] });
            }
        }
    );
});

/**
 * PATCH /loan/:id
 * Update loan info by id
 */
router.patch('/loan/:id(\\d+)', function(req, res, next) {
    // Purify data
    let purified = purifier(req.body, [
		{ name: 'id', type: 'undefined', required: true },
		{ name: 'bookId', type: 'number', required: false },
		{ name: 'userId', type: 'number', required: false },
		{ name: 'borrowDate', type: 'string', required: false },
		{ name: 'dueDate', type: 'string', required: false },
		{ name: 'otherInfo', type: 'string', required: false }
    ]);

    if (!purified || typeof purified !== 'object' || Object.keys(purified).length === 0) {
        // You fucked up...
        return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
    }

    database.query(
        mysql.format('UPDATE `loans` SET ? WHERE `id` = ?', [purified, req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { changed: results.changedRows } });
        }
    );
});


/**
 * DELETE /loan/:id
 * Delete a loan by id
 */
router.delete('/loan/:id(\\d+)', function(req, res, next) {
    database.query(
        mysql.format('DELETE FROM `loans` WHERE `id` = ?', [req.params.id]),
        function(error, results, fields) {
            // I fucked up...
            if (error) return next(error);

            // Everything's Alright - Laura Shigihara
            res.json({ 'status': 200, 'msg': 'OK', 'result': { affected: results.affectedRows } });
        }
    );
});

// =============================================================================

/* WRONG-WAY (aka You Fucked Up) */
router.use(function(req, res, next) {
    // You fucked up..
    return res.json({ 'status': 400, 'msg': 'Bad Request', 'result': null });
});

/* BROKEN-CAR (aka I Fucked Up) */
router.use(function(err, req, res, next) {
    // I fucked up...
    return res.json({ 'status': 500, 'msg': 'Internal Server Error', 'result': err });
});


module.exports = router;