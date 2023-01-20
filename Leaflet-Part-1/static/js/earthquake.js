// Use this link to get the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Define function to create map
function createMap(earthquakes) {

  // Adding the tile layer
  let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create the map object with options
  let map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [basemap, earthquakes]
  });

};

// 
d3.json(geoData).then(data => {
  // From the response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Define function to create markers for each feature in Data set
function createFeatures(earthquakeData) {

  // Define function to bind info to earthquake markers
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Depth: " + (feature.geometry.coordinates[2]) + " KM</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  };

  // Create a GeoJSON layer
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      let color;

      if (feature.geometry.coordinates[2] < 10) {
        color = 'rgb(191,255,0)'
      } else if (feature.geometry.coordinates[2] < 30) {
        color = 'rgb(255, 246, 0)'
      } else if (feature.geometry.coordinates[2] < 50) {
        color = 'rgb(255,191,0)'
      } else if (feature.geometry.coordinates[2] < 70) {
        color = 'rgb(255,128,0)'
      } else if (feature.geometry.coordinates[2] < 90) {
        color = 'rgb(255,64,0)'
      } else {
        color = 'rgb(255,0,0)'
      }

      let geojsonMarkerOptions = {
        radius: 4 * feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);

};



// Define function to assign color to depth
function getColor(d) {
  return d < 4 ? 'rgb(191,255,0)' :
    d < 5 ? 'rgb(255, 246, 0)' :
      d < 6 ? 'rgb(255,191,0)' :
        d < 7 ? 'rgb(255,128,0)' :
          d < 8 ? 'rgb(255,64,0)' :
            d < 9 ? 'rgb(255,0,0)' :
              'rgb(255,0,0)';
};

// Create a legend to display information about the map
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

  let div = L.DomUtil.create('div', 'info legend'),
    grades = [3, 4, 5, 6, 7, 8]
  labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];

  // Legend title
  div.innerHTML += '<b>Magnitude Scale<b><br><hr>'

  // loop through legend labels and generate a colored square for each class/magnitude
  for (let i = 0; i < labels.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i]) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
      (labels[i] + '<br>');
  }

  return div;
};

legend.addTo(map);






