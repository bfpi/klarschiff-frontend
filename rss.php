<?php
require_once 'config/urls.php';
require_once 'php/frontend_dao.php';
header("Content-Type: text/xml; charset=utf-8");
echo '<?xml version="1.0" encoding="utf-8" ?>';
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:georss="http://www.georss.org/georss">
  <channel>
    <title>Klarschiff-Meldungen</title>
    <atom:link href="<?php echo FRONTEND_URL, 'rss.php'; ?>" rel="self" type="application/rss+xml" />
    <link><?php echo FRONTEND_URL; ?></link>
    <description>Diese Daten umfassen die Meldungen in Klarschiff, dem Portal zur Bürgerbeteiligung.</description>
    <language>de-de</language>
    <copyright>Ladeshauptstadt Schwerin</copyright>
    <image>
    <url><?php echo FRONTEND_URL, 'images/rss.png'; ?></url>
    <title>Klarschiff: Meldungen</title>
    <link><?php echo FRONTEND_URL; ?></link>
    </image>
    <?php
    $frontend = new FrontendDAO();
    foreach ($frontend->rss() as $rss) {
      $link = htmlentities(strip_tags(MAP_URL . "?advice=" . $rss['id']), ENT_QUOTES);
      ?>
      <item>
        <title><?php echo "#", $rss['id'], " ", $rss['typ'], " (", $rss['hauptkategorie'], " – ", $rss['unterkategorie'], ")"; ?></title>
        <description>
          <![CDATA[
          <b>Status:</b> <?php echo $rss['status']; ?><br/>
          <b>Statusinformation:</b> <?php echo $rss['statusinformation']; ?><br/>
          <b>Unterstützungen:</b> <?php echo $rss['unterstuetzungen']; ?><br/>
          <b>Beschreibung:</b> <?php echo $rss['beschreibung']; ?><br/>
          <b>Foto:</b> <?php echo $rss['foto']; ?><br/>
          <b>Info der Verwaltung:</b> <?php echo $rss['info_der_verwaltung']; ?><br/>
          <a href="<?php echo $link; ?>" target="_blank">Meldung in Klarschiff.SN ansehen</a>
          ]]>
        </description>
        <link><?php echo $link; ?></link>
        <guid><?php echo $link; ?></guid>
        <pubDate><?php echo $rss['datum']; ?></pubDate>
        <georss:point><?php echo $rss['y'], " ", $rss['x']; ?></georss:point>
      </item>
      <?php
    }
    ?>
  </channel>
</rss>
