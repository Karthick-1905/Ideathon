import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Utility to get different colors for routes
const getRouteColor = (index, severity) => {
  const routeColors = ['blue', 'purple', 'orange', 'brown', 'cyan'];
  const severityColors = severity > 0.75 ? 'red' : severity > 0.5 ? 'yellow' : 'green';
  return routeColors[index % routeColors.length] || severityColors;
};

// Function to calculate route distance (dummy implementation for demo)
const calculateDistance = (coordinates) => {
  // This function should return the route's distance based on coordinates
  return Math.round(coordinates.length * 0.01 * 100) / 100 + " km"; // Example calculation
};

const Maps = ({ position, routes }) => {
  const ChangeMapView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} className='w-full h-full'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marker for the current position */}
      <Marker position={position} icon={icon} />
      
      {/* Displaying routes as polylines */}
      {routes && routes.map((route, index) => {
        const distance = calculateDistance(route.coordinates); // Get the distance of the route
        return (
          <Polyline 
            key={index}
            positions={route.coordinates.map(coord => [coord[1], coord[0]])} // Coordinates are [lon, lat], so we reverse them
            color={getRouteColor(index, route.severity)} // Different color for each route
            weight={5}
            opacity={0.8}
          >
            {/* Tooltip to display route details on hover */}
            <Tooltip sticky>
              <div>
                <p><strong>Route Name:</strong> {route.routeName}</p>
                <p><strong>Distance:</strong> {distance}</p>
                <p><strong>Severity:</strong> {route.severity}</p>
              </div>
            </Tooltip>
          </Polyline>
        );
      })}

      <ChangeMapView center={position} />
    </MapContainer>
  );
};

export default Maps;
