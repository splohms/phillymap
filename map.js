// // ADD YOUR MAPBOX ACCESS TOKEN
// mapboxgl.accessToken = "pk.eyJ1Ijoic3Bsb2htYXIiLCJhIjoiY2syaHVxdml5MHpsbzNtbzF1NXE1ZHYxeiJ9.R73K7V9poI3Muj84Wuw_YA"; //YOUR KEY HERE
//
// // CREATE A NEW OBJECT CALLED MAP
// const map = new mapboxgl.Map({
//   container: "map", // container ID for the map object (this points to the HTML element)
//   style: "mapbox://styles/splohmar/cl9wu1yx3002q15s5ndaa0sms", //YOUR STYLE URL
//   center: [-75.1652, 39.9526], // starting position [lng, lat]
//   zoom: 12, // starting zoom
//   projection: "globe", // display the map as a 3D globe
// });
//
// // ADD A GEOJSON SOURCE THAT POINTS TO YOUR LOCAL FILE
// map.on("load", function () {
//   map.addSource("heat", {
//     type: "geojson",
//     data: "./Vital_Population_CT.geojson",
//   });
//
//   // ADD A LAYER TO THE MAP
//
// });

const pop = "./Vital_Population_CT.geojson";
function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function flyToClick(coords) {
  deckgl.setProps({
    initialViewState: {
      longitude: coords[0],
      latitude: coords[1],
      zoom: 15,
      transitionDuration: 500,
      transitionInterpolator: new deck.FlyToInterpolator(),
    },
  });
}

const panel = document.getElementById("panel");
const panelChild = document.querySelector("#panel :nth-child(2)");

const deckgl = new deck.DeckGL({
  container: "map",
  // Set your Mapbox access token here
  mapboxApiAccessToken:
"pk.eyJ1Ijoic3Bsb2htYXIiLCJhIjoiY2syaHVxdml5MHpsbzNtbzF1NXE1ZHYxeiJ9.R73K7V9poI3Muj84Wuw_YA",
  // Set your Mapbox style here
  mapStyle: "mapbox://styles/splohmar/cl9wu1yx3002q15s5ndaa0sms",
  initialViewState: {
    latitude: 39.9526,
    longitude: -75.1652,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  },
  controller: true,

  layers: [
  new deck.GeoJsonLayer({
    id: "heat",
    data: pop,
    // Styles
    filled: true,
    stroke: false,
// Function for fill color
    getFillColor: (d) => {
      const abs = Math.abs(d.properties.COUNT_BLACK_NH);
      const color = map_range(abs, 0, 6000, 0,255 ); //lazy remap values to 0-255
//logic:
//If HSI_SCORE isn’t null:
      //if less than 0, return something in a blue-hue, otherwise red hue
  //if HSI_Score is null, return color with 0 alpha (transparent)
      return d.properties.COUNT_BLACK_NH
        ? d.properties.COUNT_BLACK_NH < 0
          ? [100, 100, color, 0]
          : [color, 80, 100, color + 66]
        : [0, 0, 0, 0];
    },
    getStrokeColor: [0, 0, 0, 255],
    LineWidthUnits: "meters",
    getLineWidth: 35,

    // Interactive props
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 200],
    onClick: (info) => {
        flyToClick(info.coordinate);

        panelChild.innerHTML = `<strong>Census Tract #${
          info.object.properties.GEOGRAPHY_NAME
        }</strong>
      <br></br>
      Count Asian: ${info.object.properties.COUNT_ASIAN_NH.toFixed(
        2 || "N/A"
      )} <br></br>
      Count Black: ${info.object.properties.COUNT_BLACK_NH.toFixed(2 || "N/A")}
      <br></br>
      Count Hispanic: ${info.object.properties.COUNT_HISPANIC.toFixed(2 || "N/A")}
      <br></br>
      Coordinates:
      ${info.coordinate[0].toFixed(3)},
      ${info.coordinate[1].toFixed(3)}`;
        panel.style.opacity = 1;
      },

  }),
],

getTooltip: ({ object }) => {
    return (
      object &&
      `Count Black Pop: ${
        object.properties.COUNT_BLACK_NH
          ? object.properties.COUNT_BLACK_NH.toFixed(2)
          : "No Data"
      }`
    );
  },
});
