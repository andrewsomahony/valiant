#!/bin/bash

echo "Compiling front-end..."

PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

COMMAND="gulp --gulpfile ../gulpfile.js"

ARGS=("$@")
NUMARGS="$#"
COUNTER=0
while [  $COUNTER -lt $NUMARGS ]; do
    COMMAND="$COMMAND ${ARGS[$COUNTER]}"
    let COUNTER=COUNTER+1
done

$COMMAND
cd $PREVDIR