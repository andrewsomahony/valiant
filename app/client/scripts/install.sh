#!/bin/bash

echo "Installing front-end on server..."
PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

cp ../_build/_app.js ../../server/public/javascripts/
cp ../_build/_app.css ../../server/public/stylesheets/

cd $PREVDIR