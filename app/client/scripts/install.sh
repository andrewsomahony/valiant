#!/bin/bash

echo "Installing front-end on server..."
PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

rm -f ../../server/public/*.js
rm -f ../../server/public/*.css
rm -f ../../server/public/*.js.gz
rm -f ../../server/public/*.css.gz

cp ../_build/* ../../server/public/

cd $PREVDIR