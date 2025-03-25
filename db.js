const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mysql@2025',
    database: 'task_db',
    waitForConnections: true,
    connectionLimit: 10,  // Maintain up to 10 connections
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Database connection established successfully');
        connection.release(); // Release connection back to the pool
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Stop the app if the DB connection fails
    });

module.exports = pool;
