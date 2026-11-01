require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const app = express();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Backend is Running Successfully!');
});

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add student
app.post('/students', async (req, res) => {
    try {
        const student = await prisma.student.create({
            data: req.body
        });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student
app.put('/students/:id', async (req, res) => {
    try {
        const student = await prisma.student.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete student
app.delete('/students/:id', async (req, res) => {
    try {
        await prisma.student.delete({
            where: { id: Number(req.params.id) }
        });
        res.json({ message: 'Student Deleted Successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database Running Successfully!');

        app.listen(5000, () => {
            console.log('Backend is Running Successfully!');
            console.log('Server running on port 5000');
            console.log('Link: http://localhost:5000');
        });
    } catch (error) {
        console.log('Database Connection Error:', error.message);
    }
}

startServer();