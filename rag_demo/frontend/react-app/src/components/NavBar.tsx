import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const drawerWidth = 80;

interface NavBarProps {
  onSelect: (index: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSelect }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <List>
        <ListItem button onClick={() => onSelect(0)}>
          <ListItemText primary="Setup" />
        </ListItem>
        <ListItem button onClick={() => onSelect(1)}>
          <ListItemText primary="Sources" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavBar;