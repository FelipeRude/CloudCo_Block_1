const express = require('express');
const path = require('path');  // Für den einfachen Dateipfadzugriff
const app = express();
const PORT = 2000;

// "static" als statisches Verzeichnis festlegen
app.use(express.static('static'));

// Route für die Startseite festlegen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});
  
app.get('/page1', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'page1.html'));
});

app.get('/page2', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'page2.html'));
});

app.get('/page3', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'page3.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});