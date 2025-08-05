import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Chip, 
  ImageList, 
  ImageListItem, 
  Skeleton, 
  Button,
  Divider,
  Card,
  CardMedia,
  IconButton
} from "@mui/material";
import { 
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyDetails } from "../services/api";
import { enqueueSnackbar } from "notistack";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getPropertyDetails(id);
        if (response.status === 200) {
          setPropertyDetails(response.data.data || {});
        } else {
          enqueueSnackbar(response.message || 'Failed to load property details', { variant: 'error' });
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error loading property details', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: propertyDetails.name,
        text: `Check out this property: ${propertyDetails.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar('Link copied to clipboard!', { variant: 'success' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!propertyDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            Property not found
          </Typography>
          <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Go Back to Listings
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header with Back Button and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="outlined"
        >
          Back to Listings
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleShare} color="primary">
            <ShareIcon />
          </IconButton>
          <IconButton 
            onClick={() => setIsFavorite(!isFavorite)} 
            color="error"
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Image Gallery */}
        <Grid item xs={12} md={8}>
          {propertyDetails.photos && propertyDetails.photos.length > 0 ? (
            <Box>
              {/* Main Image */}
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="600"
                  image={propertyDetails.photos[selectedImage]||"https://via.placeholder.com/600x400"}
                  alt={propertyDetails.name}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
              
              {/* Thumbnail Gallery */}
              {propertyDetails.photos.length > 1 && (
                <ImageList sx={{ width: '100%', height: 120 }} cols={4} rowHeight={120}>
                  {propertyDetails.photos.map((photo, index) => (
                    <ImageListItem 
                      key={index} 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid' : 'none',
                        borderColor: 'primary.main',
                        borderRadius: 1
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={photo}
                        alt={`Property ${index + 1}`}
                        loading="lazy"
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          ) : (
            <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No photos available
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Property Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            {/* Status Chip */}
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={getStatusLabel(propertyDetails.propertyStatus)}
                color={getStatusColor(propertyDetails.propertyStatus)}
                size="medium"
              />
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {formatPrice(propertyDetails.price)}
              </Typography>
            </Box>

            {/* Property Name */}
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {propertyDetails.name}
            </Typography>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {propertyDetails.location}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Quick Stats */}
            {(propertyDetails.bedrooms || propertyDetails.bathrooms) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Property Features
                </Typography>
                <Grid container spacing={2}>
                  {propertyDetails.bedrooms && (
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'grey.50' }}>
                        <Typography variant="h6" color="primary">
                          {propertyDetails.bedrooms}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bedrooms
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {propertyDetails.bathrooms && (
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'grey.50' }}>
                        <Typography variant="h6" color="primary">
                          {propertyDetails.bathrooms}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bathrooms
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Contact Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" fullWidth size="large">
                Contact Agent
              </Button>
              <Button variant="outlined" fullWidth size="large">
                Schedule Tour
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Description Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                About This Property
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              lineHeight={1.8}
              sx={{ fontSize: '1.1rem' }}
            >
              {propertyDetails.description}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

