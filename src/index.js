const { app, dialog } = require( 'electron' )

// Desc: Get file path from user
const { getFilePath } = require( './modules/get_filepath' )


getFilePath( app, dialog )
	.then( ( filePath ) => {
		console.log( filePath );
	})
	.catch( ( error ) => {
		console.log( error );
	});

app.on( 'window-all-closed', () => {
	if ( process.platform !== 'darwin' ) {
		app.quit()
	}
})


// End of script