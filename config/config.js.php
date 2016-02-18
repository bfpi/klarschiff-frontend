/* config.js.php */
<?php
$config = include('config.php');
?>

var zoom = 1;
var lonLat_center = [12.15000, 54.13500];
var mv_bbox_25833 = [206885, 5890624, 460857, 6060841];
var extent = [271264, 5938535, 356804, 6017573]
var resolutions = [27.024570517098006,19.109257071294042,13.512285258549001,9.55462853564702,6.7561426292745,4.77731426782351,3.3780713146372494,2.3886571339117544,1.6890356573186245,1.1943285669558772,0.8445178286593122,0.5971642834779384,0.422258914329656,0.29858214173896913,0.21112945716482798,0.14929107086948457];

var problemMeldungenMoeglich = <?php echo var_export($config['functions']['report_problem'], true); ?>;
var ideeMeldungenMoeglich = <?php echo var_export($config['functions']['report_idea'], true); ?>;

var unterstuetzer_schwellenwert = <?php echo $config['thresholds']['supporter']; ?>;

var placeholder_beschreibung = "Bitte beschreiben Sie Ihre Meldung genauer.";
var placeholder_email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
var placeholder_begruendung = "Bitte geben Sie eine Begründung an.";
var placeholder_freitext = "Bitte tragen Sie hier Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung ein.";

//// Variablen mit Fehlertexten
var hauptkategorieLeer = "Sie müssen eine Hauptkategorie auswählen.";
var unterkategorieLeer = "Sie müssen eine Unterkategorie auswählen.";
var beschreibungLeer = "Sie müssen Ihre Meldung genauer beschreiben.";
var emailFalsch = "Die angegebene E-Mail-Adresse ist syntaktisch falsch. Bitte korrigieren Sie Ihre Eingabe.";
var emailLeer = "Sie müssen Ihre E-Mail-Adresse angeben.";
var begruendungLeer = "Sie müssen eine Begründung angeben.";
var freitextLeer = "Sie müssen Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung angeben.";

var mapUrl = 'map.php';

var styleCache = {};
var highlightStyleCache = {};
ol_styles = {
  stroke: new ol.style.Stroke({
    color: "#FF8700",
    width: 2
  }),
  beobachtungsflaeche: function(feature, resolution) {
    var text = resolution < 25 ? feature.get("bezeichnung") : "";
    if (!styleCache[text]) {
      styleCache[text] = [new ol.style.Style({
          stroke: ol_styles.stroke,
          fill: new ol.style.Fill({
            color: "rgba(255,135,0,0.5)"
          }),
          text: new ol.style.Text({
            font: "bold 11px Verdana",
            text: text,
            stroke: new ol.style.Stroke({
              color: "#FFFFFF",
              width: 3
            }),
            fill: new ol.style.Fill({
              color: "#FF8700"
            })
          })
        })];
    }
    return styleCache[text];
  },
  beobachtungsflaeche_hover: function(feature, resolution) {
    var text = resolution < 5000 ? feature.get("bezeichnung") : "";
    if (!highlightStyleCache[text]) {
      highlightStyleCache[text] = [new ol.style.Style({
          stroke: ol_styles.stroke,
          fill: new ol.style.Fill({
            color: "rgba(255,0,255,0.3)"
          }),
          text: new ol.style.Text({
            font: "bold 13px Verdana",
            text: text,
            stroke: new ol.style.Stroke({
              color: "#FFFFFF",
              width: 3
            }),
            fill: new ol.style.Fill({
              color: "#FF00FF"
            })
          })
        })];
    }
    return highlightStyleCache[text];
  }
};

