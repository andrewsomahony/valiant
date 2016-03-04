#!/bin/bash

OLDDIR=`pwd -P`
cd -P -- "$(dirname -- "$0")"

./client/scripts/compile.sh
./client/scripts/install.sh

ROOTDIR=`git rev-parse --show-toplevel`

cd $ROOTDIR

git subtree push --prefix app/server origin production

cd $OLDDIR