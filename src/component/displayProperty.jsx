import "../style.css"
import { Box, Typography } from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

const DisplayProperty = ({filteredProperties, favorites, toggleFavorite, formatPrice, handlePropertyClick}) => {
    return (
        <Box className="properties-grid">
        {filteredProperties.map((property) => (
          <Box key={property.id || property.name} className="property-card" onClick={() => handlePropertyClick(property.id)}>
            <Box className="card-image-container">
              <img
                className="card-image"
                src={
                  property.photos && property.photos.length > 0 
                    ? property?.photos[0] 
                    : `https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
                }
                alt={property.name}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
                }}
              />
              <button
                className="favorite-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
              >
                {favorites.has(property.id) ? (
                  <FavoriteIcon style={{ color: '#f44336' }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </button>
              <Box className="status-chip">
                {property?.propertyStatus || ""}
              </Box>
            </Box>

            <Box className="card-content">
              <Typography variant="h6" className="property-price">
                {formatPrice(property.price)}
              </Typography>

              <Typography variant="body1" className="property-name">
                {property.name}
              </Typography>

              <Box className="property-location">
                <LocationIcon className="location-icon" />
                <Typography variant="body2" className="location-text">
                  {property.location || property.address || "Location not specified"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    )
}

export default DisplayProperty;