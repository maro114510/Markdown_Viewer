// Desc: Main process of the app

// Modules
const { app, BrowserWindow } = require('electron')

const { MarkdownViewer } = require( './mainProcess' );

// Main deal

app.on( 'ready', async () => {
	console.log( 'App is ready' );

	createWindow( app );
});

app.on( 'window-all-closed', () => {
	// in macOS, keep app running until user quits explicitly
	if( process.platform !== 'darwin' )
	{
		app.quit();
	}
})

app.on( 'activate', () => {
	// in macOS, re-create window when dock icon is clicked and there are no other windows
	if( BrowserWindow.getAllWindows().length === 0 )
	{
		console.log( 'App is activated' );
		createWindow( app );
	}
});

// functions

async function createWindow( app )
{
	// create main process instance
	const mainIns = new MarkdownViewer( app );

	mainIns.init();
	await mainIns.handleMain();
	mainIns.handleCreateWindow();
}



// End of script