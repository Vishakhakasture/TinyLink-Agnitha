const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
    .then(() => {
        console.log("SUCCESS: Connected to Neon DB");
        process.exit(0);
    })
    .catch(err => {
        console.error("ERROR: Failed to connect:", err);
        process.exit(1);
    });
