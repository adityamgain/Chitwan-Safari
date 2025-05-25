const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '192.250.235.22',       // Your MySQL host
    user: 'nawalpur_Aditya',      // Your MySQL username
    password: 'z$3pQhjG&^f_',     // Your MySQL password
    database: 'nawalpur_safari', // The name of your database
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Optional: test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to cPanel MySQL database!');
        connection.release(); // Release after testing
    }
});

module.exports = pool;
