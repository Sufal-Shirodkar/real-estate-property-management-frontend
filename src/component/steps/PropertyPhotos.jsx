import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import S3PhotoUpload from '../imageKitUploader';

const PropertyPhotos = () => {
  const { photos } = useSelector(state => state.property.formData);

  return (
    <Box sx={{ padding: "30px" }}>
      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <S3PhotoUpload />
      </Paper>

      {photos.length > 0 && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
          <Typography variant="body2" color="success.dark">
            ✅ Great! You've uploaded {photos.length} photo{photos.length > 1 ? 's' : ''}. 
            You can continue to the next step or upload more photos.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PropertyPhotos; 