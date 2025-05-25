// App.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// URL API
const API_URL = 'http://localhost:3001/reservas';

// Crear el contexto
const ReservasContext = createContext();

// Proveedor del contexto con toda la lógica
function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener reservas
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

  // Agregar reserva
  const agregarReserva = async (reserva) => {
    try {
      await axios.post(API_URL, reserva);
      fetchReservas();
    } catch {
      setError('Error al agregar la reserva');
    }
  };

  // Actualizar reserva
  const actualizarReserva = async (id, reserva) => {
    try {
      await axios.put(`${API_URL}/${id}`, reserva);
      fetchReservas();
    } catch {
      setError('Error al actualizar la reserva');
    }
  };

  // Eliminar reserva
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

// Hook para usar el contexto
function useReservas() {
  return useContext(ReservasContext);
}

// Componente para un solo ítem de reserva
function ReservaItem({ reserva, onEdit, onDelete }) {
  return (
    <li>
      {reserva.nombre} - {reserva.fecha} {reserva.hora}{' '}
      <button onClick={() => onEdit(reserva)}>Editar</button>{' '}
      <button onClick={() => onDelete(reserva.id)}>Eliminar</button>
    </li>
  );
}

// Componente Reservas con formulario y lista
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

    const nuevaReserva = { nombre: nombre.trim(), fecha, hora };

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
    setNombre(reserva.nombre);
    setFecha(reserva.fecha);
    setHora(reserva.hora || '');
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

// Componente About
function About() {
  return <h2>Acerca de la aplicación de reservas</h2>;
}

// Componente principal App con Router y Provider
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
