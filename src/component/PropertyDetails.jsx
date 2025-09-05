import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
  IconButton,
  Divider,
  Stack,
  Grid
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  Kitchen as KitchenIcon,
  House as HouseIcon,
  FitnessCenter as GymIcon,
  DirectionsCar as ParkingIcon,
  Pets as PetsIcon,
  Pool as PoolIcon
} from '@mui/icons-material';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyDetails } from "../services/api";
import { enqueueSnackbar } from "notistack";
import ImageCarousel from "./ImageCarousel";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

function MapResizeController() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Create a custom red marker icon
const customIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="#e74c3c" stroke="#fff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5" fill="#fff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getPropertyDetails(id);
        console.log({response});
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
  console.log({propertyDetails});

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', margin: '10px'}}>
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Main Content */}
          <Box sx={{ flex: { md: '2 1 0' }, width: '100%' }}>
            <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
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

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: 'text.secondary' ,height:"100px",overflow: 'auto'  }}>
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
                    {propertyDetails.moreDetails.bedrooms}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bedrooms
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathtubIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {propertyDetails?.moreDetails?.bathrooms}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bathrooms
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KitchenIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {propertyDetails?.moreDetails?.kitchens}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Kitchen
                  </Typography>
                </Box>
                

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HouseIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {propertyDetails.moreDetails?.propertyType}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              <Box sx={{ height:"200px", overflow: 'auto' }}>
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
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: { md: '1 1 0' }, width: '100%'}}>
            <Paper sx={{ height: '560px', borderRadius: 2, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            {propertyDetails?.position && <MapContainer center={propertyDetails.position} zoom={13} style={{ height: '100%', width: '100%' }}>
             <MapResizeController />
             <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
         />
                <Marker
         position={propertyDetails.position}
         icon={customIcon}
         >
            <Popup>
             <div style={{
               textAlign: 'center',
               fontFamily: 'system-ui, -apple-system, sans-serif'
             }}>
               <div style={{
                 fontSize: '12px',
                 fontWeight: 'bold',
                 color: '#e74c3c',
                 marginBottom: '5px'
               }}>
                 🏡 Property Location
               </div>
 
             </div>
           </Popup>
         </Marker>
             </MapContainer>}
             </Paper>
          </Box>
        </Box>
        <Grid >
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0'}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
            {
              propertyDetails?.moreDetails?.isFurnished && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon sx={{ color: "primary.main" }} />
                  <Typography variant="body1">
                    Furnished
                  </Typography>
                </Box>
              )
            }
            {
              propertyDetails?.moreDetails?.isGym && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GymIcon color="primary" />
                  <Typography variant="body1" >
                    Gym
                  </Typography>
                </Box>
              )
            }
            {
              propertyDetails?.moreDetails?.isParking && (  
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ParkingIcon color="primary" />
                  <Typography variant="body1" >
                    Parking
                  </Typography>
                </Box>
              )
            }
            {
              propertyDetails?.moreDetails?.isPetFriendly && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PetsIcon color="primary" />
                  <Typography variant="body1" >
                    Pet Friendly
                  </Typography>
                </Box>
              )
            }
            {
              propertyDetails?.moreDetails?.isSwimmingPool && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PoolIcon color="primary" />
                  <Typography variant="body1" >
                    Swimming Pool
                  </Typography>
                </Box>
              )
            }

            </Box>
           
            
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
}

export default PropertyDetails;

