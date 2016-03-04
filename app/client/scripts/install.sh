#!/bin/bash

echo "Installing front-end on server..."
PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"
cp ../build/_app.js ../../server/public/javascripts/
cp ../build/_app.css ../../server/public/stylesheets/
cd $PREVDIR