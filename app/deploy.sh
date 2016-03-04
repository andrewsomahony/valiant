#!/bin/bash

OLDDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

./client/scripts/compile.sh
./client/scripts/install.sh

ROOTDIR=`git rev-parse --show-toplevel`

cd $ROOTDIR

git push origin `git subtree split --prefix app/server master`:production --force

cd $OLDDIR