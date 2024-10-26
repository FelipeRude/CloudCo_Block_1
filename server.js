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

// Routen für die verschiedenen Seiten
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});
app.get('/DeineMeinung', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'DeineMeinung.html'));
});

app.get('/MeinungenAnderer', (req, res) => {
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
        <a class="navbar-brand" href="/index">Studibars Weingarten</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/DeineMeinung">Deine Meinung</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="MeinungenAnderer">Meinungen Anderer</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="Events">Events</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
      <div class="container d-flex justify-content-center align-items-center flex-column m-5 text-center">
        <h1>Alle gespeicherten Kommentare</h1>
        <div class="container mt-4">${commentsHTML}</div>
      </div>
      </body>
    </html>
  `);
});

app.get('/Events', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'Events.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
