/* init_sidebar_mapicons.js */
function init_mapicons() {
  // mapicons
  var mapicons = $('#mapicons');
  var kol = $('<ol></ol>');
  for (var id in mapicons_config) {
    var checkbox = $('<input/>')
            .attr('type', 'checkbox')
            .attr('name', id);
    if (mapicons_config[id].checked) {
      checkbox.attr('checked', 'checked');
    }

    var title_to_display_before = mapicons_config[id].title_to_display_before;
    if(title_to_display_before !== undefined) {
      var title_div = $('<div></div>').attr('class', 'title').append(title_to_display_before);
      kol.append(title_div);
    }
    var div = $('<div></div>').attr('id', id);
    var label = $('<label></label>')
      .append(checkbox).append(mapicons_config[id].label);
    $.each(mapicons_config[id].icons, function(key, val) {
      label.append($("<img/>").attr("src", "images/icons/" + val));
    });
    div.append(label);
    kol.append(div);
  }

  kol.append($('<div></div>').attr('id', 'generalisiert').append(
    $('<label></label>').html('zusammengefasste Meldungen').append(
      $("<img/>").attr("src", "images/icons/generalisiert_layer.png")
    )
  ));
  $('input', kol).click(reloadMeldungenIcons);
  mapicons.append(kol);
}

/**
 * Baut Gesamtfilter aus Filterfragmenten für WFS-Layer.
 * Die Filterfragmente werden mit OR verbunden und als neuer Filter
 * der Filterstrategie gesetzt.
 * @returns null
 */
function buildFilter() {
  // Alle angehakten Teilfilter abholen...
  var cbs = $('#mapicons input');
  var filters = {};
  var allChecked = true;
  cbs.each(function() {
    var self = $(this);
    if (self.is(':checked')) {
      var id = self.attr('name');
      var filter = mapicons_config[id].filter;
      if (filters[filter.vorgangstyp] === undefined) {
        filters[filter.vorgangstyp] = [];
      }
      if (Array.isArray(filter.status)) {
        filter.status.forEach(function(status) {
          filters[filter.vorgangstyp].push(status);
        })
      } else {
        filters[filter.vorgangstyp].push(filter.status);
      }
    }
    else {
      allChecked = false;
    }
  });
  if (allChecked) {
    return; // Alle angehakt -> kein Filter
  }

  var condition = [];
  Object.keys(filters).forEach(function(key) {
    var values = jQuery.unique(filters[key]);
    var statusCond = [];
    if (values.length > 0) {
      values.forEach(function(status) {
        statusCond.push("<PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>"
          + status + "</Literal></PropertyIsEqualTo>");
      });
    }
    condition.push("<And><PropertyIsEqualTo><PropertyName>vorgangstyp</PropertyName><Literal>"
      + key + "</Literal></PropertyIsEqualTo>"
      + (statusCond.length > 1 ? "<Or>" + statusCond.join("") + "</Or>" : statusCond[0])
      + "</And>");
  });

  return condition.length == 0 ? null :
    "<Filter>" + (condition.length > 1 ? "<Or>" + condition.join("") + "</Or>" : condition[0])
    + "</Filter>";
}
