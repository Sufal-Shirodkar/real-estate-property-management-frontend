import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData } from '../../store/slices/propertySlice';

const PropertyBasicInfo = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.property.formData);

  const handleInputChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 , padding: "30px"}}>
          <TextField
            fullWidth
            label="Property Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            variant="outlined"
            required
          />

          <TextField
            fullWidth
            label="Property Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            variant="outlined"
            multiline
            rows={4}
            required
          />

          <TextField
            fullWidth
            label="Price (USD)"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            variant="outlined"
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Property Status</InputLabel>
            <Select
              value={formData.propertyStatus}
              onChange={(e) => handleInputChange('propertyStatus', e.target.value)}
              label="Property Status"
            >
              <MenuItem value="forSale">For Sale</MenuItem>
              <MenuItem value="openHouse">Open House</MenuItem>
              <MenuItem value="priceReduced">Price Reduced</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Location/Address"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            variant="outlined"
            required
          />
    </Box>
  );
};

export default PropertyBasicInfo; 