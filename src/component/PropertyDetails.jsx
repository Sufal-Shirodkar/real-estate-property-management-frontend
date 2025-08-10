import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Chip,
  Button,
  IconButton,
  Divider,
  Stack
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon
} from '@mui/icons-material';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyDetails } from "../services/api";
import { enqueueSnackbar } from "notistack";
import ImageCarousel from "./ImageCarousel";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyDetails?.propertyName || 'Property',
          text: `Check out this amazing property: ${propertyDetails?.propertyName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar('Link copied to clipboard!', { variant: 'success' });
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'for-sale': 'For Sale',
      'for-rent': 'For Rent',
      'sold': 'Sold',
      'rented': 'Rented'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'for-sale': 'primary',
      'for-rent': 'info',
      'sold': 'success',
      'rented': 'warning'
    };
    return colorMap[status] || 'default';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!propertyDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          Property not found
        </Typography>
        <Button onClick={() => navigate('/')} variant="contained">
          Go Back to Listings
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Hero Section with Image Carousel */}
      <Box sx={{ position: 'relative', height: { xs: '60vh', md: '70vh' }, overflow: 'hidden' }}>
        <ImageCarousel resortPhotos={propertyDetails.photos} />
        
        {/* Overlay Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
            p: 2,
            zIndex: 10
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                Back to Listings
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleShare}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    color: isFavorite ? '#ff1744' : 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Property Information Section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 4, mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              {/* Status and Price */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Chip
                  label={getStatusLabel(propertyDetails.propertyStatus)}
                  color={getStatusColor(propertyDetails.propertyStatus)}
                  size="large"
                  sx={{ fontWeight: 'bold' }}
                />
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}
                >
                  {formatPrice(propertyDetails.price)}
                </Typography>
              </Box>

              {/* Property Title and Location */}
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}
              >
                {propertyDetails.propertyName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: 'text.secondary' }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {propertyDetails.location}
                </Typography>
              </Box>

              {/* Property Features */}
              <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.bedrooms}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bedrooms
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathtubIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.bathrooms}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bathrooms
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SquareFootIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.area?.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    sq ft
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  About This Property
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    color: 'text.secondary'
                  }}
                >
                  {propertyDetails.description || 'Stunning contemporary villa featuring modern amenities and exceptional design. This property offers luxurious living spaces with premium finishes throughout.'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 20
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Property Details
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Property Type:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.propertyType || 'Villa'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Year Built:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.yearBuilt || '2020'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Parking:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.parking || '2 Cars'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Lot Size:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.lotSize || '0.5 Acres'}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2
                }}
              >
                Contact Agent
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2
                }}
              >
                Schedule Tour
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PropertyDetails;

