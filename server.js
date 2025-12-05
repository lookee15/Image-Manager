// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'client','public')));

// Route: Get image filename by name
app.get('/api/getImage', (req, res) => {
  let name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: 'Missing ?name parameter' });
  }

  // If no extension, default to .jpg
  if (!path.extname(name)) {
    name = `${name}.jpg`;
  }

  res.json({ filename: name });
});

// Multer setup: temporary storage
const upload = multer({ dest: 'uploads/' });

// Route: Upload image with user-provided name
app.post('/api/upload', upload.single('image'), (req, res) => {
  let name = req.query.name; // e.g. "cat" or "cat.png"
  if (!name) {
    return res.status(400).json({ error: 'Missing ?name parameter' });
  }

  // If no extension, default to .jpg
  if (!path.extname(name)) {
    name = `${name}.jpg`;
  }

  const destPath = path.join(__dirname, 'client','public', name);

  fs.rename(req.file.path, destPath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File save failed' });
    }
    res.json({ message: `Image saved as ${name}`, filename: name });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});