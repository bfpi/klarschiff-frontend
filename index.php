<?php
require_once "config/urls.php";
require_once "php/frontend_dao.php";
$frontend = new FrontendDAO();
$config = include 'config/config.php';
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="keywords" content="Portal,Bürgerbeteiligung,Karte,Probleme,Ideen,Verwaltung" />
    <meta name="description" content="Melden Sie via Karte Probleme und Ideen im öffentlichen Raum, die dann von einer kommunalen Verwaltung bearbeitet werden." />
    <meta name="author" content="<?php echo $config['labels']['name']; ?>" />
    <title>Klarschiff – Portal zur Bürgerbeteiligung</title>
    <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="images/icons/favicon.ico" />
    <link rel="alternate" type="application/atom+xml" title="Klarschiff: Meldungen" href="rss.php" />
    <link rel="stylesheet" type="text/css" media="all" href="styles/jquery-ui-1.11.2.min.css" />
    <link rel="stylesheet" type="text/css" media="all" href="libs/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" media="all" href="styles/index.css" />
    <script type="text/javascript" src="javascripts/build/libs.js"></script>
    <script type="text/javascript" src="javascripts/build/index.js"></script>
  </head>
  <body>
    <?php include("header.inc.php"); ?>
    <div id="content" class="container">
      <div id="eye-catcher" class="row">
        <div class="overlay guide">
          <h3><span class="italic">Klarschiff.SN</span> – Bürgerbeteiligung</h3>
          <p>
            Rufen Sie die <a href="<?php echo MAP_URL; ?>" target="_self">
              <span class="bold">Karte</span></a> auf <span class="bold">→</span>
            setzen Sie Ihre Meldung an die passende Stelle <span class="bold">→</span>
            beschreiben Sie Ihre Meldung kurz <span class="bold">→</span>
            verfolgen Sie, wie die Stadtverwaltung die Bearbeitung übernimmt.
          </p>
          <p>
            Eine genaue Anleitung finden Sie <a href="hilfe.html" target="_blank"><span class="bold">hier</span></a>.
          </p>
        </div>
        <div class="overlay news" style="text-align: left;">
          <p>
            <h3 style="line-height: 18px;">Liebe Bürgerinnen und Bürger,<br /> liebe Gäste!</h3>
Vielen Dank für Ihre Hinweise, Ideen  und Anregungen. Sie erleichtern unsere Arbeit mit einer möglichst präzisen Beschreibung Ihres Anliegens. Die Stadtverwaltung wird sich bemühen, innerhalb von drei Tagen darauf zu reagieren.

          </p>
        </div>
        <div id="map" title="Karte aufrufen"></div>
      </div>
      <div id="main" class="row">
        <div id="statistics" class="col-md-4">
          <h2>Statistik</h2>
          <div class="media statistic">
            <?php $new_last_month = $frontend->count_new_advices_last_month(); ?>
            <div class="media-left number red"><?php echo intval($new_last_month); ?></div>
            <div class="media-body text">neue Meldung<?php if (intval($new_last_month) != 1) echo 'en'; ?> letzten Monat</div>
          </div>
          <div class="media statistic">
            <?php $done_last_month = $frontend->count_done_advices_last_month(); ?>
            <div class="media-left number green"><?php echo intval($done_last_month); ?></div>
            <div class="media-body text">Meldung<?php if (intval($done_last_month) != 1) echo 'en'; ?> erledigt letzten Monat</div>
          </div>
          <div class="media statistic">
            <?php $new_since_start = $frontend->count_new_advices_since('2016-03-01'); ?>
            <div class="media-left number yellow"><?php echo intval($new_since_start) ?></div>
            <div class="media-body text">neue Meldung<?php if (intval($new_since_start) != 1) echo 'en' ?> seit 01.03.2016</div>
          </div>
        </div>
        <div class="col-md-4 center">
          <h2>Adressensuche</h2>
          <div id="search">
            <input id="searchtext" size="20" type="text" name="searchtext" title="Stadtteil, Straße oder Adresse eingeben…" />
            <div class="results" id="results-container"></div>
          </div>
          <a id="start" class="button" href="<?php echo MAP_URL; ?>" target="_self">Karte aufrufen</a>
        </div>
        <div id="issues" class="col-md-4">
          <h2>Kürzlich gemeldet<img id="rss" src="images/rss.png" alt="rss-feed" title="Meldungen als RSS-Feed abonnieren" /></h2>
          <?php foreach ($frontend->newest_advices(4) as $advice) { ?>
            <div class="media issue" data-advice-id="<?php echo $advice['id']; ?>" title="Karte mit Fokus auf diese Meldung aufrufen">
              <div class="media-left"><img src="images/icons/<?php echo $advice['type']; ?>_<?php echo $advice['status']; ?>_layer.png" alt="icon" /></div>
              <div class="media-body"><?php echo $advice['category'], "<br/>", $advice['subcategory']; ?></div>
            </div>
          <?php } ?>
        </div>
      </div>
      <div class="row footer">
        <h3><span class="italic">Klarschiff</span> mobil</h3>
        Wenn Sie diese Website mit einem Smartphone oder Tablet besuchen, wird automatisch die
        <a href="<?php echo MOBILE_FRONTEND_URL; ?>" target="_self"><span class="bold">mobile Version</span></a> von
        <span class="italic">Klarschiff</span> gestartet.
      </div>
      <div class="row footer">
        <a href="http://ks-mecklenburg.de/" target="_blank" title="zur KSM Seite" style="display: inline-block;float: right; margin-top: 20px;">
          <img src="images/ksm-logo.png" alt="Logo" />
        </a>
        <h3>Bei Fragen oder Hinweisen wenden Sie sich bitte an das</h3>
        Ideen- und Beschwerdemanagement der Stadtverwaltung Schwerin<br/>
        E-Mail: <a href="mailto:ideen-beschwerden@schwerin.de">ideen-beschwerden@schwerin.de</a><br/>
        Telefon: 0385 545 2222
      </div>
    </div>
  </body>
</html>
