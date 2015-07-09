# Desktop-Frontend für *Klarschiff*

Das Desktop-Frontend für *Klarschiff,* einer Onlineplattform zum Melden und Bearbeiten von Problemen und Ideen, ist eine PHP-/HTML5-/JavaScript-Anwendung, basierend auf folgenden Frameworks und Bibliotheken:

*   [**Bootstrap**](http://getbootstrap.com): HTML5-/CSS-JavaScript-Framework für responsives Web-Design
*   [**jQuery**](https://jquery.com): JavaScript-Framework
*   [**OpenLayers 3**](http://openlayers.org): JavaScript-Mapping-Framework
*   [**Proj4js**](https://github.com/proj4js/proj4js): JavaScript-Bibliothek zur Transfomation von Koordinaten

## Voraussetzungen

Zur Installation werden [**Node.js**](http://nodejs.org) >= 0.10 und [npm](https://www.npmjs.com) benötigt. Letzteres wird in der Regel durch die Installation von [Node.js](http://nodejs.org) bereitgestellt.
Eine Installationsanleitung für Debian basierte Systeme ist hier zu finden: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

## Installation

1.  Anwendung aus dem Git-Repository klonen:

        git clone https://github.com/rostock/klarschiff-frontend /Pfad/zum/Anwendungsverzeichnis
        
1.  gegebenenfalls Proxy für [npm](https://www.npmjs.com) setzen:
    
        npm config set proxy http://meine-proxy-domain:mein-proxy-port
        npm config set https-proxy http://meine-proxy-domain:mein-proxy-port

1.  notwendige Pakete sowie Tools via [npm](https://www.npmjs.com) installieren:

        npm install
        npm install -g grunt-cli

1.  in der Datei `Anwendungsverzeichnis/Gruntfile.js` einige lokale URL-Pfade anpassen, zum Beispiel `http://localhost/klarschiff_desktop` auf `http://localhost/web-server-pfad/zum/anwendungsverzeichnis`
1.  Datei `Anwendungsverzeichnis/config/database.sample.php` kopieren als `Anwendungsverzeichnis/config/database.php`
1.  referenzierte Bibliotheken installieren und einrichten via [**Grunt**](http://gruntjs.com):

        grunt install

1. Die Tasks sind für zwei Umgebungen vorbereitet: 
    1. `development`: (Standardkonfiguration), die JavaScripte werden nur zusammengefasst, nicht komprimiert und es gibt einen Wachtdog, der bei Änderungen an den Quelldateien automatisch neue Builds für die Referenz in der Seite erstellt.
    2. `production`: Konfiguration via `GRUNT_ENV=production` (ggf. in der `/etc/environment`). Die Scripte werden für eine bessere Performance zusätzlich komprimiert an den Browser ausgeliefert. Ein automatisierter Watchdienst ist bisher nicht konfiguriert.
  
  1. Für beide Umgebungen wird der Standard-Tasks wie folgt aufgerufen:
  
          grunt

