const express = require('express');
const path = require('path');  // Für den einfachen Dateipfadzugriff
const app = express();
const PORT = 2000;
// Array zum Speichern der Kommentare
const comments = [];
// Middleware zum Parsen von JSON
app.use(express.json());
// "static" als statisches Verzeichnis festlegen
app.use(express.static('static'));

// Route für die Startseite festlegen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});
// POST-Endpunkt zum Speichern des Kommentars
app.post('/submit-comment', (req, res) => {
    const { name, comment } = req.body;
  
    if (name && comment) {
      // Kommentar ins Array hinzufügen
      comments.push({ name, comment });
      res.json({ message: 'Kommentar erfolgreich gespeichert!' });
    } else {
      res.status(400).json({ message: 'Name und Kommentar sind erforderlich!' });
    }
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