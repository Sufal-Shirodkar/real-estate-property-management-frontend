import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, resetForm } from '../store/slices/propertySlice';
import PropertyBasicInfo from './steps/PropertyBasicInfo';
import PropertyPhotos from './steps/PropertyPhotos';
import PropertyReview from './steps/PropertyReview';
import { createProperty } from '../services/api';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PropertyMaps from './PropertyMaps';
import PropertyMoreDetails from './steps/PropertyMoreDetails';

const steps = [
  'Basic Information',
  'Upload Photos',
  'Add Maps',
  'More Details',
  'Review & Submit'
];

const PropertyStepper = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(state => state.property.currentStep);
  const formData = useSelector(state => state.property.formData);
  console.log({formData});
  const navigate = useNavigate();

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleReset = () => {
    dispatch(resetForm());
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.description && formData.price && formData.location && formData.propertyStatus;
      case 1:
        return formData.photos.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <PropertyBasicInfo />;
      case 1:
        return <PropertyPhotos />;
      case 2:
        return <PropertyMaps />
      case 3:
        return <PropertyMoreDetails />;
      case 4:
        return <PropertyReview />;
      default:
        return <div>Unknown step</div>;
    }
  };

  const handleCreateProperty = async() => {
    try{
      const response = await createProperty(formData);
      if(response.status === 201){
        enqueueSnackbar('Property created successfully', { variant: 'success' });
        dispatch(resetForm());
        navigate('/');
        
      }else{
        enqueueSnackbar('Property creation failed', { variant: 'error' });
      }
     
    }catch(error){
      console.log(error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4}}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Property
        </Typography>

        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(currentStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outlined"
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentStep !== 0 && (
              <Button onClick={handleReset} variant="text">
                Reset
              </Button>
            )}
            
            {currentStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                disabled={!isStepValid(currentStep)}
                onClick={handleCreateProperty}
              >
                Create Property
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PropertyStepper; 