#!/bin/bash
#
#
#

set -e -E
#Karma tests
node_modules/.bin/karma start --single-run


npm run server -- --host=0.0.0.0 &
sleep 10
# jenkins specific command follows
protractor protractor-screenshots.js
