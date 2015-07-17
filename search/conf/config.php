<?php
# POSTGRESQL DATABASE
define("HOST","localhost");
define("PORT",5434);
define("NAME","standortsuche");
define("USER","standortsuche");
define("PASS","standortsuche");
define("SCHEMA","public");

define("URL", "map.php");

# SOLR
$solrConf = array(
    'host' => 'klarschiff-test-sn',
    'port' => 8080,
    'path' => 'solr',
    'core' => 'klarschiff_sn',
    'version' => 4,
    'params' => array(
      'rows' => 5
    )
);
