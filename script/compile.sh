#!/bin/bash

# TODO: Attention
# ===================================================
# Please run this shell script in the src directory.
# ===================================================

CURRENT_DIR=$(pwd)
TARGET_DIR=$CURRENT_DIR/dist/html
BASE_DIR=$CURRENT_DIR/html/

cp -r $BASE_DIR $TARGET_DIR


# Compile TypeScript
tsc


# End Of Script