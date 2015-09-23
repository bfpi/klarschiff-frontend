
function getLayerByTitle(title) {
  var layers = map.getLayers();
  for (var i = 0; i < layers.getLength(); i++) {
    var tmp = layers.item(i);
    if (tmp.get("title") == title) {
      return tmp;
    }
  }
  return null;
}

function getUrlParam(name) {
  var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  return results[1] || 0;
}

function meldungenStyles(features) {
  size = features.get("features").length;
  if (size == 1) {
    feature = features.get("features")[0];
    features.setStyle(new ol.style.Style({
      image: meldungIcon(feature, false)
    }));
  } else {
    features.setStyle(new ol.style.Style({
      image: new ol.style.Icon(({
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        anchor: [35, 38],
        src: "images/icons/generalisiert.png",
        scale: 0.6
      })),
      text: new ol.style.Text({
        text: size.toString(),
        font: "bold 20px Verdana",
        fill: new ol.style.Fill({
          color: '#000000'
        })
      }),
      zIndex: Infinity
    }));
  }
}

function meldungIcon(feature, highlight) {
  if (highlight) {
    return new ol.style.Icon(({
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      anchor: [28, 102],
      src: "images/icons/" + feature.get("vorgangstyp") + "_" + feature.get("status") + "_s.png",
      scale: 0.5
    }));
  } else {
    return new ol.style.Icon(({
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      anchor: [8, 84],
      src: "images/icons/" + feature.get("vorgangstyp") + "_" + feature.get("status") + ".png",
      scale: 0.5
    }));
  }
}

function reloadMeldungenIcons() {
  var config = ol_config.layers.Meldungen;
  var url = config.url_with_filter();
  if (url == null) {
    return;
  }
  $.ajax({ url: url, dataType: "json" }).done(function(response) {
    var vectorSource = getLayerByTitle(config.title).getSource().getSource();
    vectorSource.clear(true);
    vectorSource.addFeatures((new ol.format.GeoJSON()).readFeatures(response));
  });
}

function highlightFeature(feature) {
  var collection;
  if(feature) {
    collection = Array(feature);
  }
  highlightedOverlay.setSource(new ol.source.Vector({
    features: new ol.Collection(collection),
    useSpatialIndex: false
  }));
}

function moveMapToShowFeature(feature, dlg) {
  var featureOffset = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
  var puffer = 75;
  var newLeft = featureOffset[0] + puffer + (dlg.width() / 2);
  var newTop = featureOffset[1];

  map.beforeRender(ol.animation.pan({ source: map.getView().getCenter() }));
  map.getView().setCenter(map.getCoordinateFromPixel(Array(newLeft, newTop)));
}

function fitViewportToBBox(bboxArray) {
  try {
    if (bboxArray.length == 4) {
      var view = map.getView();

      if (bboxArray[0] == bboxArray[2]) {
        // PUNKT
        view.setCenter([parseFloat(bboxArray[0]), parseFloat(bboxArray[1])]);
        view.setZoom(12);
      } else {
        // POLYGON
        for (i = 0; i < bboxArray.length; i++) {
          bboxArray[i] = parseFloat(bboxArray[i]);
        }
        view.fit(bboxArray, map.getSize());
      }
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

function checkBrowser(name) {
  var agent = navigator.userAgent.toLowerCase();  
  if (agent.indexOf(name.toLowerCase()) > -1) {  
    return true;  
  }
  return false;  
}
