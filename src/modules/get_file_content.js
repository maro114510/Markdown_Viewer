// Desc: get file content

const fs = require( 'fs' );

function getFileContent( filePath, encoding )
{
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, encoding, ( error, data ) => {
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