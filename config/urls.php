<?php

define("BASE_URL", "http://klarschiff-test-sn/");

define("BACKEND_URL", BASE_URL . "backend_sn/");
define("FRONTEND_URL", BASE_URL . "pc/");
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");

$geoserver_base = BASE_URL . "ows/klarschiff/";
$wfs_query = $geoserver_base . "ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json";

define("MELDUNGEN_WFS_URL", $wfs_query . "&typeName=klarschiff_sn:vorgaenge");
define("ORTSTEILE_WFS_URL", $wfs_query . "&typeName=klarschiff_sn:stadtteile");
define("GEORSS_URL", $geoserver_base . "wms/reflect?layers=klarschiff_sn:klarschiff_wfs_georss&format=rss");
