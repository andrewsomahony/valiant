#!/bin/bash

echo "Compiling front-end..."
PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"
gulp
cd $PREVDIR