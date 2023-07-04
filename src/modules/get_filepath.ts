// Desc: Get file path from user

const fs = require( 'fs' );

function getFilePath( dialog: any )
{
	return new Promise( ( resolve, reject ) => {
		dialog
		.showOpenDialog(
			{
				properties: [ 'openFile' ]
			}
		)
		.then( ( result: any ) => {
			if ( !result.canceled ) {
				const filePath = result.filePaths[ 0 ];

				validateFilePath( filePath )
					.then( () => resolve( filePath ) )
					.catch( error => reject( error ) );
			}
		})
		.catch( ( error: Error ) => {
			reject( error );
		});
	});
}

async function validateFilePath( filePath: string )
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

function isValidFileExtension( filePath: string )
{
	// FIXME: ファイル選択ダイアログの標準フィルターを使うようにする
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

function getFileExtension( filePath: string )
{
	const extIndex = filePath.lastIndexOf( '.') ;
	return filePath.slice( extIndex ).toLowerCase();
}


export { getFilePath };


// End of script