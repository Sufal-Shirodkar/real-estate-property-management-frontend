// S3PhotoUpload.jsx
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoLibrary
} from '@mui/icons-material';
import {
  addPhoto,
  removePhoto,
  setUploading,
  setUploadProgress
} from '../store/slices/propertySlice';
import { enqueueSnackbar } from 'notistack';

const S3PhotoUpload = () => {
  const dispatch = useDispatch();
  const photos = useSelector(state => state.property.formData.photos);
  console.log({photos});
  const isUploading = useSelector(state => state.property.isUploading);
  const uploadProgress = useSelector(state => state.property.uploadProgress);
  const uploadRef = useRef();
  const [uploadError, setUploadError] = useState(null);

  // Upload configuration
  const uploadConfig = {
    endpoint: 'http://localhost:8000/upload-photos',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp']
  };

  const validateFile = (file) => {
    const { maxFileSize, allowedFileTypes } = uploadConfig;
    
    // Check file size
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `File size must be less than ${maxFileSize / 1024 / 1024}MB`
      };
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type must be one of: ${allowedFileTypes.join(', ')}`
      };
    }
    
    return { isValid: true };
  };

  const uploadToS3 = async (file) => {
   try{
    const formData = new FormData();
    formData.append('files', file);
    const response = await axios.post('http://localhost:8000/upload-photos', formData);
    console.log(response.data);
    return response.data;

   }catch(error){
    console.error('Upload error:', error);
    setUploadError(`Upload failed: ${error.message}`);
    dispatch(setUploading(false));
    dispatch(setUploadProgress(0));
   }
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    console.log(file);
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error);
      return;
    }

    try {
      dispatch(setUploading(true));
      dispatch(setUploadProgress(0));
      setUploadError(null);

      console.log('Starting upload for file:', file.name);
      
      const response = await uploadToS3(file);
      console.log('Upload successful:', response);

      // Create photo object with S3 response data
      // Adjust this based on your actual S3 response structure
      const photoData =  response?.photoUrls[0]||[];
        // fileId: response.fileId || response.key || Date.now().toString(),
        // name: file.name,
        // url: response.url || response.location,
        // thumbnail: response.thumbnailUrl || response.url || response.location,
        // filePath: response.key || response.filePath,
        // size: file.size,
        // fileType: file.type,
        // s3Key: response.key,
        // s3Bucket: response.bucket

      dispatch(addPhoto(photoData));
      dispatch(setUploading(false));
      dispatch(setUploadProgress(100));
      enqueueSnackbar('Photos uploaded successfully', { variant: 'success' });

      // Reset progress after a delay
      setTimeout(() => {
        dispatch(setUploadProgress(0));
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(`Upload failed: ${error.message}`);
      dispatch(setUploading(false));
      dispatch(setUploadProgress(0));
      enqueueSnackbar('Photos uploaded failed', { variant: 'error' });
    }
  };

  const handleFileInputChange = (event) => {
    handleFileSelect(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemovePhoto = (index) => {
    dispatch(removePhoto(index));
  };

  const triggerUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PhotoLibrary />
        Property Photos
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload high-quality photos of your property. Photos will be stored securely in AWS S3.
      </Typography>

      {/* Upload Error Alert */}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}

      {/* Upload Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={triggerUpload}
          disabled={isUploading}
          size="large"
          sx={{ mr: 2 }}
        >
          {isUploading ? 'Uploading...' : 'Upload Photos'}
        </Button>
        
        {photos.length > 0 && (
          <Chip 
            label={`${photos.length} photo${photos.length > 1 ? 's' : ''} uploaded`}
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      {/* Upload Progress */}
      {isUploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Uploading... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Hidden File Input */}
      <input
        ref={uploadRef}
        type="file"
        accept={uploadConfig.allowedFileTypes.map(type => `.${type}`).join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Photos ({photos.length})
          </Typography>
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} key={photo.fileId || index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    '&:hover .delete-button': {
                      opacity: 1
                    }
                  }}
                >
                  <img
                    src={photo}
                    alt={"propery-photo"}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGMUYxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  
                  {/* Delete Button Overlay */}
                  <IconButton
                    className="delete-button"
                    onClick={() => handleRemovePhoto(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      }
                    }}
                    size="small"
                  >
                    <Delete color="error" />
                  </IconButton>

                  {/* Photo Info */}
                  <Box sx={{ p: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'white',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {photo.name}
                    </Typography>
                    {photo.size && (
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {(photo.size / 1024 / 1024).toFixed(1)} MB
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Upload Guidelines */}
      {photos.length === 0 && (
        <Paper 
          sx={{ 
            p: 3, 
            mt: 2, 
            backgroundColor: 'grey.50',
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'grey.300',
            cursor: 'pointer'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={triggerUpload}
        >
          <PhotoLibrary sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No photos uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Drop files here or click to browse. Photos will be uploaded to AWS S3.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supported formats: {uploadConfig.allowedFileTypes.map(type => type.toUpperCase()).join(', ')} • Max size: {uploadConfig.maxFileSize / 1024 / 1024}MB per file
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default S3PhotoUpload;
