#!/bin/bash

OLDDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

./client/scripts/compile.sh
./client/scripts/install.sh

cd $OLDDIR