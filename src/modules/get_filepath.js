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


module.exports = { getFilePath };


// End of script