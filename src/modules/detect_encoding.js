// Desc: detect file encoding

const fs = require( 'fs' );
const jschardet = require('jschardet');


function getFileEncoding( filePath )
{
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, ( err, data ) => {
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

function detectEncoding( data )
{
	try
	{
		const encoding = jschardet.detect( data ).encoding;
		return encoding;
	}
	catch( error )
	{
		throw error;
	}
}


module.exports = { getFileEncoding };


// End of script