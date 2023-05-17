// Desc: get file content

function getFileContent( filePath ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, 'utf8', ( error, data ) => {
			if ( error ) {
				reject( error );
			} else {
				resolve( data );
			}
		});
	});
}