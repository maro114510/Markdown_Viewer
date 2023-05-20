// Desc: Get file path from user

const fs = require( 'fs' ).promises;

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

				validateFilePath( filePath )
					.then( () => resolve( filePath ) )
					.catch( error => reject( error ) );
			}
		})
		.catch( error => {
			reject( error );
		});
	});
}

async function validateFilePath( filePath )
{
	try
	{
		await fs.access( filePath );
	}
	catch( error )
	{
		throw new Error( 'File path does not exist' );
	}

	if( !isValidFileExtension( filePath ) )
	{
		throw new Error(
			'Invalid file extension. Only Markdown files are allowed.'
		);
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

	if( !fileExtension )
	{
		return false;
	}

	return validExtensions.includes( fileExtension );
}

function getFileExtension( filePath )
{
	const extIndex = filePath.lastIndexOf( '.') ;
	return filePath.slice( extIndex ).toLowerCase();
}


module.exports = { getFilePath };


// End of script