import { Box, Checkbox, FormControlLabel, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {  setMoreDetails } from "../../store/slices/propertySlice";

export default function PropertyMoreDetails() {
    const moreDetails = useSelector(state => state.property.formData.moreDetails);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        dispatch(setMoreDetails({ ...moreDetails, [name]: type === 'checkbox' ? checked : value }));
    }

  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>More Details</Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <TextField 
                    fullWidth
                    type="number"
                    name="bedrooms"
                    label="Bedrooms"
                    value={moreDetails.bedrooms || ''} 
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField 
                    fullWidth
                    type="number"
                    name="bathrooms"
                    label="Bathrooms"
                    value={moreDetails.bathrooms || ''} 
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
               <TextField 
                    fullWidth
                    type="number"
                    name="kitchens"
                    label="Kitchens"
                    value={moreDetails.kitchens || ''} 
                    onChange={handleChange}
                    variant="outlined"
                />
            </Grid>
        </Grid>
        <Typography  sx={{mt:2,mb:2}}>Property Type</Typography>

        <Grid container spacing={3} sx={{ mt: 2}}>
            <Grid item xs={12} sx={{width:"100%"}}>
                <Select
                    fullWidth
                    name="propertyType"
                    label="Property Type"
                    value={moreDetails.propertyType || ''} 
                    onChange={handleChange}
                >
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="villa">Villa</MenuItem>
                    <MenuItem value="townhouse">Townhouse</MenuItem>
                    <MenuItem value="flat">Flat</MenuItem>
                </Select>
            </Grid>
        </Grid>
        
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>Amenities</Typography>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                    control={<Checkbox checked={moreDetails.isFurnished || false} onChange={handleChange} name="isFurnished" />}
                    label="Furnished"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                    control={<Checkbox checked={moreDetails.isParking || false} onChange={handleChange} name="isParking" />}
                    label="Parking"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                    control={<Checkbox checked={moreDetails.isPetFriendly || false} onChange={handleChange} name="isPetFriendly" />}
                    label="Pet Friendly"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                    control={<Checkbox checked={moreDetails.isSwimmingPool || false} onChange={handleChange} name="isSwimmingPool" />}
                    label="Swimming Pool"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                    control={<Checkbox checked={moreDetails.isGym || false} onChange={handleChange} name="isGym" />}
                    label="Gym"
                />
            </Grid>
        </Grid>
    </Box>
  )
}
