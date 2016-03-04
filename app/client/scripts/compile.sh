#!/bin/bash

echo "Compiling front-end..."

PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"


gulp --gulpfile ../gulpfile.js
cd $PREVDIR