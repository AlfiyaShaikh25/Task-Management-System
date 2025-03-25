const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the connection pool
const taskRoutes = require('./controller/task');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/task', taskRoutes);

// Ensure DB connection is established once when the server starts
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database is connected and ready');
        connection.release(); // Release connection back to the pool

        app.listen(5000, () => console.log('🚀 Server started on port 5000'));
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Stop the app if DB connection fails
    }
})();
