import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setPropertyPosition, updateFormData } from "../store/slices/propertySlice";

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
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
});

export default function PropertyMaps() {
  const markerRef = useRef(null)
  const [position, setPosition] = useState([12.9716, 77.5946])
  const dispatch = useDispatch();

  const handleDragEnd = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          dispatch(setPropertyPosition(marker.getLatLng()));
        }
      },
    }),
    [],
  )

  return (
    <div style={{ position: [12.9716, 77.5946] }}>
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
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a> contributors'
        />
        <Marker 
        ref={markerRef} 
        position={position} 
        icon={customIcon} 
        draggable={true} 
        eventHandlers={handleDragEnd}
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
      </MapContainer>
      
      {/* Map Info Overlay */}
    </div>
  );
}
