import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import React from 'react';
import { RootState } from '../store/store';
import { setApiKey, setResourceLinks } from '../store/actions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const SetupPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const resourceLinks = useAppSelector((state: RootState) => state.resourceLinks);
  const apiKey = useAppSelector((state: RootState) => state.apiKey);

  const handleResourceLinkChange = (index: number, value: string) => {
    const newResourceLinks = [...resourceLinks];
    newResourceLinks[index] = value;
    dispatch(setResourceLinks(newResourceLinks));
  };

  const handleAddResourceLink = () => {
    dispatch(setResourceLinks([...resourceLinks, '']));
  };

  const handleRemoveResourceLink = (index: number) => {
    const newResourceLinks = resourceLinks.filter((_, i) => i !== index);
    dispatch(setResourceLinks(newResourceLinks));
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setApiKey(e.target.value));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2, boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom>Setup</Typography>
      <TextField
        label="OpenAI API Key"
        variant="outlined"
        fullWidth
        margin="normal"
        value={apiKey}
        onChange={handleApiKeyChange}
      />
      <Typography variant="h6" gutterBottom>Resources</Typography>
      {resourceLinks.map((link, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            label={`Resource Link ${index + 1}`}
            placeholder='https://example.com'
            variant="outlined"
            fullWidth
            value={link}
            onChange={(e) => handleResourceLinkChange(index, e.target.value)}
          />
          <IconButton onClick={() => handleRemoveResourceLink(index)} disabled={resourceLinks.length === 1}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddResourceLink}
      >
        Add Resource Link
      </Button>
    </Box>
  );
};

export default SetupPane;