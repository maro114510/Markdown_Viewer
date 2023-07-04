// Desc: get file content

const fs = require( 'fs' );

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

export { getFileContent };


// End of script