// netlify/functions/register.js

const { Client } = require('pg');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Get the database connection string from Netlify's environment variables
    const connectionString = process.env.NETLIFY_DATABASE_URL;
    if (!connectionString) {
        return { statusCode: 500, body: 'Database connection URL is not configured.' };
    }

    try {
        const data = JSON.parse(event.body);
        const { name, email, number, age, gender } = data;

        const client = new Client({ connectionString });
        await client.connect();

        // SQL query to insert data into a 'registrations' table
        const query = 'INSERT INTO registrations (name, email, phone, age, gender) VALUES ($1, $2, $3, $4, $5)';
        const values = [name, email, number, age, gender];

        await client.query(query, values);
        await client.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Registration successful!' }),
        };

    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to register. Please try again.' }),
        };
    }
};