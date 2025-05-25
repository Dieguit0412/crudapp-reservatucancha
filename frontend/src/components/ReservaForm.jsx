import React, { useState } from 'react';
import axios from 'axios';

const ReservaForm = ({ onReservaCreada }) => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar campos
    if (!nombre.trim() || !fecha || !hora) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Combinar fecha y hora en formato ISO 24h
    const fechaHoraISO = new Date(`${fecha}T${hora}:00`).toISOString();

    const nuevaReserva = { nombre: nombre.trim(), fecha: fechaHoraISO };

    try {
      setLoading(true);
      await axios.post('http://localhost:3001/reservas', nuevaReserva);
      onReservaCreada(); // Actualiza la lista
      setNombre('');
      setFecha('');
      setHora('');
    } catch (err) {
      setError('Error al crear la reserva. Intenta nuevamente.');
      console.error('Error al crear la reserva:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Crear nueva reserva</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default ReservaForm;
