import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
//   shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" width="41" height="41">
//       <ellipse cx="20.5" cy="37" rx="18" ry="3" fill="rgba(0,0,0,0.3)"/>
//     </svg>
//   `),
//   shadowSize: [41, 41],
//   shadowAnchor: [20, 37]
});

export default function PropertyMaps() {
  return (
    <div style={{ position: 'relative' }}>
      <MapContainer 
        center={[12.9716, 77.5946]} 
        zoom={13} 
        style={{ 
          height: "400px", 
          width: "100%", 
          borderRadius: "8px",
          border: "2px solid #e0e0e0"
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[12.9716, 77.5946]} icon={customIcon}>
          <Popup>
            <div style={{ 
              textAlign: 'center', 
              padding: '10px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#e74c3c',
                marginBottom: '5px'
              }}>
                🏡 Property Location
              </div>
              <div style={{ 
                color: '#666', 
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                Bengaluru, Karnataka
                <br />
                <small>Click and drag to adjust</small>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Map Info Overlay */}
    </div>
  );
}
