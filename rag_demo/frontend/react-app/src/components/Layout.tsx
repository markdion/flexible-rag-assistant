import React, { useState } from 'react';
import { Box, Divider, Grid } from '@mui/material';
import NavBar from './NavBar';
import Chat from './Chat';
import SetupPane from './SetupPane';
import ContextPane from './ContextPane';

const drawerWidth = 80;

function Layout(): JSX.Element {
  const [selectedPane, setSelectedPane] = useState(0);

  const renderLeftPane = () => {
    switch (selectedPane) {
      case 0:
        return <SetupPane />;
      case 1:
        return <ContextPane />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box' }}>
      <NavBar onSelect={setSelectedPane} />
      <main style={{ flexGrow: 1, marginLeft: drawerWidth }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box sx={{ flex: 4 }}>
            {renderLeftPane()}
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ flex: 8 }}>
            <Chat />
          </Box>
        </Box>
      </main>
    </Box>
  );
}

export default Layout;