const express = require('express');
const path = require('path');
const fs = require('fs'); // Modul für Dateizugriff
const app = express();
const PORT = 2000;

// Middleware zum Parsen von JSON
app.use(express.json());

// Statisches Verzeichnis festlegen
app.use(express.static('static'));

// Datei-Pfad für die Kommentare
const commentsFilePath = path.join(__dirname, 'comments.json');

// Funktion zum Laden der Kommentare aus der JSON-Datei
function loadComments() {
  try {
    const data = fs.readFileSync(commentsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Falls die Datei nicht existiert oder fehlerhaft ist, geben wir ein leeres Array zurück
    return [];
  }
}

// Funktion zum Speichern der Kommentare in der JSON-Datei
function saveComments(comments) {
  fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
}

// POST-Endpunkt zum Speichern des Kommentars
app.post('/submit-comment', (req, res) => {
  const { name, comment } = req.body;

  if (name && comment) {
    // Kommentare laden, neuen Kommentar hinzufügen und speichern
    const comments = loadComments();
    comments.push({ name, comment });
    saveComments(comments);

    res.json({ message: 'Kommentar erfolgreich gespeichert!' });
  } else {
    res.status(400).json({ message: 'Name und Kommentar sind erforderlich!' });
  }
});

// GET-Endpunkt, um alle Kommentare zurückzugeben
app.get('/comments', (req, res) => {
  const comments = loadComments();
  res.json(comments);
});

// Routen für die verschiedenen Seiten
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/page1', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'page1.html'));
});

app.get('/page2', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'page2.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
