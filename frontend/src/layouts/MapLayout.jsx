
import SearchBar from "../components/SearchBar"
import Maps from "../components/Maps"
import { useState,useEffect } from "react"
import axios from 'axios'



const MapLayout = () =>{
  const [position, setPosition] = useState([51.505, -0.09]);
  const [query,setQuery] = useState('');

  const searchQuery =  async(e) =>{
    console.log(e.target.value);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      console.log(response)
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Error fetching location');
    }
  }

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
            <Maps position ={position}/>
        </div>
        <div className="w-3/12">
            <SearchBar onChange={setQuery} onQuery={searchQuery} query={query} />
        </div>
      </>
    )
}


export default MapLayout