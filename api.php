<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="Portal,Bürgerbeteiligung,Karte,Probleme,Ideen,Verwaltung" />
    <meta name="description" content="Melden Sie via Karte Probleme und Ideen im öffentlichen Raum, die dann von einer kommunalen Verwaltung bearbeitet werden." />
    <meta name="author" content="Hansestadt Rostock" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <title>Klarschiff – Portal zur Bürgerbeteiligung – API</title>
    <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="images/icons/favicon.ico" />
    <link rel="stylesheet" type="text/css" media="all" href="libs/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" media="all" href="styles/index.css" />
  </head>
  <body>
    <?php include("header.inc.php"); ?>
    <div class="container center">
      <h1>API</h1>

      <h2>Übersicht</h2>
      <p class="logo">
        <span class="left"><a href="http://www.open311.org" target="_blank"><img src="images/logo_open311.png"/></a></span>
        <span class="right"><a href="http://www.citysdk.eu/citysdk-toolkit/using-the-apis/open311-api" target="_blank"><img src="images/logo_citysdk.png"/></a></span>
      </p>
      <p class="justified">
        Das Portal verfügt über eine Programmierschnittelle („Application Programming Interface“, kurz API), die den Standard <a href="http://wiki.open311.org/GeoReport_v2" target="_blank"><span class="italic">Open311 GeoReport v2</span></a> vollständig implementiert. Darüber hinaus unterstützt die API Erweiterungen nach dem Standard <a href="http://www.citysdk.eu/citysdk-toolkit/using-the-apis/open311-api" target="_blank"><span class="italic">CitySDK Smart Participation</span></a> (außer Mehrsprachigkeit und Objektklassen).<br/>
        Über die API kann lesend auf vorhandene Meldungen zugegriffen werden. Um einen API-Key und damit einen Schreibzugriff zu erhalten, melden Sie sich bitte bei den <a href="http://www.klarschiff-hro.de/impressum.php">technischen Betreuern</a>.<br/>
        Um die gesamte Funktionalität des Portals abzubilden, wurden – mit Abwärtskompatibilität zu beiden Standards – <a href="https://github.com/bfpi/klarschiff-citysdk" target="_blank">zusätzliche Erweiterungen</a> implementiert (kommentieren, abstimmen, editieren etc.) und mit den Entwickler-Communities beider vorgenannter Standards abgestimmt.<br/>
      </p>
      
      <h2>Endpunkt</h2>
      <p class="justified">
        Sie erreichen den API-Endpunkt unter der folgenden Adresse: <a href="<?php echo CITYSDK_URL; ?>" target="_blank"><?php echo CITYSDK_URL; ?></a>. Eine Übersicht über die Eigenschaften der API („Service Discovery“) finden Sie unter der folgenden Adresse: <a href="<?php echo CITYSDK_URL; ?>/discovery.json" target="_blank"><?php echo CITYSDK_URL; ?>/discovery.json</a>.
      </p>
      
      <h2>Anwendungen</h2>
      <p class="justified">
        Verschiedene Anwendungen greifen bereits produktiv auf die API zu:
      </p>
      <p class="screenshot clearfix">
        <span class="left"><img src="images/api_ppc.png" alt="PPC" title="Prüf- und Protokollclient" /></span>
        <span class="right"><img src="images/api_georeporter.png" alt="GeoReporter" title="GeoReporter Android" /></span>
      </p>
      <p class="screenshot annotation clearfix">
        <span class="left"><a href="<?php echo PPC_URL; ?>" target="_blank">Prüf- und Protokollclient</a> der Hansestadt Rostock (als mobile Web-Anwendung)</span>
        <span class="right"><span class="italic">GeoReporter</span> der Stadt Bloomington (Indiana) in den Vereinigten Staaten von Amerika (als App verfügbar für <a href="https://play.google.com/store/apps/details?id=gov.in.bloomington.georeporter&hl=de" target="_blank">Android</a> und <a href="https://itunes.apple.com/de/app/georeporter/id487304759?mt=8" target="_blank">iOS</a>)</span>
      </p>
    </div>
  </body>
</html>
