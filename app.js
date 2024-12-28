const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

const sessions = {};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);
  },
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/generate_code', (req, res) => {
  console.log('Generate code route hit');
  const code = generateChatCode();
  sessions[code] = null;
  res.json({ code });
});

app.post('/join-session', (req, res) => {
  const { code } = req.body;
  if (sessions[code] === undefined) {
    return res.status(404).json({ error: 'Chat code not found.' });
  }
  res.json({ message: 'Session joined successfully.' });
});

app.post('/upload/:code', upload.single('file'), (req, res) => {
  const { code } = req.params;
  if (sessions[code] === undefined) {
    return res.status(404).json({ error: 'Chat code not found.' });
  }

  sessions[code] = req.file.path;
  res.json({
    message: 'File uploaded successfully.',
    fileName: req.file.originalname,
  });
});

app.get('/download/:code', (req, res) => {
  const { code } = req.params;
  const filePath = sessions[code];
  if (!filePath) {
    return res
      .status(404)
      .json({ error: 'No file uploaded for this session.' });
  }

  const fileName = path.basename(filePath);
  res.download(filePath, fileName, (err) => {
    if (!err) {
      delete sessions[code];
      fs.unlinkSync(filePath);
    }
  });
});

function generateChatCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}
