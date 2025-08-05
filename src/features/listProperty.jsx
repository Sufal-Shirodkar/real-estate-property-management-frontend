import "../style.css";
import { useEffect, useState } from "react";
import { getPropertyDetails, listProperty } from "../services/api";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DisplayProperty from "../component/displayProperty";
import { SearchInput } from "../component/searchInput";
import { enqueueSnackbar } from "notistack";

const ListPropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const categories = [
    { label: "All Properties", icon: <HomeIcon /> },
    { label: "New Listings", icon: <HomeIcon /> },
    { label: "Price Reduced", icon: <HomeIcon /> },
    { label: "Open Houses", icon: <HomeIcon /> },
    { label: "Recently Sold", icon: <HomeIcon /> }
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await listProperty();
        setProperties(response.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to load properties");
        setLoading(false);
      }
    })();
  }, []);

  const toggleFavorite = (propertyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const filteredProperties = properties.filter(property =>
    property.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePropertyClick = async(propertyId) => {
    try{
      const propertyDetails = await getPropertyDetails(propertyId);
      if(propertyDetails.status === 200){
        navigate(`/property/${propertyId}`);
      }else{
        enqueueSnackbar('Property not found', { variant: 'error' });
      }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <Box className="main-container">
      {/* Hero Section */}
      <Box className="container">
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" className="hero-content">
            Find Your Dream Home
          </Typography>
          <Typography variant="h6" className="hero-description">
            Discover amazing properties in prime locations
          </Typography>

          {/* Search Bar */}
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Container>
      </Box>

      <Container maxWidth="lg" className="content-container">
        {/* Category Tabs */}
        <Paper className="tabs-container">
          <Tabs
            value={selectedCategory}
            onChange={(e, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category, index) => (
              <Tab
                key={index}
                label={category.label}
                icon={category.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Action Buttons */}
        <Box className="action-buttons">
          <Button
           variant="contained"
            color="primary"
            className="primary-button"
            onClick={() => navigate('/create-property')}
          >
            Add New Property
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="secondary-button"
            onClick={() => navigate('/create-feedback')}
          >
            Give Feedback
          </Button>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box className="loading-container">
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box className="error-alert">
            {error}
          </Box>
        )}

        {/* Properties Grid */}
        {!loading && !error && (
          <>
            <Typography variant="h6" className="properties-title" sx={{margin: '10px'}}>
              {filteredProperties.length} Properties Found
            </Typography>

            {filteredProperties.length === 0 ? (
              <Box className="empty-state">
                <HomeIcon className="empty-state-icon" />
                <Typography variant="h6" className="empty-state-title">
                  No properties found
                </Typography>
                <Typography className="empty-state-subtitle">
                  Try adjusting your search criteria
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{marginTop: '20px', borderRadius: '10px'}}
                  onClick={() => navigate('/create-property')}
                >
                  Add the First Property
                </Button>
              </Box>
            ) : (
              <DisplayProperty
                filteredProperties={filteredProperties}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                formatPrice={formatPrice}
                handlePropertyClick={handlePropertyClick}
              />
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ListPropertyPage;