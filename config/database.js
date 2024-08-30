const mysql = require('mysql2');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
    multipleStatements: true
});
con.on('error', function (err) {
    console.log('[mysql error]', err);
});
module.exports = con;