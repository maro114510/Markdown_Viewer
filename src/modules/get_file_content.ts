// Desc: get file content
//@ts-check
'use strict';

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