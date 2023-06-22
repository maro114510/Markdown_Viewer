// Desc: Open directory

// Modules
const { dialog } = require( 'electron' );
const fs = require( 'fs' );
const path = require( 'path' );


// Main deal

function getDirectory()
{
	const dirPath = dialog.showOpenDialogSync( {
		properties: [ 'openDirectory' ]
	});

	const directory = readDirectoryRecursively( dirPath[0] );

	return directory;
}

function readDirectoryRecursively( dirPath )
{
	const files = fs.readdirSync( dirPath );

	const directory = {
		path: dirPath,
		files: [],
		directories: []
	};

	files.forEach( file => {
		const filePath = path.join( dirPath, file );
		const stat = fs.statSync( filePath );

		if( stat.isDirectory() )
		{
			const subDir = readDirectoryRecursively( filePath );
			directory.directories.push( subDir );
		}
		else
		{
			directory.files.push( filePath );
		}
	});

	return directory;
}


// Exports
module.exports = {
	getDirectory
};



// End of script