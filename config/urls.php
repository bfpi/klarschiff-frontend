<?php

define("BASE_URL", "https://www.klarschiff-hgw.de/");

define("BACKEND_URL", BASE_URL . "backend/");
define("FRONTEND_URL", BASE_URL . "pc/");
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");
define("PPC_URL", BASE_URL . "ppc");
define("CITYSDK_URL", BASE_URL . "citysdk");

$geoserver_base = BASE_URL . "ows/klarschiff/";
$wfs_query = $geoserver_base . "ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json";

define("MELDUNGEN_WFS_URL", $wfs_query . "&typeName=klarschiff:vorgaenge");
define("ORTSTEILE_WFS_URL", $wfs_query . "&typeName=klarschiff:stadtteile");
define("GEORSS_URL", $geoserver_base . "wms/reflect?layers=klarschiff:klarschiff_wfs_georss&format=rss");
