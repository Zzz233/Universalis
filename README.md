[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d07d05e0461749748734bba48cabfb1f)](https://www.codacy.com/manual/karashiiro/Universalis?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=karashiiro/Universalis&amp;utm_campaign=Badge_Grade)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Universalis
A crowdsourced market board aggregator.

## Endpoint Reference
*   /api/:world/:item
*   /api/history/:world/:item
*   /api/tax-rates
*   /api/extra/content/:contentID
*   /api/extra/stats/upload-history
*   /api/extra/stats/recently-updated
*   /api/extra/stats/least-recently-updated
*   /api/extra/stats/world-upload-counts
*   /upload/:apiKey

## Client-app Development
Please see goat's [ACT plugin](https://github.com/goaaats/universalis_act_plugin) for an example of how to collect and upload market board data.

## Development
Use of an AQL syntax-highlighting plugin is recommended.

Requires [Node.js](https://nodejs.org/) v10 or higher, [PHP](https://www.php.net/downloads.php), [MariaDB](https://mariadb.org/download/), [Redis](https://redis.io/download), [Composer](https://getcomposer.org/), and [ArangoDB Community Edition](https://www.arangodb.com/download-major/) v3.7 or higher.

Also build a DataExports and an icon2x by running the exporter solution.

Uncomment/add in php.ini:
```
extension=redis.so
```

MariaDB commands:
```
CREATE DATABASE `dalamud`;
CREATE USER 'dalamud'@localhost IDENTIFIED BY 'dalamud';
```

Setup script:
```
npm install -g yarn
npm install
git submodule init
git submodule update
cd mogboard
git submodule init
git submodule update
composer install
php bin/console doctrine:schema:create
php bin/console PopulateGameDataCommand -vvv
php bin/console ImportTranslationsCommand -vvv
yarn
yarn dev
symfony server:start -vvv --port 8000
cd ..
npm run build
npm start
```

## To update
Go to the mogboard/ folder, and execute the following commands after adding any new front-end data.
```
sudo rm -rf var/
sudo redis-cli FLUSHALL
sudo php bin/console PopulateGameDataCommand -vvv
sudo php bin/console ImportTranslationsCommand -vvv
sudo chmod 0777 var/ -R
```

### Single-line form
```
sudo rm -rf var/ && sudo redis-cli FLUSHALL && sudo php bin/console PopulateGameDataCommand -vvv && sudo php bin/console ImportTranslationsCommand -vvv && sudo chmod 0777 var/ -R
```