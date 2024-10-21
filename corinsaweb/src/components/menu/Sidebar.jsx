import React, { useState, useContext, useEffect  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard, Assignment, Group, Calculate, Category, QrCode, HowToReg, Class, History,
  ExpandLess, ExpandMore, Settings, PersonSearch, VerifiedUser, Inventory, Payments,
  More
} from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Divider  } from '@mui/material';
import logo from '../../assets/logo.png'; 
const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();


  const handleClick = (section) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [section]: !prevOpenSections[section],
    }));
  };

  useEffect(() => {
    // Define qué secciones deben estar abiertas en función de la ruta actual
    const pathToSectionMap = {
      '/tareas/clientes': 'tareas',
      '/seguridad/perfiles': 'seguridad',
      '/seguridad/usuarios': 'seguridad',
      '/seguridad/permisos': 'seguridad'
      // Agrega más rutas y secciones según sea necesario
    };

    const sectionToOpen = pathToSectionMap[location.pathname];
    if (sectionToOpen) {
      setOpenSections((prevOpenSections) => ({
        ...prevOpenSections,
        [sectionToOpen]: true,
      }));
    }
  }, [location.pathname]);
  return (
    <div
      style={{
        width: "250px",
        background: "#0b40a8",
        height: "150vh",
        color: "white",
      }}
    >
      <div style={{ padding: "20px", textAlign: "center" }}>
        <img src={logo} alt="Company Logo" style={{ width: "100px" }} />
      </div>
      <Divider style={{ backgroundColor: "white" }} />
      <List>
        <ListItemButton
          component={Link}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
        >
          <ListItemIcon>
            <Dashboard style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
          <>
            <ListItemButton onClick={() => handleClick("tareas")}>
              <ListItemIcon>
                <Assignment style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Tareas" />
              {openSections.tareas ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={openSections.tareas} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/tasks"
                    selected={location.pathname === "/tasks"}
                  >
                    <ListItemIcon>
                      <Group style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                  </ListItemButton>
              </List>
            </Collapse>
          </>
      </List>
    </div>
  );
};

export default Sidebar;
