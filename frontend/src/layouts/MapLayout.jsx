
import SearchBar from "../components/SearchBar"
import Maps from "../components/Maps"
import { useState,useEffect } from "react"
import axios from 'axios'






const MapLayout = () =>{
  const [position, setPosition] = useState([51.505, -0.09]);
  const [query,setQuery] = useState({
    startQuery:'',
    endQuery:''
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
      // Fetch coordinates for start and end locations
      const startCoords = await getCoordinates(query.startQuery);
      const endCoords = await getCoordinates(query.endQuery);

      if (startCoords && endCoords) {
        // Send the coordinates to your backend to fetch routes and severity
        const response = await axios.post('/api/v1/routes/get-routes', {
          start: startCoords,
          end: endCoords,
        });

        console.log(response.data);
        setRoutes(response.data.routes);

        // Optionally, update the map's center position to the start location
        setPosition([parseFloat(startCoords.lat), parseFloat(startCoords.lon)]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('Error fetching routes');
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
      <>
        <div className="w-3/4">
            <Maps position ={position} routes={routes}/>
        </div>
        <div className="w-3/12">
            <SearchBar onChange={setQuery} onSubmit={searchQuery} query={query} />
        </div>
      </>
    )
}


export default MapLayout