
//python -m SimpleHTTPServer 8000
// http://localhost:8000/
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/symbols/ExtrudeSymbol3DLayer",
  "esri/symbols/PolygonSymbol3D",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "dojo/_base/Color",
  "dojo/on",
  "dojo/domReady!"
], function(Map, SceneView,FeatureLayer,ExtrudeSymbol3DLayer,PolygonSymbol3D,SimpleFillSymbol,SimpleLineSymbol,SimpleRenderer,UniqueValueRenderer,Color,on){
  var map = new Map({
    basemap: "streets",
    ground: "absolute-height"
   // ground: "world-elevation"
  });


var symbolSimple = new SimpleFillSymbol({
            color: [255, 0, 0, 0.85],
            outline: {
              color: [0, 0, 0],
              width: 1
            }
          });




var renderSimple = new SimpleRenderer({
          symbol: new SimpleFillSymbol({
            color: [255, 0, 0, 0.85],
            outline: {
              color: [0, 0, 0],
              width: 1
            }
          })
        });



  

  var env= new FeatureLayer({url:"http://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/zoning_env/FeatureServer/0?f=json",
  mode: FeatureLayer.MODE_SNAPSHOT,
  elevationInfo: {mode:"absolute-height"}
}
);
  env.renderer=renderSimple;


  var parcel= new FeatureLayer("http://services1.arcgis.com/aT1T0pU1ZdpuDk1t/arcgis/rest/services/Sample_Zoning/FeatureServer/0?f=json",
  {mode: FeatureLayer.MODE_SNAPSHOT});

  map.add(parcel);
  map.add(env);
  
  

  var view = new SceneView({
    container: "viewDiv",     // Reference to the scene div created in step 5
    map: map,                 // Reference to the map object created before the scene
    scale: 10000,          // Sets the initial scale to 1:50,000,000
    center: [-78.654,35.786]  // Sets the center point of view with lon/lat
  });


var currentBuildings=[];
uniqueValueInfos=[];

function getGraphics(response) {
  var h=prompt("input building height");

    var symbol = new PolygonSymbol3D({
  symbolLayers: [new ExtrudeSymbol3DLayer({
    size: h,  // 100,000 meters in height
    material: { color: "red" }
  })]
});
  // the topmost graphic from the click location
  // and display select attribute values from the
  // graphic to the user
  var graphic = response.results[0].graphic;
  var attributes = graphic.attributes;
  
  var fid = attributes.FID;
  if(!currentBuildings.includes(fid)){
  currentBuildings.push(fid);
  uniqueValueInfos.push({value:fid,symbol:symbol});
}else{
  for(var i=0;i<uniqueValueInfos.length;i++){
    if(uniqueValueInfos[i].value==fid){
      uniqueValueInfos[i]={value:fid,symbol:symbol};
      break;
    }
  }
}

  var renderer = new UniqueValueRenderer({
    field: "FID",
    defaultSymbol: symbolSimple,
    uniqueValueInfos: uniqueValueInfos
  });
  env.renderer = renderer;

      }

view.on("click", function(event) {
view.hitTest(event.screenPoint)
    .then(getGraphics);

    
});





});


