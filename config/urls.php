<?php

define("BASE_URL", "http://support.klarschiff-hro.de/");

define("BACKEND_URL", BASE_URL . "backend/");
define("FRONTEND_URL", BASE_URL);
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");

$wfs_query = BASE_URL . "geodienste/klarschiff/wfs?service=WFS&version=1.0.0&request=GetFeature";

define("MELDUNGEN_WFS_URL", $wfs_query . "&typeName=hro-support.klarschiff.meldungen&outputFormat=GeoJSON");
define("ORTSTEILE_WFS_URL", $wfs_query . "&typeName=hro-support.klarschiff.ortsteile&outputFormat=GeoJSON");
define("GEORSS_URL", $wfs_query . "&typeName=hro-support.klarschiff.meldungen_beobachtungsflaechen&outputFormat=GeoRSS&srsName=EPSG:4326");
