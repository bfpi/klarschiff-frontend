<?php

$base = "http://demo.klarschiff-hro.de";
define("BASE_URL", $base . "/");

define("ADRESSSUCHE_URL", $base . "http://localhost:8080/solr/select?");
define("BACKEND_URL", BASE_URL . "backend/");
define("FRONTEND_URL", BASE_URL . "");
define("MAP_URL", FRONTEND_URL . "map.php");
define("MOBILE_FRONTEND_URL", BASE_URL . "mobil");
define("MELDUNGEN_WFS_URL", BASE_URL . "geodienste/klarschiff/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=hro-demo.klarschiff.meldungen&outputFormat=GeoJSON");
define("STADTTEILE_WFS_URL", BASE_URL . "geodienste/klarschiff/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=hro-demo.klarschiff.ortsteile&outputFormat=GeoJSON");
define("GEORSS_URL", BASE_URL . "geodienste/klarschiff/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=hro-demo.klarschiff.meldungen_beobachtungsflaechen&outputFormat=GeoRSS&srsName=EPSG:4326");
