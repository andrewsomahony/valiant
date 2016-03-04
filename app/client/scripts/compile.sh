#!/bin/bash

echo "Compiling front-end..."

if [ $# -eq 1 ]
  then
    ARG1="$1"
else
    ARG1=""
fi

if [ $# -eq 2 ]
  then
    ARG2="$2"
else
    ARG2=""
fi

PREVDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"
cd ../

pwd

gulp $ARG1 $ARG2
cd $PREVDIR