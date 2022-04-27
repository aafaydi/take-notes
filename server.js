const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const uuidv1 = require('uuid');

const PORT = process.env.PORT || 8000;
const path = require('path');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.get('/notes', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'notes.html')); });
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', function (err, contents) {
    let words = JSON.parse(contents);
    res.send(words);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {

    if (err) throw err;

    let json = JSON.parse(data);
    let note = {
      title: req.body.title,
      text: req.body.text,
      id: uuidv1()
    }
    json.push(note);


    fs.writeFile('db/db.json', JSON.stringify(json, null, 2), (err) => {

      if (err) throw err;
      res.send('200');
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {

  fs.readFile('db/db.json', (err, data) => {

    if (err) throw err;
    let deleteId = req.params.id;

    let json = JSON.parse(data);
    json.forEach((item, i) => {
      if (item.id.includes(deleteId)) {
        json.splice(i, 1);
      }
    });

    fs.writeFile('db/db.json', JSON.stringify(json, null, 2), (err) => {

      if (err) throw err;
      res.send('200');
    });
  });
})

app.listen(PORT);