var ol_config = {
  "layers": {
    "Stadtplan": {
      type: "TileWMTS",
      title: "Stadtplan",
      url: "http://www.orka-mv.de/geodienste/orkamv/wmts/orkamv/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png",
      visibility: true,
      layers: "orkamv",
      tileGridOrigin: [-464849.38, 6310160.14],
      matrixSet: "epsg_25833",
      matrixIds: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      requestEncoding: "REST",
      projection: "EPSG:25833",
      format: "image/png",
      attribution_text: 'Kartenbild © Hansestadt Rostock (<a href="http://creativecommons.org/licenses/by/3.0/deed.de" target="_blank" style="color:#006CB7;text-decoration:none;">CC BY 3.0</a>) | Kartendaten © <a href="http://www.openstreetmap.org/" target="_blank" style="color:#006CB7;text-decoration:none;">OpenStreetMap</a> (<a href="http://opendatacommons.org/licenses/odbl/" target="_blank" style="color:#006CB7;text-decoration:none;">ODbL</a>) und <a href="https://geo.sv.rostock.de/uvgb.html" target="_blank" style="color:#006CB7;text-decoration:none;">uVGB-MV</a>',
      default_layer: true,
      displayInLayerSwitcher: true
    },
    Luftbild: {
      type: "TileWMTS",
      title: "Luftbild",
      url: "http://geo.sv.rostock.de/geodienste/luftbild_mv-40/wmts/hro.luftbild_mv-40.luftbild_mv-40/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png",
      visibility: true,
      layers: "hro.luftbild_mv-40.luftbild_mv-40",
      tileGridOrigin: [-464849.38, 6310160.14],
      matrixSet: "epsg_25833",
      matrixIds: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      requestEncoding: "REST",
      projection: "EPSG:25833",
      format: "image/png",
      attribution_text: "© GeoBasis-DE/M-V",
      default_layer: false,
      displayInLayerSwitcher: true
    },
    "POI": {
      type: "ImageWMS",
      url: "http://geo.sv.rostock.de/geodienste/klarschiff-poi/wms?",
      version: "1.1.1",
      layers: "hro.klarschiff-poi.abfallbehaelter,hro.klarschiff-poi.ampeln,hro.klarschiff-poi.beleuchtung,hro.klarschiff-poi.brunnen,hro.klarschiff-poi.denkmale,hro.klarschiff-poi.hundetoiletten,hro.klarschiff-poi.recyclingcontainer,hro.klarschiff-poi.sitzgelegenheiten,hro.klarschiff-poi.sperrmuelltermine",
      projection: "EPSG:25833",
      format: "image/png",
      default_layer: true,
      minScale: 1100,
      singleTile: true
    },
    "Meldungen": {
      title: "Meldungen",
      type: "Vector",
      default_layer: true,
      enableClustering: true,
      clusterDistance: 40,
      style: meldungenStyles,
      loader: function() {
        var url = "<?php echo MELDUNGEN_WFS_URL; ?>";
        if (typeof(buildFilter) == "function") {
          var filter = buildFilter();
          if (filter === null) {
            return;
          }
          else if (filter !== undefined) {
            url = url + "&Filter=" + filter;
          }
        }
        $.ajax({
          url: url,
          dataType: 'json'
        }).done(function(response) {
          var config = ol_config.layers.Meldungen;
          var vectorSource = getLayerByTitle(config.title).getSource().getSource();
          vectorSource.addFeatures((new ol.format.GeoJSON()).readFeatures(response));
        });
      },
      eventHandlers: {
	      change: function(evt) {
          if (typeof(map.showAdvice) === "function") {
            var features = evt.currentTarget.getSource().getFeatures();
            if (features.length > 0) {
              map.showAdvice(features);
            }
          }
	      }
      }
    },
    "SketchMeldung": {
      title: "SketchMeldung",
      type: "Vector",
      default_layer: true
    },
    "SketchBeobachtungsflaeche": {
      title: "SketchBeobachtungsflaeche",
      type: "Vector",
      url: "<?php echo ORTSTEILE_WFS_URL; ?>",
      default_layer: false,
      style: ol_styles.beobachtungsflaeche
    },
    "DrawBeobachtungsflaeche": {
      title: "DrawBeobachtungsflaeche",
      type: "Vector",
      default_layer: false,
      style: ol_styles.beobachtungsflaeche
    }
  }
};

var mapicons_config = {};

if (problemMeldungenMoeglich) {
  var problem_mapicons_config = {
    probleme12: {
      icons: ["problem_1_layer.png", "problem_2_layer.png"],
      label: "offene Probleme",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: ["gemeldet", "offen"]
      }
    },
    probleme3: {
      icons: ["problem_3_layer.png"],
      label: "Probleme in Bearbeitung",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: "inBearbeitung"
      }
    },
    probleme4: {
      icons: ["problem_4_layer.png"],
      label: "nicht lösbare Probleme",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: "wirdNichtBearbeitet"
      }
    },
    probleme5: {
      icons: ["problem_5_layer.png"],
      label: "gelöste Probleme",
      checked: true,
      filter: {
        vorgangstyp: "problem",
        status: "abgeschlossen"
      }
    }
  };
  mapicons_config = $.extend(mapicons_config, problem_mapicons_config);
}
if (ideeMeldungenMoeglich) {
  var idee_mapicons_config = {
    ideen12: {
      icons: ["idee_1_layer.png", "idee_2_layer.png"],
      label: "offene Ideen",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: ["gemeldet", "offen"]
      }
    },
    ideen3: {
      icons: ["idee_3_layer.png"],
      label: "Ideen in Bearbeitung",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: "inBearbeitung"
      }
    },
    ideen4: {
      icons: ["idee_4_layer.png"],
      label: "nicht umsetzbare Ideen",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: "wirdNichtBearbeitet"
      }
    },
    ideen5: {
      icons: ["idee_5_layer.png"],
      label: "umgesetzte Ideen",
      checked: true,
      filter: {
        vorgangstyp: "idee",
        status: "abgeschlossen"
      }
    }
  };
  mapicons_config = $.extend(mapicons_config, idee_mapicons_config);
}

// JQuery-UI konfigurieren
if ($.ui !== undefined) {
  $.ui.dialog.prototype.options.closeText = "Schließen";
}
