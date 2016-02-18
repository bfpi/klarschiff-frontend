<?php 
require_once 'config/urls.php';
$config = include('config/config.php');
?>
<div id="header"></div>
<div id="menu" class="container row">
  <nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header pull-left">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <img alt="Brand" src="images/klarschiff.png">
        </button>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <?php
          foreach ($config['nav'] as $nav) {
            if ((preg_match('/\/index.php$/', $_SERVER['SCRIPT_NAME']) && $nav['label'] == 'Start') 
              || (!preg_match('/\/index.php$/', $_SERVER['SCRIPT_NAME']) && $nav['label'] == 'Karte')) {
              continue;
            } else {
              echo '<li><a href="', $nav['url'], '">', $nav['label'], '</a></li>';
            }
          }
          ?>
        </ul>
      </div>
    </div>
  </nav>
</div>
