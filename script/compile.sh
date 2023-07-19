#!/bin/bash


CURRENT_DIR="$(pwd)"
if [ $CURRENT_DIR != $CURRENT_DIR/src ]; then
	cd $CURRENT_DIR/src
	CURRENT_DIR="$(pwd)"
fi
TARGET_DIR=$CURRENT_DIR/dist/html
BASE_DIR=$CURRENT_DIR/html/

cp -r $BASE_DIR $TARGET_DIR


# Compile TypeScript
tsc


# End Of Script