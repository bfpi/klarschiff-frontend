/* init_sidebar_neue_meldung.js */
/**
 * Event-Handler (jQuery), wird aufgerufen, wenn der Link zum Eintragen einer
 * neuen Meldung auf der Karte geklickt wird. Das Control zum abgreifen eines
 * neuen Kartenpunktes wird aktiviert und ruft als Event-Handler onNeueMeldung2
 * beim Click in die Karte auf.
 * @param event
 * @returns null
 */
function onNeueMeldung(event) {
  var targetLayer = getLayerByTitle("SketchMeldung");
  var targetId = $(event.currentTarget).attr('id');
  var mapDiv = $("#" + map.getTarget());

  // Alte Meldungen entfernen
  clearMeldungSketch();

  // ggf. Hinweis zur Meldungserstellung anzeigen
  showAdviceInstruction(targetId);

  // Mittelpunkt der Karte ermitteln.
  var position = map.getCoordinateFromPixel([mapDiv.width() / 2, mapDiv.height() / 2]);

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(position),
  });

  map.addInteraction(new ol.interaction.Modify({
    features: new ol.Collection([feature]),
    pixelTolerance: 50,
    style: new ol.style.Style()
  }));

  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      anchor: [27, 96],
      scale: 0.5,
      src: "images/icons/" + targetId + "_gemeldet_s.png"
    }))
  });

  targetLayer.setStyle(iconStyle);

  targetLayer.getSource().addFeature(feature);

  var newFeature = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: new ol.Collection(),
    }),
    style: iconStyle
  });

  var getCurrentTargetFeature = function(pixel) {
    return map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      if (layer == targetLayer) {
        return feature;
      }
    })
  };

  var highlight;
  var displayFeatureInfo = function(pixel) {

    var feature = getCurrentTargetFeature(pixel);

    if (feature == undefined) {
      if (highlight) {
        newFeature.getSource().removeFeature(highlight);
        highlight = null;
      }
    } else {
      if (feature !== highlight) {
        highlight = feature;
        newFeature.getSource().addFeature(highlight);
      }
    }
  };

  map.on('pointermove', function(evt) {
    displayFeatureInfo(map.getEventPixel(evt.originalEvent));
  });

  var changingFeature;

  feature.on('change', function(evt) {
    changingFeature = true;
    popupElement.popover('hide');
  });

  $(map.getViewport()).on('click', function(evt) {
    var feature = getCurrentTargetFeature(map.getEventPixel(evt.originalEvent));
    if (feature && changingFeature) {
      setTimeout(function() {
        popupOverlay.setPosition(feature.getGeometry().getCoordinates());
        popupElement.popover('show');
      }, 200);
      changingFeature = null;
    }
  });

  var popupElement = $(document.createElement('div')).attr('id', 'popup');
  var popupOverlay = new ol.Overlay({element: popupElement, stopEvent: false});
  map.addOverlay(popupOverlay);
  popupOverlay.setPosition(position);

  popupElement.popover({
    placement: 'auto',
    html: true,
    title: (targetId == "problem" ? "Problem" : "Idee") + " melden",
    content: '<div class="buttons"><a href="#" id="details">beschreiben</a><a href="#" id="verwerfen">abbrechen</a></div>'
  }
  ).on('shown.bs.popover', function() {
    $("a#details").button().click(function() {
      var dlg = $('<div></div>')
              .html('Bitte warten, die Koordinaten der neuen Meldung werden gerade geprüft…')
              .dialog({
        title: 'Koordinatenprüfung',
        modal: true,
        closeOnEscape: false,
        open: function(event, ui) {
          $(this).find(".ui-dialog-titlebar-close").hide();
        },
        close: function(event, ui) {
          $(this).dialog('destroy').remove();
        }
      });

      var show_message = function(msg) {
        dlg.html(msg);
        dlg.dialog('option', 'buttons', {
          schließen: function() {
            $(this).dialog('close');
          }
        });
      }

      $.ajax({
        url: 'php/point_check.php',
        data: {
          point: feature.getGeometry().getCoordinates().toString()
        },
        context: this,
        success: function(data) {
          if (data.length > 0) {
            // Probleme!
            var messages = data.split('#');
            var message = messages[2];
            show_message(message);
          } else {
            // Keine Probleme
            dlg.dialog('close');
            openMeldungDialog(feature, targetId);
          }
        },
        error: function() {
          show_message('Es trat ein allgemeiner Fehler auf.');
        }
      });
    });
    $("a#verwerfen").button().click(function() {
      clearMeldungSketch(popupElement);
    });
  }).popover('show');
}

/**
 * Löscht alle Meldungen im Sketch-Layer
 */
function clearMeldungSketch(popupElement) {
  var SketchMeldungLayer = getLayerByTitle("SketchMeldung");
  var features = SketchMeldungLayer.getSource().getFeatures();
  for (var i in features) {
    var feature = features[i];
    SketchMeldungLayer.getSource().removeFeature(feature);
  }
  var popup = popupElement || $('div#popup');
  popup.popover('destroy');
  popup.parent('div').remove();
}

