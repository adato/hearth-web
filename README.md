# Hearth.net (Front end)

## What is Hearth.net
[Hearth.net](https://hearth.net) is a social network based on generosity. Users 
are motivated to try the process of giving and accepting just for inner feeling
of happiness. Through generosity they may find inner freedom and peace.

## Why is Hearth.net a useful project 
Hearth.net is a playground for all people from all around the world, who 
understand the need of shifting the current paradigm.


## How to get started in few steps
To run your very own web server to try Hearth.net for yourself, whether to help 
us make better code, write some of (always) missing documentation and unit and 
more complex tests, you need to clone the repository first. 
To do so, you have to install 
[git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). Also you
will need to get 
[npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) to build and
run the Hearth.net server itself. Make sure you have both installed:

```bash
$ git --version
git version 2.13.6
$ npm --version
5.6.0
```

### Step 1 - Cloning repository
Then you should clone the repository using this command:

```bash
#  if you have github with SSH key
git clone git@github.com:hearth-net/hearth-web.git  
 
 
# if you have no SSH key asociated with github
git clone https://github.com/hearth-net/hearth-web.git
``` 

### Step 2 - building and running server
To build everything and start server on local machine use these two commands:
```bash
$ sh build.sh development
$ npm start
```

After successful running of the commands above, you will find running web 
server on [http://localhost:9000](http://localhost:9000)


## Useful links and hints

### Contributing to the code
If you are interested to get on board and help us make the Hearth.net better 
then you should check [CONTRIBUTING.md](CONTRIBUTING.md). We are looking 
forward to hear from you. Any kind of help is welcomed. 

While communicating with other developers and maintainers we've agreed to use follow the
[code of conduct](CODE-OF-CONDUCT.md)

### UI kit
Page with sample components used in Hearth.net project.

Check the UI kit page here: https://www.hearth.net/app/uikit


### Testing with Protractor
For end2end testing we use Protractor tool which is build on top of selenium. 

#### Setup

Use npm to install all dependencies together with protractor and webdriver-manager tools which are needed for end2end testing.
```
cd web/app
./build.sh development
./node_modules/.bin/webdriver-manager update
```

The webdriver-manager is a helper tool to easily get an instance of a Selenium Server running.

#### Run tests

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

### Testing with Karma

#### Run tests
Run the tests from the web/app directory.
```
karma start
```
It will search for the karma.spec.js in the current directory.
If you want to specify the config file, run 
```
karma start xxx.spec.js
```


### Structure and important files location
* /app/karma.conf.js - configuration file
* /app/test/unit/setup.js - additional setup for the test environment
* /app/test/unit - root directory for unit tests

### Examples
* app/test/spec/assets/components/avatar/avatar.spec.js -  setup of the 
directive test. 

## Contact

Hearth.net is owned by the 
[Adato Paradigma, z.u.](http://www.adato.cz), a not-for-profit 
organization registered in the Czech Republic. Parts of Hearth.net are 
released under the 
[Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.html).
Hearth.net was co-developed by Czech IT company 
[TopMonks](http://www.topmonks.cz) and internal team of programmers. 
Currently the source code was made public to motivate all interested 
programmers to share their time and co-create Hearth.net with the 
internal team. 
