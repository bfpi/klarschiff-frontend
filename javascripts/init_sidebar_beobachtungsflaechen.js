var beobachtungsflaechenOverlay;
var drawBeobachtungsflaeche;

function beobachtungsflaecheGebiet() {
  hideFlaecheActionBtns();
  beobachtungsflaechenDialog(-1, null, "thematische Eingrenzung", null);
  showFlaecheActionBtns();
}

function beobachtungsflaecheStartSelect() {
  hideFlaecheActionBtns();
  showFlaecheCtrlBtns();
  $("#flaeche_cancel").unbind("click").click(beobachtungsflaecheStopSelect);

  var layer = getLayerByTitle("SketchBeobachtungsflaeche");

  $("#flaeche_apply").unbind("click").click(beobachtungsflaecheSelect);

  layer.setVisible(true);
  beobachtungsflaechenOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: new ol.Collection(),
    }),
    style: ol_styles.beobachtungsflaeche_hover,
  });

  map.on('click', waehleOrtsteil);

  $(document).bind('keydown.rss', function(event) {
    if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
      beobachtungsflaecheStopSelect();
      event.preventDefault();
    }
  });
}

function beobachtungsflaecheSelect() {
  features = beobachtungsflaechenOverlay.getSource().getFeatures();
  var ids = "";
  for (var i = 0; i < features.length; i++) {
    if (i > 0) {
      ids += ",";
    }
    ids += features[i].get("ogc_fid");
  }

  hideFlaecheActionBtns();
  beobachtungsflaechenDialog(ids, null, "thematische Eingrenzung", null);
  beobachtungsflaecheStopSelect();
}

function beobachtungsflaecheStopSelect() {
  showFlaecheActionBtns();
  hideFlaecheCtrlBtns();
  var layer = getLayerByTitle("SketchBeobachtungsflaeche");

  layer.setVisible(false);
  beobachtungsflaechenOverlay.getSource().clear();
  map.un('click', waehleOrtsteil);
}

function waehleOrtsteil(elem) {
  pixel = elem.pixel;
  var newFeature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });

  var overlaySource = beobachtungsflaechenOverlay.getSource();
  var isCurrent = false;
  overlaySource.getFeatures().forEach(function(feature) {
    if (newFeature == feature) {
      isCurrent = true;
    }
  });

  if (isCurrent) {
    overlaySource.removeFeature(newFeature);
  } else if (newFeature) {
    overlaySource.addFeature(newFeature);
  }
}

/**
 * Event-Handler (jQuery), wird nach dem Klick auf "Neue Fläche erstellen"
 * ausgeführt. Aktiviert das DrawFeature-Control und ändert den Mauszeiger auf
 * "Fadenkreuz".
 * @param event Klick-Event, unbenutzt.
 * @returns null
 */
function beobachtungsflaecheStartNeueFlaeche() {
  var layer = getLayerByTitle("DrawBeobachtungsflaeche");

  hideFlaecheActionBtns();
  showFlaecheCtrlBtns();
  $("#flaeche_cancel").unbind("click").click(beobachtungsflaecheStopNeueFlaeche);
  $("#flaeche_apply").click(function() {
    var src = layer.getSource();
    var feature = new ol.Feature({
      geometry: new ol.geom.Polygon(
        src.getFeatures()[0].getGeometry().getCoordinates()
      )
    });

    src.clear();
    src.addFeature(feature);

    beobachtungsflaechenDialog(null, feature);
    beobachtungsflaecheStopNeueFlaeche();
  });

  layer.setVisible(true);

  drawBeobachtungsflaeche = new ol.interaction.Draw({
    source: layer.getSource(),
    type: "Polygon",
    style: ol_styles.beobachtungsflaeche
  });

  drawBeobachtungsflaeche.on('drawend', function(evt) {
    setTimeout(function() {
      $("#flaeche_apply").click();
    }, 0);
    map.removeInteraction(drawBeobachtungsflaeche);
    $("#" + map.getTarget()).css("cursor", "auto");
  }, this);

  map.addInteraction(drawBeobachtungsflaeche);

  $("#" + map.getTarget()).css("cursor", "crosshair");
  $(document).bind('keydown.rss', function(event) {
    if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
      beobachtungsflaecheStopNeueFlaeche();
      event.preventDefault();
    }
  });
}

function beobachtungsflaecheStopNeueFlaeche() {
  showFlaecheActionBtns();
  hideFlaecheCtrlBtns();

  map.removeInteraction(drawBeobachtungsflaeche);
  $("#" + map.getTarget()).css("cursor", "auto");

  var layer = getLayerByTitle("DrawBeobachtungsflaeche");
  layer.setVisible(false);
  layer.getSource().clear();
}

showFlaecheActionBtns = function() {
  $("button.flaecheAction").show();
}

hideFlaecheCtrlBtns = function() {
  $("button.flaecheCtrl").unbind("click").hide();
}

