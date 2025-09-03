import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  ImageList,
  ImageListItem,
  Divider
} from '@mui/material';
import { 
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Weekend as WeekendIcon,
  LocalParking as LocalParkingIcon,
  Pets as PetsIcon,
  Pool as PoolIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const PropertyReview = () => {
  const formData = useSelector(state => state.property.formData);
  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  const getStatusLabel = (status) => {
    const statusMap = {
      forSale: 'For Sale',
      openHouse: 'Open House',
      priceReduced: 'Price Reduced',
      sold: 'Sold'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      forSale: 'primary',
      openHouse: 'success',
      priceReduced: 'warning',
      sold: 'error'
    };
    return colorMap[status] || 'default';
  };

  const amenities = [
    { key: 'isFurnished', label: 'Furnished', Icon: WeekendIcon },
    { key: 'isParking', label: 'Parking', Icon: LocalParkingIcon },
    { key: 'isPetFriendly', label: 'Pet Friendly', Icon: PetsIcon },
    { key: 'isSwimmingPool', label: 'Swimming Pool', Icon: PoolIcon },
    { key: 'isGym', label: 'Gym', Icon: FitnessCenterIcon },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Property Details
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Please review all the information before creating the property listing.
      </Typography>

      <Grid container spacing={3}>
        {/* Property Overview */}
        <Grid item xs={12} sx={{width: '100%'}}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
              <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Property Overview</Typography>
            </Box>
            
            <Typography variant="h5" gutterBottom>
              {formData?.name || ""}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="success.main">
                {formatPrice(formData?.price || 0)}
              </Typography>
              <Chip 
                label={getStatusLabel(formData.propertyStatus)}
                color={getStatusColor(formData.propertyStatus)}
                sx={{ ml: 2 }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon sx={{ mr: 1, color: 'crimson' }} />
              <Typography variant="body1">
                {formData?.location || ""}
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {formData?.description || ""}
            </Typography>
          </Paper>
        </Grid>

        {/* Photos Section */}
        {formData.photos.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Property Photos ({formData.photos.length || 0})
              </Typography>
              
              <ImageList sx={{ width: '100%', height: 300 }} cols={3} rowHeight={164}>
                {formData.photos.map((photo, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={photo}
                      alt={`Property ${index + 1}`}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>
        )}

        {/* Summary Stats */}
        <Grid item sx={{width: '100%'}}>
          <Paper sx={{ p: 3, backgroundColor: 'grey.50'}}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Property Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formData?.name || ""}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Price
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatPrice(formData?.price || 0)} 
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Status
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {getStatusLabel(formData?.propertyStatus || "")}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Photos
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formData?.photos?.length || 0} 
                </Typography>
              
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Property Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formData?.moreDetails?.propertyType || ""}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Bedrooms
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formData?.moreDetails?.bedrooms || ""}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Bathrooms
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formData?.moreDetails?.bathrooms || ""}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3} sx={{padding: '10px'}}>
                <Typography variant="body2" color="textSecondary">
                  Kitchens
                </Typography>
                  <Typography variant="body1" fontWeight="medium">
                  {formData?.moreDetails?.kitchens || ""}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {amenities.map(({ key, label, Icon }) =>
                formData.moreDetails?.[key] && (
                  <Grid item xs={4} sm={3} md={2} key={key} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Icon sx={{ fontSize: 30, color: 'grey.400' }} />
                      <Typography variant="caption" display="block" sx={{ ml: 1 }}>
                        {label}
                      </Typography>
                  </Grid>
                )
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyReview; 