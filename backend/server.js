const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let reservas = [];
let idCounter = 1;

// Obtener todas las reservas
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

// Crear una nueva reserva
app.post('/reservas', (req, res) => {
  const { nombre, fecha } = req.body;
  if (!nombre || !fecha) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const nuevaReserva = { id: idCounter++, nombre, fecha };
  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});

// Actualizar una reserva
app.put('/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, fecha } = req.body;
  const reservaIndex = reservas.findIndex(r => r.id === parseInt(id));
  if (reservaIndex === -1) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  reservas[reservaIndex] = { id: parseInt(id), nombre, fecha };
  res.json(reservas[reservaIndex]);
});

// Eliminar una reserva
app.delete('/reservas/:id', (req, res) => {
  const { id } = req.params;
  reservas = reservas.filter(r => r.id !== parseInt(id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