function openMeldungDialog(feature, targetId) {
  var title = (targetId == "problem" ? "Problem" : "Idee") + " beschreiben";
  var attribs = {
    typ: targetId,
    point: feature.getGeometry().getCoordinates().toString()
  }

  var dlg = $('<div></div>')
          .data('oWidth', 500)
          .attr('id', 'meldung_edit')
          .dialog({
    autoOpen: false,
    width: 500,
    close: function(evt, ui) {
      $(this).dialog('destroy').remove();
      onMeldungFormClose();
    },
    buttons: {
      "melden": meldungFormSubmit,
      "abbrechen": function() {
        $(this).dialog("close");
      }
    }
  });

  $('#template_meldung_edit')
          .tmpl(attribs)
          .appendTo(dlg);

  $("#popup").popover('destroy');

  var insertOptions = function(target, parent) {
    var t = $('select[name="' + target + '"]');
    if (!t)
      return;
    t.empty();

    var kategorien = getKategorien(parent, targetId);
    $.each(kategorien, function(i, v) {
      $('<option></option>')
              .attr('value', v.id)
              .html(v.name)
              .appendTo(t);
    });

    return t;
  };

  $('<option></option>')
          .attr('value', 0)
          .html("auswählen…")
          .appendTo($('select[name="unterkategorie"]'));

  $('input[name="email"]').attr("placeholder", placeholder_email);
  //$.Placeholder.init();
  $('textarea[name="beschreibung"]').attr("placeholder", placeholder_beschreibung);
  $.Placeholder.init();

  $('textarea[name="beschreibung"], input[name="email"]').focus(function() {
    $(this).css({"color": "#000000"});
  }).blur(function() {
  });
  
  insertOptions("hauptkategorie").change(function(e) {
    insertOptions("unterkategorie", e.currentTarget.value);
    $("select[name='unterkategorie']").change();

  });

  // Dialog Titel geben und öffnen
  if (typeof dlg.data('oHeight') !== 'undefined') {
    dlg.dialog('option', 'height', dlg.data('oHeight'));
  }
  dlg.dialog('option', 'title', title)
          .dialog('option', 'width', dlg.data('oWidth'))
          .dialog("open")
          .data('oHeight', dlg.dialog('option', 'height'));
  // URL aus dem Textfeld entfernen
  if ($("#meldung_edit form textarea").val() == window.location) {
    $("#meldung_edit form textarea").val("");
  }
  unhideFeatureUnderDialog(feature, dlg);
}

/**
 * Event-Handler, wird beim Click auf den "Meldung absetzen"-Button ausgeführt,
 * um die Daten zum Server zu schicken.
 */
function meldungFormSubmit() {
  // Attributdaten aus Formular abholen
  var dlg = $(this);
  var postData = {
    task: "submit",
    typ: $('input[name="typ"]', dlg).val(),
    point: $('input[name="point"]', dlg).val(),
    hauptkategorie: $('select[name="hauptkategorie"]', dlg).val(),
    unterkategorie: $('select[name="unterkategorie"]', dlg).val(),
    beschreibung: $('textarea[name="beschreibung"]', dlg).val(),
    email: $('input[name="email"]', dlg).val(),
    foto: null
  };

  // clientseitige Validierung
  if (postData.hauptkategorie == "0") {
    $('select[name="hauptkategorie"]').addClass("error");
    eingabeFehlerPopup("hauptkategorieLeer");
    return;
  } else {
    $('select[name="hauptkategorie"]').removeClass("error");
  }
  if (postData.unterkategorie == "0") {
    $('select[name="unterkategorie"]').addClass("error");
    eingabeFehlerPopup("unterkategorieLeer");
    return;
  } else {
    $('select[name="unterkategorie"]').removeClass("error");
  }
  var filter = /^\S+@\S+\.[A-Za-z]{2,6}$/;
  if (!postData.email || postData.email === placeholder_email) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailLeer");
    return;
  }
  else if (!filter.test(postData.email)) {
    $('input[name="email"]', dlg).addClass("error");
    eingabeFehlerPopup("emailFalsch");
    return;
  }
  else {
    $('input[name="email"]', dlg).removeClass("error");
  }
  if ('undefined' !== typeof ks_lut.kategorie[parseInt(postData.unterkategorie)]) {
    if (!postData.beschreibung || postData.beschreibung === placeholder_beschreibung) {
      $('textarea[name="beschreibung"]').addClass("error");
      eingabeFehlerPopup("beschreibungLeer");
      return;
    } else {
      $('textarea[name="beschreibung"]').removeClass("error");
    }
  }

  // Daten abschicken, Rückmeldung nur bei Fehler!
  $('form#meldung').ajaxSubmit({
    beforeSubmit: function() {
      dlg.parent().css("display", "none");
      $('body').spinner({
        title: "neue Meldung",
        message: "<p>Bitte warten, die Meldung wird gerade abgesetzt…</p>",
        error: function() {
          var d = dlg.parent();
          var display = d.data("olddisplay") ? d.data("olddisplay") : "block";
          dlg.parent().css("display", display);
          $('body').spinner("destroy");
        },
        success: function() {
          dlg.dialog("close");
          $('body').spinner("destroy");
        },
        timer: 3
      }).spinner("show");
    },
    success: function() {
      reloadMeldungenIcons();
      $('body').spinner("success", "<p>Es kann einige Minuten dauern, bis die Meldung auf der Karte erscheint. Sie erhalten in Kürze eine E-Mail, in der Sie Ihre Meldung noch einmal bestätigen müssen.</p>");
    },
    error: function() {
      $('body').spinner("error");
    }
  });
}

