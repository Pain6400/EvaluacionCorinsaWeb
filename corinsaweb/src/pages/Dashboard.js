import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';

const Dashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axiosInstance.get('/solicitudes/supervisor');
        setSolicitudes(response.data);
      } catch (error) {
        console.error('Error fetching solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleApproval = async (id, status) => {
    // Lógica para aprobar/rechazar solicitudes
  };

  return (
    <div>
      <h1>Solicitudes Asignadas</h1>
      <ul>
        {solicitudes.map((solicitud) => (
          <li key={solicitud.id}>
            {solicitud.descripcion}
            <button onClick={() => handleApproval(solicitud.id, 'approved')}>Aprobar</button>
            <button onClick={() => handleApproval(solicitud.id, 'rejected')}>Rechazar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
