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
  $('input', kol).click(function() {
    buildFilter();
  });
  mapicons.append(kol);
}

/**
 * Baut Gesamtfilter aus Filterfragmenten für WFS-Layer.
 * Die Filterfragmente werden mit OR verbunden und als neuer Filter
 * der Filterstrategie gesetzt.
 * @returns null
 */
var filter = null;
function buildFilter() {
  // Alle angehakten Teilfilter abholen...
  var cbs = $('#mapicons input');
  var filters = {};
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
  });

  condition = [];
  Object.keys(filters).forEach(function(key) {
    var values = jQuery.unique(filters[key]);
    status_cond = []
    if (values.length > 0) {
      values.forEach(function(status) {
        status_cond.push("<PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>" + status + "</Literal></PropertyIsEqualTo>");
      })
    }
    if (status_cond.length > 1) {
      condition.push("<And>" + "<PropertyIsEqualTo><PropertyName>vorgangstyp</PropertyName><Literal>" + key + "</Literal></PropertyIsEqualTo>" + "<Or>" + status_cond.join("") + "</Or>" + "</And>");
    }
    else {
      condition.push("<And>" + "<PropertyIsEqualTo><PropertyName>vorgangstyp</PropertyName><Literal>" + key + "</Literal></PropertyIsEqualTo>" + status_cond.join("") + "</And>");
    }
  })

  layer_config = Object.create(ol_config.layers['Meldungen']);
  if (condition.length > 1) {
    layer_config.url += "&Filter=<Filter>" + "<Or>" + condition.join("") + "</Or>" + "</Filter>"
  }
  else if (condition.length == 1) {
    layer_config.url += "&Filter=<Filter>" + condition.join("") + "</Filter>"
  }
  reloadMeldungenIcons(layer_config)
}
