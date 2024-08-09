import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import NavBar from './NavBar';
import Chat from './Chat';
import SetupPane from './SetupPane';
import ContextPane from './ContextPane';

const drawerWidth = 240;

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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {renderLeftPane()}
          </Grid>
          <Grid item xs={8}>
            <Chat />
          </Grid>
        </Grid>
      </main>
    </Box>
  );
}

export default Layout;