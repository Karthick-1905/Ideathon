const axios =  require('axios');


const dummyMLData = {
    "Route1": { severity: 0.9, details: "High crime area" },
    "Route2": { severity: 0.4, details: "Low crime area" }
  };
  
// Function to get routes from OSM API
  
async function getRoutesFromOSM(start, end) {
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}`, 
      {
        params: {
          overview: 'full',
          geometries: 'geojson',
          alternatives: true,
          steps: false,
        }
      }
    );
    console.log(response.data);
    const routes = response.data.routes.map((route, index) => ({
      routeName: `Route${index + 1}`,
      coordinates: route.geometry.coordinates,
    }));
    console.log(routes)
    return routes;
  } catch (error) {
    console.error('Error fetching routes from OSM API:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching routes from OSM API');
  }
}

// API endpoint to get routes with severity
const getRoutes = async (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).send({ error: 'Start and end locations are required.' });
  }

  try {
    const routes = await getRoutesFromOSM(start, end);

    // Map the routes to include severity from the dummy ML data
    const routesWithSeverity = routes.map(route => ({
      routeName: route.routeName,
      coordinates: route.coordinates,
      severity: dummyMLData[route.routeName]?.severity || Math.random(), // Use ML data or random for demo
      details: dummyMLData[route.routeName]?.details || "No data available"
    }));

    res.json({ routes: routesWithSeverity });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
module.exports = {getRoutes}