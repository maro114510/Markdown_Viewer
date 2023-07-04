// Desc: detect file encoding
//@ts-check
'use strict';

const fs = require( 'fs' );
const jschardet = require( 'jschardet' );


function getFileEncoding( filePath: string )
{
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, ( err: Error, data: string ) => {
			if( err )
			{
				reject( err );
			}
			else
			{
				const encoding = detectEncoding( data );
				resolve( encoding );
			}
		});
	});
}

function detectEncoding( data: any )
{
	const detected = jschardet.detect( data );
	const encoding = detected.encoding;
	return encoding;
}

export { getFileEncoding };



// End of script