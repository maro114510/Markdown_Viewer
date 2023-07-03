// Desc: get file content


function getFileContent( filePath: string, encoding: string )
{
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, encoding, ( error: Error, data: string ) => {
			if ( error ) {
				reject( error );
			} else {
				resolve( data );
			}
		});
	});
}

module.exports = { getFileContent };


// End of script