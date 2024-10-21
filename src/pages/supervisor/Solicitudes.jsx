import React, { useState, useEffect, useContext } from 'react';
import api from '../../components/axiosConfig';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import GlobalAlert from '../../components/GlobalAlert';
import ModalSolicitud from '../../components/supervisor/ModalSolicitud';
import { LoadingContext } from '../../context/LoadingContext';

const Solicitudes = () => {
  const [Solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [openSolicitudModal, setOpenSolicitudModal] = useState(false);
  const [reload, setReload] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);


  useEffect(() => {
    fetchSolicitudes();
    setReload(false)
  }, [reload]);

  const fetchSolicitudes = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/Solicitudes/GetSolicitudes');
      console.log(response.data)
      if (Array.isArray(response.data)) {
        setSolicitudes(response.data);
      } else {
        GlobalAlert.showError('Error fetching client: Data is not an array');
      }
    } catch (error) {
      let response = error.response ?? null;
      if(response) {
        GlobalAlert.showError('Error fetching client', response.message);
      } else {
        GlobalAlert.showError('Error logging in', error);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Solicitudes</Typography>
        <Button variant="contained" color="primary" onClick={() => { setSelectedSolicitud(null); setOpenSolicitudModal(true); }}>
          Crear
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>tipoSolicitud</TableCell>
              <TableCell>observaciones</TableCell>
              <TableCell>fechaCreacion</TableCell>
              <TableCell>fechaRespuesta</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
                {Array.isArray(Solicitudes) && Solicitudes.length > 0 ? (
                    Solicitudes.map((Solicitud) => (
                        <TableRow key={Solicitud.id}>
                            <TableCell>{Solicitud.id}</TableCell>
                            <TableCell>{Solicitud.tipoSolicitud.name}</TableCell>
                            <TableCell>{Solicitud.observaciones}</TableCell>
                            <TableCell>{Solicitud.fechaCreacion}</TableCell>
                            <TableCell>{Solicitud.fechaRespuesta}</TableCell>
                            <TableCell>{Solicitud.aprobada ? 'Aprobado' : 'Pendiente'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => { setSelectedSolicitud(Solicitud); setOpenSolicitudModal(true); }}>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                      </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={9} align="center">No hay datos disponibles</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
      </TableContainer>

      <ModalSolicitud
        open={openSolicitudModal}
        handleClose={() => setOpenSolicitudModal(false)}
        solicitud={selectedSolicitud}
        setReload={setReload}
      />
    </div>
  );
};

export default Solicitudes;
