Hearth (Front end)
==================
Front and app is based on Angular.

Dependencies:
* ruby
* sass
* compass
* zurb-foundation
* node

How install ruby dependecies
```shell
cd project/web
bundle
```

How to run server
```shell
cd project/web/app
npm install
grunt serve
```

Favicon location
```
Prod. Facebook APP
https://developers.facebook.com/apps/277542219089599/app-details/

Stage Facebook APP
https://developers.facebook.com/apps/769756073037691/app-details/

Dev Facebook APP
https://developers.facebook.com/apps/1495788017321716/app-details/

App favicon
/web/app/app/apple-touch-icon-114x114-precomposed.png
/web/app/app/google-product-logo.png
/web/app/app/apple-touch-icon-144x144-precomposed.png
/web/app/app/apple-touch-icon-57x57-precomposed.png
/web/app/app/apple-touch-icon-72x72-precomposed.png

Landing page favicon
/web/web/app/apple-touch-icon-114x114-precomposed.png
/web/web/app/google-product-logo.png
/web/web/app/apple-touch-icon-144x144-precomposed.png
/web/web/app/apple-touch-icon-57x57-precomposed.png
/web/web/app/apple-touch-icon-72x72-precomposed.png
```


Testing
-------
For end2end testing we use Protractor tool which is build on top of selenium. 

### Setup

Use npm to install all dependencies together with protractor and webdriver-manager tools which are needed for end2end testing.
```
cd web/app
npm install
./node_modules/.bin/webdriver-manager update
```

The webdriver-manager is a helper tool to easily get an instance of a Selenium Server running.

### Run tests

Run frontend app first:
```
npm start
```

Then you can run all tests using:
```
npm test
```

Or pick only one test suite from suite list in web/app/protractor.js file, eg.:
```
npm test -- --suite=unauth
```

Contact
-------

Hearth is owned by the [Adato Paradigma, o.s.](http://www.adato.cz), a
not-for-profit organization registered in the Czech Republic. Parts
of Hearth will be released under the [Affero General Public
License](http://www.gnu.org/licenses/agpl-3.0.html).
Currently, Heart is developed by Czech IT company
[TopMonks](http://www.topmonks.cz).

