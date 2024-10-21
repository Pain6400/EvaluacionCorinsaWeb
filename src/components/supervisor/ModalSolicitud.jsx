import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControlLabel, Switch } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import api from '../axiosConfig';
import GlobalAlert from '../GlobalAlert';

const Modalsolicitud = ({ open, handleClose, solicitud, setReload }) => {
  const [id, setId] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [aprobada, setAprobada] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(solicitud)
    if (solicitud) {
        setId(solicitud.id);
      setTipoSolicitud(solicitud.tipoSolicitud.name);
      setObservaciones(solicitud.observaciones);
      setFechaCreacion(solicitud.fechaCreacion);
      setAprobada(solicitud.aprobada);
    }
  }, [solicitud]);

  const handleSave = async () => {
    const validationErrors = {};

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        if (aprobada) {
          await api.post("/Solicitudes/Aprobar/" + id);
          GlobalAlert.showSuccess("solicitud actualizado correctamente");
        } else {
          await api.post("/Solicitudes/Rechazar/" + id);
          GlobalAlert.showSuccess("solicitud creado correctamente");
        }
        setReload(true);
        handleClose();
      } catch (error) {
        const response = error.response ?? null;
        if (response) {
          GlobalAlert.showError("Error guardando solicitud", response.message);
        } else {
          GlobalAlert.showError("Error guardando solicitud", error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Aprobacion"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Id"
          type="text"
          fullWidth
          value={id}
          disabled={true}
        />
        <TextField
          autoFocus
          margin="dense"
          label="tipoSolicitud"
          type="text"
          fullWidth
          value={tipoSolicitud}
          disabled={true}
        />
        <TextField
          autoFocus
          margin="dense"
          label="observaciones"
          type="text"
          fullWidth
          value={observaciones}
          disabled={true}
        />
        <TextField
          autoFocus
          margin="dense"
          label="fechaCreacion"
          type="text"
          fullWidth
          value={fechaCreacion}
          disabled={true}
        />

        <FormControlLabel
          control={
            <Switch
              checked={aprobada == 1? true : false}
              onChange={(e) => setAprobada(e.target.checked)}
              name="estado"
              color="primary"
            />
          }
          label={aprobada ? "Aprobado" : "Pendiente"}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <LoadingButton onClick={handleSave} loading={loading} color="primary">
          Guardar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Modalsolicitud;
