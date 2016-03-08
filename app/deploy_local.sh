#!/bin/bash

OLDDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

COMPILE_COMMAND="./client/scripts/compile.sh"

ARGS=("$@")
NUMARGS="$#"
COUNTER=0
while [  $COUNTER -lt $NUMARGS ]; do
    COMPILE_COMMAND="$COMPILE_COMMAND ${ARGS[$COUNTER]}"
    let COUNTER=COUNTER+1
done

$COMPILE_COMMAND
./client/scripts/install.sh

cd $OLDDIR