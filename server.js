const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'mocks.json');

async function loadMocks() {
    try {
        await fs.ensureFile(DATA_FILE);
        const data = await fs.readJson(DATA_FILE, { throws: false });
        return new Map(Object.entries(data || {}));
    } catch (error) {
        console.error('Error loading mocks:', error);
        return new Map();
    }
}

async function saveMocks(mocks) {
    try {
        const data = Object.fromEntries(mocks);
        await fs.writeJson(DATA_FILE, data, { spaces: 2 });
        console.log('Mocks saved successfully');
    } catch (error) {
        console.error('Error saving mocks:', error);
        throw error; // Re-throw the error so it's caught in the route handler
    }
}

let mocks;

loadMocks().then(loadedMocks => {
    mocks = loadedMocks;
    console.log('Mocks loaded successfully');
});

app.post('/create-mock', async (req, res) => {
    try {
        const { endpoint, response } = req.body;
        console.log('Received data:', { endpoint, response });
        mocks.set(endpoint, response);
        await saveMocks(mocks);
        res.json({ message: `Mock created for ${endpoint}` });
    } catch (error) {
        console.error('Error in create-mock:', error);
        res.status(500).json({ message: `Error creating mock: ${error.message}` });
    }
});

app.put('/edit-mock/*', async (req, res) => {
    try {
        const endpoint = req.path.slice('/edit-mock'.length);
        const { response } = req.body;
        console.log('Editing mock:', { endpoint, response });
        if (mocks.has(endpoint)) {
            mocks.set(endpoint, response);
            await saveMocks(mocks);
            res.json({ message: `Mock updated for ${endpoint}` });
        } else {
            res.status(404).json({ message: 'Mock not found' });
        }
    } catch (error) {
        console.error('Error in edit-mock:', error);
        res.status(500).json({ message: `Error updating mock: ${error.message}` });
    }
});

app.get('/mocks', (req, res) => {
    const mockList = Array.from(mocks.entries()).map(([endpoint, response]) => ({
        endpoint,
        response: JSON.stringify(response)
    }));
    res.json(mockList);
});

app.delete('/delete-mock/*', async (req, res) => {
    const endpoint = req.path.slice('/delete-mock'.length);
    if (mocks.has(endpoint)) {
        mocks.delete(endpoint);
        await saveMocks(mocks);
        res.json({ message: `Mock deleted for ${endpoint}` });
    } else {
        res.status(404).json({ message: 'Mock not found' });
    }
});

app.use((req, res, next) => {
    const mockResponse = mocks.get(req.path);
    if (mockResponse) {
        res.json(mockResponse);
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`API Mocker running at http://localhost:${port}`);
});