/**
 * Event-Handler, entfernt das Eingabeformular aus dem Eingabe-Dialog, da
 * dieser beim Öffnen des Dialogs dynamisch erstellt und  eingefügt wird.
 * @returns null
 */
function onMeldungFormClose() {
  // Dialog leeren
  $('#meldung_edit').empty();
  // Sketch-Layer leeren
  clearMeldungSketch();
}

function getKategorien(parent, typ) {
  var kategorien = new Array();
  for (var i in ks_lut.kategorie) {
    if (ks_lut.kategorie[i].parent == parent) {
      if (parent == undefined && ks_lut.kategorie[i].typ != typ) {
        continue;
      }
      kategorien.push({ id: i, name: ks_lut.kategorie[i].name });
    }
  }
  kategorien.sort(function(a, b) {
     return a.name.localeCompare(b.name);
   });
   kategorien.unshift({ id: 0, name: "auswählen…" });
  return kategorien;
}

/**
 * Verschiebt Karte und ggf. Dialog soweit, dass
 * das Meldungs-Feature nicht verdeckt wird.
 * @returns null
 */
function unhideFeatureUnderDialog(feature, dlg) {
  // Prüfen, ob das dlg-Element in einem Dialog-Rahmen steckt.
  dlgParent = dlg.parent('.ui-dialog');
  if (dlgParent) {
    dlg = dlgParent;
  }

  moveMapToShowFeature(feature, dlg);
}


/**
 * Eingabefehler-Pop-up bei fehlender oder falscher Eingabe in Pflichtfelder
 * @returns null
 */
function eingabeFehlerPopup(eingabeFehlerTyp) {
  switch (eingabeFehlerTyp) {
    case "emailFalsch":
      var eingabeFehlerText = emailFalsch;
      break;
    case "emailLeer":
      var eingabeFehlerText = emailLeer;
      break;
    case "begruendungLeer":
      var eingabeFehlerText = begruendungLeer;
      break;
    case "freitextLeer":
      var eingabeFehlerText = freitextLeer;
      break;
    case "hauptkategorieLeer":
      var eingabeFehlerText = hauptkategorieLeer;
      break;
    case "unterkategorieLeer":
      var eingabeFehlerText = unterkategorieLeer;
      break;
    case "beschreibungLeer":
      var eingabeFehlerText = beschreibungLeer;
      break;
  }

  var dlg = $('<div></div>')
          .attr("id", 'eingabefehler-popup')
          .html(eingabeFehlerText)
          .dialog({
    title: 'Eingabefehler',
    modal: true,
    closeOnEscape: false,
    open: function(event, ui) {
      $(this).find(".ui-dialog-titlebar-close").hide();
    },
    close: function(event, ui) {
      $(this).dialog('destroy').remove();
    }
  });

  dlg.dialog('option', 'buttons', {
    schließen: function() {
      $(this).dialog('close');
    }
  });
}

var showInitialAdviceInstruction = true;
function showAdviceInstruction(targetId) {
  if (!showInitialAdviceInstruction) {
    return;
  }
  var dlg = $('<div></div>').attr('id', 'advise-instruction').html(
          'Melden Sie bitte keinesfalls Sachverhalte, die einer sofortigen und/oder direkten Reaktion bedürfen, wie etwa Notfälle!<br/><br/>' +
          'Stellen Sie bitte keine persönlichen Anfragen, wie etwa Adressänderungen, Leistungsanträge, Dokumentenanforderungen.<br/><br/>' +
          'Bitte setzen Sie in der Karte das Symbol durch Verschieben mit gedrückter linker Maustaste an den Ort ' + (targetId === 'problem' ? 'des Problems' : 'der Idee') + '.<br/><br/>' +
          'Teilen Sie bitte pro Meldung nur ' + (targetId === 'problem' ? 'ein Problem' : 'eine Idee') + ' aus den vorgegebenen Kategorien mit.<br/><br/>' +
          'Sehen Sie bitte von Meldungen ab, die komplexe städtebauliche oder verkehrsplanerische Sachverhalte behandeln.'
          ).dialog({
    title: 'Hinweise',
    width: 600,
    modal: true,
    closeOnEscape: false,
    open: function(event, ui) {
      $(this).find('.ui-dialog-titlebar-close').hide();
    },
    close: function(event, ui) {
      $(this).dialog('destroy').remove();
    }
  });

  dlg.dialog('option', 'buttons', {
    schließen: function() {
      $(this).dialog('close');
    }
  });

  showInitialAdviceInstruction = false;
}
