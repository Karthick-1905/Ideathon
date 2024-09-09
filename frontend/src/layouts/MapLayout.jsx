import SearchBar from "../components/SearchBar";
import Maps from "../components/Maps";
import { useState, useEffect } from "react";
import axios from 'axios';

const MapLayout = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [query, setQuery] = useState({
    startQuery: '',
    endQuery: ''
  });

  const [routes, setRoutes] = useState([]);

  const getCoordinates = async (place) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
      } else {
        alert(`Location '${place}' not found`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${place}:`, error);
      alert(`Error fetching coordinates for ${place}`);
      return null;
    }
  };

  const searchQuery = async () => {
    try {
      const startCoords = await getCoordinates(query.startQuery);
      const endCoords = await getCoordinates(query.endQuery);

      if (startCoords && endCoords) {
        const response = await axios.post('/api/v1/routes/get-routes', {
          start: startCoords,
          end: endCoords,
        });

        console.log(response.data);
        setRoutes(response.data.routes);
        setPosition([parseFloat(startCoords.lat), parseFloat(startCoords.lon)]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('Error fetching  hi routes');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
        <Maps position={position} routes={routes} />
      </div>
      <div style={styles.searchContainer}>
        <SearchBar query={query} onChange={setQuery} onSubmit={searchQuery}/>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box'
  },
  mapContainer: {
    width: '70%',
    height: '80%',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
  },
  searchContainer: {
    width: '25%',
    height:'80%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding:'2rem'
  },
  inputBox: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box'
  },
  searchButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff', // Adjust color to match the previous UI
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxSizing: 'border-box'
  },
  searchInputs:{
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  recentSearchs:{

  }

};

export default MapLayout;
