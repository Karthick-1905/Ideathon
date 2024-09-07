import React, { useState } from "react";
import { debounce } from "../utils/debounce";
import axios from "axios";

const SearchBar = ({ onChange: setQuery, onSubmit, query }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeInput, setActiveInput] = useState(null); // Track the active input

  // Debounced function to search places
  const searchPlaces = debounce(async (query) => {
    if (!query.startQuery && !query.endQuery) return;

    try {
      setSearching(true);
      const startResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query.startQuery}`
      );
      const endResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query.endQuery}`
      );

      const results = {
        start: startResponse.data,
        end: endResponse.data,
      };
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setSearching(false);
    }
  }, 1000);

  // Handle Input Change and trigger search
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
    setActiveInput(name); // Set active input to track which input is being changed

    searchPlaces({
      ...query,
      [name]: value,
    });
  };

  // Handle Search Result Click
  const handleResultClick = (place) => {
    if (!activeInput) return;

    setQuery({
      ...query,
      [activeInput]: place.display_name, // Update the correct input based on the active one
    });

    setSearchResults({
      ...searchResults,
      [activeInput === "startQuery" ? "start" : "end"]: [], // Clear the search results for the active input
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row space-x-2">
        {/* Start Input */}
        <input
          type="text"
          name="startQuery"
          placeholder="Search starting place"
          className="input input-bordered w-full max-w-xs"
          value={query.startQuery}
          onChange={handleInputChange}
        />
        
        {/* End Input */}
        <input
          type="text"
          name="endQuery"
          placeholder="Search destination"
          className="input input-bordered w-full max-w-xs"
          value={query.endQuery}
          onChange={handleInputChange}
        />
        
        <button className="btn btn-primary" onClick={onSubmit}>
          Search
        </button>
      </div>

      {/* Recent Search Results / Search Suggestions */}
      <h4 className="p-4 text-black font-medium tracking-wide">
        {query.startQuery || query.endQuery ? "Search Results" : "Recent Searches"}
      </h4>

      {searching && <p>Loading...</p>}

      <div>
        <ul className="menu w-full rounded-box bg-base-100 p-2 shadow-lg">
          {/* Display search results for startQuery if active */}
          {activeInput === "startQuery" && searchResults.start?.map((place, index) => (
            <li key={`start-${index}`}>
              <a onClick={() => handleResultClick(place)}>
                {place.display_name}
              </a>
            </li>
          ))}

          {/* Display search results for endQuery if active */}
          {activeInput === "endQuery" && searchResults.end?.map((place, index) => (
            <li key={`end-${index}`}>
              <a onClick={() => handleResultClick(place)}>
                {place.display_name}
              </a>
            </li>
          ))}

          {/* If no results */}
          {(searchResults.start?.length === 0 && searchResults.end?.length === 0 && !searching) && (
            <li>
              <a>No results found</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
