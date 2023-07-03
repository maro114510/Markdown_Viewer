// Desc: Main process of the app
//@ts-check
'use strict';

// Modules
const { app, BrowserWindow } = require('electron');

// Classes
const { MarkdownViewer } = require( './mainProcess' );

// Main deal

app.on( 'ready', async () => {
	console.log( 'App is ready' );

	await createWindow( app );
});

app.on( 'window-all-closed', () => {
	// in macOS, keep app running until user quits explicitly
	if( process.platform !== 'darwin' )
	{
		app.quit();
	}
})

app.on( 'activate', async () => {
	// in macOS, re-create window when dock icon is clicked and there are no other windows
	if( BrowserWindow.getAllWindows().length === 0 )
	{
		console.log( 'App is activated' );
		await createWindow( app );
	}
});

// functions

async function createWindow( app: any )
{
	try
	{
		// create main process instance
		const mainIns: any = new MarkdownViewer( app );
		mainIns.init();
		await mainIns.handleMain();
		mainIns.handleCreateWindow();
	}
	catch( error )
	{
		console.error( error );
	}
}



// End of script