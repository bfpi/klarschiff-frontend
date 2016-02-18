<?php

define("BASE_URL", "http://klarschiff-test-hgw/");

define("BACKEND_URL", BASE_URL . "backend_hgw/");
define("FRONTEND_URL", BASE_URL . "pc/");
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");
define("PPC_URL", BASE_URL . "ppc");
define("CITYSDK_URL", BASE_URL . "citysdk");

$wfs_query = BASE_URL . "geodienste/klarschiff?service=WFS&version=1.0.0&request=GetFeature";

define("MELDUNGEN_WFS_URL", $wfs_query . "&typeName=klarschiff.meldungen&outputFormat=GeoJSON");
define("ORTSTEILE_WFS_URL", $wfs_query . "&typeName=klarschiff.stadtteile&outputFormat=GeoJSON");
define("GEORSS_URL", $wfs_query . "&typeName=klarschiff.georss&outputFormat=GeoRSS&srsName=EPSG:4326");
