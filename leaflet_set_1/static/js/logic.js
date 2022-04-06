// get map from Leaflet-providers preview --- Layer that I liked 

var firtsmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

// map object 

var myMap = L.map("map", {
    center: [19.432608, -99.133209],
    zoom: 2
});// add the layer control
// L.control.layers(myMap);

//Import & Visualize the Data
firtsmap.addTo(myMap);

//  get the data and var to hold the plates 
let earthquakes = new L.layerGroup();

// call the api to get 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(function(earthquakeData){
    console.log(earthquakeData);
// var to hold earthquakes data 
let earthquakes = new L.layerGroup();

    //get lat and long plot circles, radidus is dependent on the earthquake's magnitud 
    // make a function that chooses the color of the data point 
    function dataColor(depth){
        if (depth >90)
            return "#f0f8ff";
        else if (depth >70)
            return "#faebd7";
        else if (depth >50)
            return "#00ffff";
        else if (depth >30)
            return "#7fffd4";
        else if (depth >10)
            return "#f0ffff";
        else
            return "#0000ff";
    }

    // function size of the radius magnitud SIZE 
    function radiusSize(mag){
        if (mag == 0)
            return 1; // mag zero
        else
            return mag * 3; // bigger circle 
    }

    // add on the style for each data point 
    function dataStyle(feature){
        return{
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: dataColor(feature.geometry.coordinates[2]), // index 2 becuse depth 
            color: "000000",
            radius: radiusSize(feature.properties.mag), // to get magnitud
            weight: 0.5,
            stroke: true
        }
    }

    // add the GeoJson data
    L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latLng){
            return L.circleMarker(latLng);
        },
        // set the style for the markers 
        style: dataStyle,// calls the data styles function and passes in the earthquake data
        // add popups
        onEachFeature: function(feature, layer){
            layer.bindPopup(`Magnitud: <b>${feature.properties.mag}</b><br>
                            Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                            Place: <b>${feature.properties.place}</b><br>`
            )
        }
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);
}
);








