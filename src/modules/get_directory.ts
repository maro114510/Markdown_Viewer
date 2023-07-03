// Desc: Open directory


// Main deal

function getDirectory()
{
	const dirPath = dialog.showOpenDialogSync( {
		properties: [ 'openDirectory' ]
	});

	const directory = readDirectoryRecursively( dirPath[0] );

	return directory;
}

function readDirectoryRecursively( dirPath: string )
{
	const files = fs.readdirSync( dirPath );

	const directory: {
		path: string;
		files: string[];
		directories: any[];
	} = {
		path: dirPath,
		files: [],
		directories: []
	};

	files.forEach( ( file: string ) => {
		const filePath = path.join( dirPath, file );
		const stat = fs.statSync( filePath );

		if( stat.isDirectory() )
		{
			const subDir = readDirectoryRecursively( filePath );
			directory.directories.push( subDir );
		}
		else
		{
			//拡張子がmdのファイルだけを対象にする
			if( path.extname( filePath ) !== ".md" )
			{
				return;
			}
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