#!/bin/bash
#
# Prerequisities:
# sudo npm --global foundation-cli
#
#

ENV="$1"

if [ "$ENV" != "development" ] && [ "$ENV" != "staging" ] && [ "$ENV" != "beta" ] && [ "$ENV" != "production" ]; then
 echo "Unknown environment, use one of the following: development, staging, beta, production"
 exit 1
fi

if [ "$#" -gt 1 ] ; then
 echo "Too many parameters"
 exit 1
fi

set -e -E
#build all
npm install
#npm install karma gulp-cli bower
node_modules/bower/bin/bower --allow-root install
npm run build --target=$ENV