// Hide and show buttons for Beobachtungsflaeche.
function hideFlaecheActionBtns(buttonID) {
  $("button.flaecheAction").hide();
  $("button.flaecheAction").removeClass("ui-state-focus");
  if (buttonID) {
    $("button#" + buttonID).show();
  }
}

showFlaecheCtrlBtns = function() {
  $("button.flaecheCtrl").show();
}

/**
 * Erstellt Dialog zur thematischen Eingrenzung einer Beobachtungsfläche. Zur
 * Unterscheidung zwischen vorhandenen und neuen Flächen dient die Nutzung 
 * einer id für vorhandene Flächen oder eines Features für eine neue Fläche.
 * @param id int
 * @param feature OpenLayers.Feature
 * @param name
 * @param geom_string Polygon as string
 * @returns null
 */
function beobachtungsflaechenDialog(id, feature, name, geom_string) {
  var titel = (id ? name : "thematische Eingrenzung");
  var dlg = $('<div></div>')
          .attr('id', 'beobachtungsflaechen_dialog')
          .attr('title', titel);

  $('#template_flaeche_abonnieren')
          .tmpl()
          .appendTo(dlg);

  $.each(["problem", "idee"], function(key, typ) {
    var target = $('div[name="' + typ + '_kategorie"]', dlg);
    $.each(ks_lut.kategorie, function(kategorie_id, kategorie) {
      if (!kategorie.parent && kategorie.typ == typ && kategorie.geloescht != 't') {
        $('<div>').addClass('checkbox')
          .append($('<label>').html(kategorie.name)
            .prepend($('<input>')
              .attr("name", typ + "_kategorie[" + kategorie_id + "]")
              .attr("type", "checkbox")
              .val(kategorie_id)))
          .appendTo(target);
      }
    });
  });

  dlg.dialog({
    modal: true,
    width: 500,
    close: function() {
      if (feature) {
        map.getLayers().forEach(function(layer) {
          if (typeof removeFeature == 'function') {
            layer.getSource().removeFeature(feature);
          }
        });
      }
    },
    open: function() {
      var $btn_beobachten = dlg.siblings(".ui-dialog-buttonpane").find(":button").first();
      if (dlg.find(" :checked").size() == 0) {
        $btn_beobachten.attr("disabled", true).addClass("ui-state-disabled");
      } else {
        $btn_beobachten.attr("disabled", false).removeClass("ui-state-disabled");
      }
      dlg.find(":checkbox").bind("change", function() {
        if (dlg.find(" :checked").size() == 0) {
          $btn_beobachten.attr("disabled", true).addClass("ui-state-disabled");
        } else {
          $btn_beobachten.attr("disabled", false).removeClass("ui-state-disabled");
        }
      });
    },
    buttons: {
      "beobachten": function() {
        var problem_kat_arr = [];
        var idee_kat_arr = [];
        var geom_as_text = null;

        $("div[name='problem_kategorie'] input:checked", dlg).each(function() {
          problem_kat_arr.push($(this).val());
        });

        $("div[name='idee_kategorie'] input:checked", dlg).each(function() {
          idee_kat_arr.push($(this).val());
        });

        if (feature && feature.getGeometry()) {
          geom_as_text = "POLYGON((" + feature.getGeometry().getCoordinates().toString() + ")) ";
          var koordinaten = [];
          feature.getGeometry().getCoordinates()[0].forEach(function(coord) {
            koordinaten[koordinaten.length] = coord.toString().replace(/,/g, " ");
          });
          geom_as_text = "POLYGON((" + koordinaten.join(",") + ")) ";

        } else if (geom_string) {
          geom_as_text = geom_string;
        }

        $.ajax({
          url: "php/flaechen_submit.php",
          type: "POST",
          dataType: "json",
          data: {
            id: id ? id : "null",
            geom: geom_as_text,
            problem_kategorie: problem_kat_arr,
            idee_kategorie: idee_kat_arr
          },
          beforeSend: function() {
            dlg.dialog("close");
            $('body').spinner({
              title: "GeoRSS-Feed",
              message: "<p>Bitte warten, der GeoRSS-Feed wird gerade erstellt…</p>",
              error: function() {
                $('body').spinner("destroy");
                dlg.dialog("show");
              },
              success: function() {
                $('body').spinner("destroy");
              },
              timer: 3
            }).spinner("show");
          },
          error: function() {
            $('body').spinner("error");
          },
          success: function(data) {
            var feed_url = "georss.php?id=" + data.hash;
            var message = "Der GeoRSS-Feed wurde erfolgreich erstellt und ist nun unter folgender Adresse abrufbar: ";
            message += '<a href="' + feed_url + '" target="_blank" style="color:#006CB7;text-decoration:none;">GeoRSS-Feed</a>';
            $('body').spinner("success", message);
            showFlaecheActionBtns();
            hideFlaecheCtrlBtns();
          }
        });
      },
      "abbrechen": function() {
        $(this).dialog("close");
      }
    }
  });
}
