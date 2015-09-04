/**
 * Erstellt aus einer Layer-Definition
 * ein OpenLayers Layer-Objekt.
 */
var OLLayerFactory = function() {

  /**
   * Erzeugt einen gekachelten WMTS-Layer.
   */
  this.createTileWMTSLayer = function(def, projection) {
    var layer = new ol.layer.Tile({
      title: def.title,
      projection: projection,
      source: new ol.source.WMTS({
        projection: def.projection,
        url: def.url,
        layer: def.layers,
        matrixSet: def.matrixSet,
        format: def.format,
        requestEncoding: def.requestEncoding,
        tileGrid: new ol.tilegrid.WMTS({
          origin: def.tileGridOrigin,
          resolutions: resolutions,
          matrixIds: def.matrixIds
        }),
        attributions: [
          new ol.Attribution({
            html: def.attribution_text
          })
        ]
      }),
      visible: def.default_layer,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    return layer;
  },
  /**
   * Erzeugt einen ungekachelten WMS-Layer.
   */
  this.createImageWMSLayer = function(def, projection) {
    var layer = new ol.layer.Image({
      title: def.title,
      extent: def.extent,
      projection: projection,
      source: new ol.source.ImageWMS({
        url: def.url,
        params: {
          'LAYERS': def.layers,
          'FORMAT': def.format,
          'VERSION': def.version,
          'SRS': def.projection
        }
      }),
      visible: def.default_layer,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    return layer;
  },
  /**
   * Erzeugt einen Vector-Layer.
   */
  this.createVectorLayer = function(def, projection) {
    var source;
    source = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: def.url
    });
    if (def.enableClustering) {
      source = new ol.source.Cluster({
        distance: def.clusterDistance,
        source: Object.create(source)
      });
    }
    var vectorLayer = new ol.layer.Vector({
      title: def.title,
      source: source,
      style: def.style,
      visible: def.default_layer,
      displayInLayerSwitcher: def.displayInLayerSwitcher
    });
    if (def.eventHandlers !== undefined) {
      $.each(def.eventHandlers, function(name, handler) {
        vectorLayer.on(name, handler);
      });
    };
    return vectorLayer;
  },
  /**
   * Eigentliche Fabrikfunktion.
   */
  this.createLayer = function(def, projection) {
    var funcName = "create" + def.type + "Layer";
    if (typeof(this[funcName]) === 'function') {
      return this[funcName].apply(this, [def, projection]);
    } else {
      console.error("Can not create layer of type " + def.type);
      return null;
    }
  };
};
