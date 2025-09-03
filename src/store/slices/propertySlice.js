import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    name: "",
    description: "",
    price: "",
    location: "",
    propertyStatus: "",
    photos: [],
    position:{
      lat: 0,
      lng: 0
    },
    moreDetails: {
      propertyType: '',
      bedrooms: 0,
      bathrooms: 0,
      kitchens: 0,
      isFurnished: false,
      isParking: false,
      isPetFriendly: false,
      isSwimmingPool: false,
      isGym: false,
    }
  },
  currentStep: 0,
  isUploading: false,
  uploadProgress: 0,
  errors: {}
};

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    setUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    addPhoto: (state, action) => {
      state.formData.photos.push(action.payload);
    },
    removePhoto: (state, action) => {
      state.formData.photos = state.formData.photos.filter((_, index) => index !== action.payload);
    },
    setPropertyPosition: (state, action) => {
      state.formData.position = action.payload;
    },
    setMoreDetails: (state, action) => {
      state.formData.moreDetails = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 0;
      state.errors = {};
      state.uploadProgress = 0;
      state.isUploading = false;
    }
  },
});

export const {
  updateFormData,
  setCurrentStep,
  nextStep,
  prevStep,
  setUploading,
  setUploadProgress,
  addPhoto,
  removePhoto,
  setErrors,
  resetForm,
  setPropertyPosition,
  setMoreDetails
} = propertySlice.actions;

export default propertySlice.reducer; 