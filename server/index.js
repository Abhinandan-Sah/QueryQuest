import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import questionRoutes from './route/questions.js';

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// app.use('/questions', questionRoutes); // Use the question routes

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

let db;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true })
    .then(client => {
        db = client.db(); // Use the default database
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch(error => console.error(error));

app.get('/word', async (req, res) => {
    try {
        const tests = await db.collection('Data').find({ anagramType: "WORD" }).toArray();
        res.status(200).json(tests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.get('/sentence', async (req, res) => {
    try {
        const tests = await db.collection('Data').find({ anagramType: "SENTENCE" }).toArray();
        res.status(200).json(tests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.get('/mcq', async (req, res) => {
    try {
        const tests = await db.collection('Data').find({ type: "MCQ" }).toArray();
        res.status(200).json(tests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.get('/read', async (req, res) => {
    try {
        const tests = await db.collection('Data').find({ type: "READ_ALONG" }).toArray();
        res.status(200).json(tests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


app.get('/', (req, res) => {
    res.send('Hello to Memories API');
});