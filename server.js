/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({ origin: true }));
app.use(
  bodyParser.json({
    type: function (_req) {
      return true;
    },
  })
);

app.use(function (req, res, next) {
  console.log(`Received a ${req.method} request to ${req.url}`);
  next();
});


app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

const notes = [];
let nextId = 1;

app.get('/notes', (req, res) => {
  res.status(200).json(notes);
});

app.post('/notes', (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const newNote = { id: nextId++, content };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.delete('/notes/:id', (req, res) => {
  const noteId = Number(req.params.id);
  const index = notes.findIndex((o) => o.id === noteId);

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(index, 1);
  res.status(204).end();
});

const port = process.env.PORT || 3040;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
