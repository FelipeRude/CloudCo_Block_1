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
  const comments = loadComments();
  const commentsHTML = comments
    .map(comment => `
      <div class="card mt-2">
        <div class="card-body">
          <h5 class="card-title">${comment.name}</h5>
          <p class="card-text">${comment.comment}</p>
        </div>
      </div>
    `)
    .join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <title>Alle Kommentare</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link" href="/index">Startseite</a></li>
              <li class="nav-item"><a class="nav-link" href="/page1">Page 1</a></li>
              <li class="nav-item"><a class="nav-link" href="/page2">Page 2</a></li>
              <li class="nav-item"><a class="nav-link" href="/page3">Page 3</a></li>
            </ul>
          </div>
        </nav>

        <h1>Alle gespeicherten Kommentare</h1>
        <div class="container mt-4">${commentsHTML}</div>
      </body>
    </html>
  `);
});

app.get('/page3', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'page3.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
