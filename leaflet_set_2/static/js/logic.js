// get map from Leaflet-providers preview --- Layer that I liked
var firtsmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
// adding another layer
var secondmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
// making a basemaps object
let basemaps = {
    FirstMap : firtsmap,
    SecondMap: secondmap
};
// map object
var myMap = L.map("map", {
    center: [19.432608, -99.133209],
    zoom: 3,
    // adding here the atribute for the other layer
    layers: [firtsmap, secondmap]
});
// default map 1st one
firtsmap.addTo(myMap)
//Import & Visualize the Data
//  get the data and var to hold the plates
let tectonicplates = new L.layerGroup();
// call the api to get
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
    .then(function(plateData){
    // console.log(plateData);
    // load the data w/geoJson add the tectonic paltes
    L.geoJson(plateData,{
        //add styling t make the lines visibles
        color: "red",
        weight: 4
    }).addTo(tectonicplates);
});
//add the tectonic plates to the map
tectonicplates.addTo(myMap);
// var to hold earthquakes data
let earthquakes = new L.layerGroup();
// calling the data API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(function(earthquakeData){
    //console.log(earthquakeData);
    //get lat and long plot circles, radidus is dependent on the earthquake's magnitud
    // make a function that chooses the color of the data point
    function dataColor(depth){
        if(depth >90)
            return "#660000";
        else if(depth >70)
            return "#CC0000";
        else if(depth >50)
            return "#FF3333";
        else if(depth >30)
            return "#FF9999";
        else if(depth >10)
            return "#FFCCCC";
        else
            return "blue";
    }
    // function size of the radius magnitud SIZE
    function radiusSize(mag){
        if (mag == 0)
            return 1; // mag zero
        else
            return mag * 5; // bigger circle
    }
    // add on the style for each data point
    function dataStyle(feature){
        return{
            opacity: 0.5,
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


console.log(earthquakes);
// add overlay for the tectonic plates right top corner
let overlays = {
    "Tectonic Plates": tectonicplates,
    "Terremoto" : earthquakes
};
// add the layer control right top corner
L.control
.layers(basemaps, overlays)
.addTo(myMap);
// add legend with an overlay
let legend = L.control({
    position: "bottomright"
});

// add properties for the legend
legend.onAdd = function(){
    // div for the legend appear in the page
    let div = L.DomUtil.create("div", "info legend");
    // set up the intervals
    let intervals = [-10, 10, 30, 50, 70, 90];
    // add colors
    let colors = [
    "blue",
    "#FFCCCC",
    "#FF9999",
    "#FF3333",
    "#CC0000",
    "#660000"
];
 // loop through the intervals and the colors and generate a label
 // with a colored square for each interval
    for(var i = 0; i < intervals.length; i++){
      // inner html sets the square for each interval
      div.innerHTML += "<i style=background:  "+ colors[i] + "></i>" + intervals[i] + (intervals[i + 1] ? "Km &ndash km;" + intervals[i+1] + "km<br>" : "+")}
    return div;
};
// add legend to the map
legend.addTo(myMap)