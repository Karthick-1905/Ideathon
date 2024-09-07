const axios = require('axios');

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
    
    const routes = response.data.routes.map((route, index) => ({
      routeName: `Route${index + 1}`,
      coordinates: route.geometry.coordinates,
    }));

    return routes;
  } catch (error) {
    console.error('Error fetching routes from OSM API:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching routes from OSM API');
  }
}

async function getSeverityFromMLModel(coordinates) {
  try {
    const response = await axios.post('http://localhost:5000/predict', { features: coordinates });
    return response.data.severity; 
  } catch (error) {
    console.error('Error fetching severity from ML model:', error.response ? error.response.data : error.message);
    return Math.random();
  }
}

const getRoutes = async (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).send({ error: 'Start and end locations are required.' });
  }

  try {
    const routes = await getRoutesFromOSM(start, end);
    const routesWithSeverity = await Promise.all(routes.map(async (route) => {
      const severity = await getSeverityFromMLModel(route.coordinates);
      return {
        routeName: route.routeName,
        coordinates: route.coordinates,
        severity,
        details: severity > 0.7 ? "High crime area" : "Low crime area"
      };
    }));

    res.json({ routes: routesWithSeverity });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { getRoutes };
