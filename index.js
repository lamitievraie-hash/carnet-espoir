const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./carnet.db');

db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  telephone TEXT,
  quartier TEXT,
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/api/contacts', (req, res) => {
  db.all("SELECT * FROM contacts ORDER BY id DESC", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/api/contacts', (req, res) => {
  const { nom, telephone, quartier } = req.body;
  db.run(
    "INSERT INTO contacts (nom, telephone, quartier) VALUES (?,?,?)",
    [nom, telephone, quartier],
    function(err) {
      if (err) return res.json({ error: err.message });
      res.json({ id: this.lastID, message: 'Ajouté !' });
    }
  );
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Carnet sur port ${PORT}`));
