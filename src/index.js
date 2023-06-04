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
	// macOSでは、ウィンドウが閉じられてもアプリケーションとして残す
	if( process.platform !== 'darwin' )
	{
		app.quit();
	}
})

app.on( 'activate', () => {
	// ドックアイコンをクリックしたときにウィンドウを再表示する
	if( BrowserWindow.getAllWindows().length === 0 )
	{
		console.log( 'App is activated' );
		createWindow( app );
	}
});

// functions

async function createWindow( app )
{
	//メインプロセスのインスタンスを作成
	const mainIns = new MarkdownViewer( app );

	mainIns.init();
	await mainIns.handleMain();
	mainIns.handleCreateWindow();
}



// End of script