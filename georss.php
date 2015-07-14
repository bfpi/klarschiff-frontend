<?php
/**
 * @file
 * georss.php - Proxy für die GeoRSS-Auslieferung
 *
 * GET-Parameter: id=<number>
 */
require_once 'config/urls.php';
require_once 'php/frontend_dao.php';
$frontend = new FrontendDAO();

$xml_out = "";
$id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : "";

if ($id != "" && count($data = $frontend->rss_data($id))) {
  $wfs_filter = "";

  $IDEE_KAT = "";
  $PROB_KAT = "";

  if ($data["ideen"] == "t") {
    $wfs_filter .= "<PropertyIsEqualTo><PropertyName>vorgangstyp</PropertyName><Literal>idee</Literal></PropertyIsEqualTo>";

    $ideen_kategorien = explode(",", $data["ideen_kategorien"]);
    if (count($ideen_kategorien) >= 2) {
        $IDEE_KAT .= "<Or>";
    }
    foreach ($ideen_kategorien AS $ideeKategorie) {
      if ($ideeKategorie != "") {
        $IDEE_KAT .= "<PropertyIsEqualTo><PropertyName>hauptkategorieid</PropertyName><Literal>" . $ideeKategorie . "</Literal></PropertyIsEqualTo>";
      }
    }
    if (count($ideen_kategorien) >= 2) {
        $IDEE_KAT .= "</Or>";
    }

    if ($IDEE_KAT != "") {
      $wfs_filter = "<And>" . $wfs_filter . $IDEE_KAT . "</And>";
    }
  }

  if ($data["probleme"] == "t") {
    if ($data["ideen"] == "t") {
      $wfs_filter = "<Or>" . $wfs_filter;
    }

    $probleme_kategorien = explode(",", $data["probleme_kategorien"]);
    if (count($probleme_kategorien) >= 2) {
        $PROB_KAT .= "<Or>";
    }
    foreach ($probleme_kategorien AS $problemKategorie) {
      if ($problemKategorie != "") {
        $PROB_KAT .= "<PropertyIsEqualTo><PropertyName>hauptkategorieid</PropertyName><Literal>" . $problemKategorie . "</Literal></PropertyIsEqualTo>";
      }
    }
    if (count($probleme_kategorien) >= 2) {
        $PROB_KAT .= "</Or>";
    }

    if ($PROB_KAT != "") {
      $wfs_filter .= "<And><PropertyIsEqualTo><PropertyName>vorgangstyp</PropertyName><Literal>problem</Literal></PropertyIsEqualTo>" . $PROB_KAT . "</And>";
    } else {
      $wfs_filter .= "<PropertyIsEqualTo><PropertyName>vorgangstyp</PropertyName><Literal>problem</Literal></PropertyIsEqualTo>";
    }

    if ($data["ideen"] == "t") {
      $wfs_filter .= "</Or>";
    }
  }

  $geom_filter = "<Within><PropertyName>the_geom</PropertyName>" . $data["wkt"] . "</Within>";

  if (empty($wfs_filter)) {
    $wfs_filter = $geom_filter;
  } else {
    $wfs_filter = "<And>" . $wfs_filter . $geom_filter . "</And>";
  }

  $curl_filter = "Filter=" . urlencode("<Filter xmlns:gml='http://www.opengis.net/gml'>" . $wfs_filter . "</Filter>");
  $ch = curl_init();
  curl_setopt_array($ch, array(
    CURLOPT_URL => GEORSS_URL,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $curl_filter,
    CURLOPT_HEADER => false,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERAGENT => $_SERVER['HTTP_USER_AGENT']));

  $xml_out = curl_exec($ch);
  print $xml_out;

} else {
  header("HTTP/1.0 404 Not Found");
  ?>
  <html>
    <head>
    </head>
    <body>
      <h1>Fehler</h1>
      <p>Der angeforderte RSS-Feed konnte nicht gefunden werden.</p>
    </body>
  </html>
  <?php
}
