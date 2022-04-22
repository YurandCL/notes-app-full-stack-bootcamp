import express from 'express'
import { logger } from './logger.mjs'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a midu en YouTube',
    date: '2022-01-01T00:00:00.000Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar más',
    date: '2022-01-01T18:35:24.000Z',
    important: false
  },
  {
    id: 3,
    content: 'Repasar retos de JS y Node',
    date: '2022-01-01T20:20:17.000Z',
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find((note) => note.id === Number(id))
  res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  notes = notes.filter((note) => note.id !== Number(id))
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  console.log(note)
  if (!note) {
    return res.status(400).json({ error: 'note is missing' })
  }

  if (!note.content) {
    return res.status(400).json({ error: 'note.content is missing' })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: note.important ?? false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' }).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
