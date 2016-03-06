#!/bin/bash

OLDDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"
cd ./server

npm start

cd $OLDDIR