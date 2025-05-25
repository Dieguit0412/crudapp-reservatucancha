import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservaList = () => {
  const [reservas, setReservas] = useState([]);

  const cargarReservas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <div>
      <h2>Lista de Reservas</h2>
      {reservas.length === 0 ? (
        <p>No hay reservas disponibles</p>
      ) : (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              {reserva.nombre} - {reserva.fecha} - {reserva.hora}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservaList;
