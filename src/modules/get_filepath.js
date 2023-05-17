// Desc: Get file path from user

const fs = require( 'fs' );

function getFilePath( dialog )
{
	return new Promise( ( resolve, reject ) => {
		dialog
		.showOpenDialog(
			{
				properties: [ 'openFile' ]
			}
		)
		.then( result => {
			if ( !result.canceled ) {
				const filePath = result.filePaths[0];

				validateFilePath( filePath );
				resolve( filePath );
			}
		})
		.catch( error => {
			reject( error );
		});
	});
}

function validateFilePath(filePath)
{
	if ( !fs.existsSync( filePath ) )
	{
		throw new Error( 'File path does not exist' );
	}

	if( !isValidFileExtension( filePath ) )
	{
		throw new Error( 'Invalid file extension. Only Markdown files are allowed.' );
	}
}

function isValidFileExtension( filePath )
{
	const validExtensions = [
		'.md',
		'.markdown',
		'.mdown',
		'.mkdn',
		'.mkd',
		'.mdwn',
		'.mdtxt',
		'.mdtext',
	];

	const fileExtension = getFileExtension( filePath );

	return validExtensions.includes( fileExtension );
}

function getFileExtension( filePath ) {
	const extIndex = filePath.lastIndexOf( '.') ;
	return filePath.slice( extIndex ).toLowerCase();
}


module.exports = { getFilePath };


// End of script