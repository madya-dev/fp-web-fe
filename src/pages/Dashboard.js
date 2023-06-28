import React from 'react';
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const dashboardStyles = {
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: 1201,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: '16px',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
};

const Dashboard = ({children}) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Manajemen Karyawan', link: '/manajemen-karyawan', icon: <InboxIcon /> },
    { name: 'Slip Gaji', link: '/slip-gaji', icon: <InboxIcon /> },
    { name: 'Manajemen Proyek', link: '/manajemen-proyek', icon: <MailIcon /> },
    { name: 'Manajemen CIS', link: '/manajemen-cis', icon: <InboxIcon /> },
  ];

  return (
    <div style={dashboardStyles.root}>
      <AppBar position="fixed" style={dashboardStyles.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        style={dashboardStyles.drawer}
        variant="permanent"
        classes={{
          paper: dashboardStyles.drawerPaper,
        }}
        anchor="left"
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.link}
              button
              component={Link}
              to={item.link}
              style={location.pathname === item.link ? dashboardStyles.activeMenuItem : null}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main style={dashboardStyles.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
