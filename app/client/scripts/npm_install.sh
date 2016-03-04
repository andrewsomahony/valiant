#!/bin/bash

echo "Installing front-end dependencies..."
PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")" && pwd -P
npm install
cd $PREVDIR