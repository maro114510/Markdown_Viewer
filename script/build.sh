#!/bin/bash

# Build the project
######################################################
# Variables

BASE_DIR="$(pwd)"
PROJECT_DIR="$BASE_DIR/src"
BUILD_DIR="$BASE_DIR/build"

# Default platform is darwin
PLATFORM="mac"

######################################################
# Functions

function usage() {
	echo "Usage: $0 [options]"
	echo "Options:"
	echo "  -p, --platform <platform>  Platform to build (darwin, linux, win32)"
	echo "  -h, --help                 Show this help"
}

######################################################
# Main

# Clean the build directory
rm -rf "$BUILD_DIR/Markdown_Viewer"

# Parse arguments
while getopts ":p:h-:" opt; do
	case "$opt" in
		p)
			PLATFORM="$OPTARG"
			;;
		h)
			usage
			exit 0
			;;
		-)
			case "$OPTARG" in
				platform=*)
					PLATFORM="${OPTARG#*=}"
					;;
				help)
					usage
					exit 0
					;;
				*)
					echo "Invalid option: --$OPTARG" >&2
					exit 1
					;;
			esac
			;;
		\?)
			echo "Invalid option: -$OPTARG" >&2
			exit 1
			;;
	esac
done


# Compile the project
cd "$PROJECT_DIR"
echo "Compiling the project..."
sh ./compile.sh

# Install dependencies
echo "Now is in $(pwd)"
npm install

# Build the project
build_command=$(cat <<EOF
npx electron-builder \
	build \
	--config electron-builder.json \
	--$PLATFORM
EOF
)

eval "$build_command"




# End of Script