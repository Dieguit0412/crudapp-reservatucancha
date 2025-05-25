import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/reservas';

// Contexto para reservas
const ReservasContext = createContext();

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);

  const fetchReservas = async () => {
    try {
      const res = await axios.get(API_URL);
      setReservas(res.data);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const agregarReserva = async (nuevaReserva) => {
    await axios.post(API_URL, nuevaReserva);
    fetchReservas();
  };

  const actualizarReserva = async (id, reservaActualizada) => {
    await axios.put(`${API_URL}/${id}`, reservaActualizada);
    fetchReservas();
  };

  const eliminarReserva = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchReservas();
  };

  return (
    <ReservasContext.Provider
      value={{
        reservas,
        agregarReserva,
        actualizarReserva,
        eliminarReserva,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

function Reservas() {
  const { reservas, agregarReserva, actualizarReserva, eliminarReserva } = useContext(ReservasContext);

  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const validarFormulario = () => {
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return false;
    }
    const hoy = new Date();
    const fechaSeleccionada = new Date(fecha);
    // Quitar tiempo para comparar solo fechas
    hoy.setHours(0,0,0,0);
    fechaSeleccionada.setHours(0,0,0,0);

    if (fechaSeleccionada < hoy) {
      setError('La fecha no puede ser anterior a hoy.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nuevaReserva = { nombre, fecha };

    try {
      if (editingId) {
        await actualizarReserva(editingId, nuevaReserva);
        setEditingId(null);
      } else {
        await agregarReserva(nuevaReserva);
      }
      setNombre('');
      setFecha('');
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      setError('Ocurrió un error guardando la reserva.');
    }
  };

  const handleEdit = (reserva) => {
    setNombre(reserva.nombre);
    setFecha(reserva.fecha);
    setEditingId(reserva.id);
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      await eliminarReserva(id);
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
    }
  };

  return (
    <div className="App">
      <h1>CRUD de Reservas</h1>
      <form onSubmit={handleSubmit} noValidate>
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
        {error && <div className="error">{error}</div>}
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            {reserva.nombre} - {reserva.fecha}
            <button onClick={() => handleEdit(reserva)}>Editar</button>
            <button onClick={() => handleDelete(reserva.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reservas;

