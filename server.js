const express = require('express');
const { join } = require('node:path');
const fs = require('fs-extra');

const cors = require('cors');
const translate = require('google-translate-api-x');


const app = express();
const PORT = 3000;
const IMAGE_DIR = join(__dirname, "./image_for _cuisines/data");

app.use(cors());
app.use(express.json());

// Image serving route
app.get("/img/:partialName", (req, res) => {
    const partialName = req.params.partialName;

    fs.readdir(IMAGE_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read image directory" });
        }

        const matchedFile = files.find(file => file.includes(partialName));

        if (matchedFile) {
            res.sendFile(join(IMAGE_DIR, matchedFile));
        } else {
            res.status(404).json({ error: "Image not found" });
        }
    });
});

// Translation route
app.post('/translate', async (req, res) => {
    const { text, from, to } = req.body;

    try {
        const result = await translate(text, { from, to });
        res.json({ translatedText: result.text });
    } catch (err) {
        console.error('Translation error:', err);
        res.status(500).json({ error: 'Translation failed' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
