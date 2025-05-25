// App.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const API_URL = 'http://localhost:3001/reservas';

const ReservasContext = createContext();

function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setReservas(res.data);
    } catch (err) {
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const agregarReserva = async (reserva) => {
    try {
      await axios.post(API_URL, reserva);
      fetchReservas();
    } catch {
      setError('Error al agregar la reserva');
    }
  };

  const actualizarReserva = async (id, reserva) => {
    try {
      await axios.put(`${API_URL}/${id}`, reserva);
      fetchReservas();
    } catch {
      setError('Error al actualizar la reserva');
    }
  };

  const eliminarReserva = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchReservas();
    } catch {
      setError('Error al eliminar la reserva');
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <ReservasContext.Provider
      value={{
        reservas,
        loading,
        error,
        agregarReserva,
        actualizarReserva,
        eliminarReserva,
        fetchReservas,
        setError,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

function useReservas() {
  return useContext(ReservasContext);
}

function ReservaItem({ reserva, onEdit, onDelete }) {
  const fechaLocal = new Date(reserva.fecha).toLocaleString();

  return (
    <li>
      {reserva.nombre} - {fechaLocal}{' '}
      <button onClick={() => onEdit(reserva)}>Editar</button>{' '}
      <button onClick={() => onDelete(reserva.id)}>Eliminar</button>
    </li>
  );
}

function Reservas() {
  const {
    reservas,
    loading,
    error,
    agregarReserva,
    actualizarReserva,
    eliminarReserva,
    setError,
  } = useReservas();

  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !fecha || !hora) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Combinar fecha y hora en formato ISO
    const fechaHoraISO = new Date(`${fecha}T${hora}:00`).toISOString();
    const nuevaReserva = { nombre: nombre.trim(), fecha: fechaHoraISO };

    if (editingId) {
      actualizarReserva(editingId, nuevaReserva);
      setEditingId(null);
    } else {
      agregarReserva(nuevaReserva);
    }

    setNombre('');
    setFecha('');
    setHora('');
  };

  const handleEdit = (reserva) => {
    const fechaObj = new Date(reserva.fecha);
    const fechaStr = fechaObj.toISOString().split('T')[0];
    const horaStr = fechaObj.toTimeString().slice(0, 5); // HH:MM

    setNombre(reserva.nombre);
    setFecha(fechaStr);
    setHora(horaStr);
    setEditingId(reserva.id);
    setError(null);
  };

  return (
    <div>
      <h1>CRUD de Reservas</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
      </form>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : (
        <ul>
          {reservas.length === 0 && <li>No hay reservas</li>}
          {reservas.map((reserva) => (
            <ReservaItem
              key={reserva.id}
              reserva={reserva}
              onEdit={handleEdit}
              onDelete={eliminarReserva}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function About() {
  return <h2>Acerca de la aplicación de reservas</h2>;
}

function App() {
  return (
    <ReservasProvider>
      <Router>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>
            Reservas
          </Link>
          <Link to="/about">Acerca de</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Reservas />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ReservasProvider>
  );
}

export default App;
