// Desc: Get file path from user

const fs = require( 'fs' );

function getFilePath( app, dialog ) {
	return new Promise( ( resolve, reject ) => {
		app.on('ready', () => {
			dialog
			.showOpenDialog({
				properties: ['openFile']
			})
			.then(result => {
				if (!result.canceled) {
					const filePath = result.filePaths[0]
					resolve( filePath );
				}
			})
			.catch(error => {
				console.log(error);
				reject( error );
			});
		});
	});
}

function getFileEncoding( filePath ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, (err, data) => {
			if ( err ) {
				reject( err );
			} else {
				const encoding = detectFileEncoding( data );
				resolve( encoding );
			}
		});
	});
}

function getSystemEncoding() {
	return process.env[ 'LANG' ].split( '.' )[1];
}

function convertEncoding( filePath, targetEncoding ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( filePath, ( err, data ) => {
			if( err )
			{
				reject( err );
			}
			else 
			{
				const sourceEncoding = detectFileEncoding( data );
				const convertedData = convertDataEncoding( data, sourceEncoding, targetEncoding );
				resolve( convertedData );
			}
		});
	});
}

// Helper functions
function detectFileEncoding( data ) {
	// Implement the logic to detect file encoding
	// Return the detected encoding
}

function convertDataEncoding( data, sourceEncoding, targetEncoding ) {
	// Implement the logic to convert data encoding from sourceEncoding to targetEncoding
	// Return the converted data
}



module.exports = { getFilePath };


// End of script