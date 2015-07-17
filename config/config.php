<?php

require_once 'urls.php';
return array(
  'database' => include('database.php'),
  'labels' => array(
    'name' => 'Klarschiff.HGW',
    'sidebar_headline' => '<img id="logopc" src="' . FRONTEND_URL . 'images/klarschiff_logo_328px.png" alt="Klarschiff.HGW"/>',
    'errors' => array(
      'db_unavailable' => 'Die Datenbank ist nicht erreichbar!',
      'ausserhalb_des_bereichs' => 'Die neue Meldung befindet sich außerhalb Greifswalds.',
      'mail_on_blacklist' => 'Ihre E-Mail-Adresse wird nicht akzeptiert, da sie auf unserer Trashmail-Blacklist steht.'
    )
  ),
  'functions' => array(
    'report_idea' => true,
    'report_problem' => true
  ),
  'thresholds' => array(
    'supporter' => 20
  ),
  'nav' => array(
    array(
      'label' => 'Startseite',
      'url' => BASE_URL
    ),
    array(
      'label' => 'Hilfe',
      'url' => FRONTEND_URL . 'hilfe.php'
    ),
    array(
      'label' => 'Datenschutz',
      'url' => FRONTEND_URL . 'datenschutz.php'
    ),
    array(
      'label' => 'Impressum',
      'url' => FRONTEND_URL . 'impressum.php'
    ),
    array(
      'label' => 'Nutzungsbedingungen',
      'url' => FRONTEND_URL . 'nutzungsbedingungen.php'
    )
  )
);
