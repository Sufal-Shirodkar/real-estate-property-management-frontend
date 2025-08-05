import "../style.css"
import { Box, Button, TextField } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"

export const SearchInput = ({searchQuery, setSearchQuery}) => {
    return (
        <Box className="search-container" marginTop={2}>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon style={{ color: '#9e9e9e', marginRight: '8px' }} />
          <TextField
            className="search-input"
            size="small"
            variant="standard"
            type="text"
            placeholder="Search by address, city, or neighborhood"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                disableUnderline: true,
                style: { border: 'none', outline: 'none' }
              }
            }}
          />
          <Button className="search-button" variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </Box>
    )
}