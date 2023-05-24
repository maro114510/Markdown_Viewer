const { app, dialog, BrowserWindow } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require( './modules/get_filepath' );
const { getFileEncoding } = require( './modules/detect_encoding' );
const { getFileContent } = require( './modules/get_file_content' );
const { parseMD } = require( './modules/parse_md' );
const { insertHTML } = require( './modules/insert_to_template' );

// Main deal

app.on( 'ready', async () => {
	handleMain();
});

app.on( 'window-all-closed', () => {
	if (process.platform !== 'darwin')
	{
		app.quit();
	}
})

// ドックアイコンをクリックしたときにウィンドウを再表示する
app.on( 'activate', () => {
	if( BrowserWindow.getAllWindows().length === 0 )
	{
		handleMain();
	}
});

// functions

async function handleMain()
{
	const filePath = await handleGetFilePath();
	const encoding = await handleGetFileEncoding( filePath );
	const fileContent = await getFileContent( filePath, encoding );
	const html = handleMarkdown( fileContent );

	const outputPath = handleInsertHTML( html );
	createWindow( outputPath );
}

function createWindow( outputPath )
{
	let mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: true,
			// preload: '/path/to/preload.js'
		}
	});

	mainWindow.loadURL(
		'file://' + __dirname + '/' + outputPath
	);

	// ウィンドウが閉じられたときの処理
	mainWindow.on( 'closed', () => {
		mainWindow = null;
	});
}

async function handleGetFilePath()
{
	let counter = 0;
	while( counter < 5 )
	{
		try
		{
			const filePath = await getFilePath( dialog );
			return filePath;
		}
		catch( error )
		{
			dialog.showErrorBox('Error', error.message);
			if( counter === 4 )
			{
				dialog.showErrorBox('Error', 'You have exceeded the maximum number of attempts.');
				app.quit();
			}
			counter++;
		}
	}
}

async function handleGetFileEncoding( filePath )
{
	try
	{
		const encoding = await getFileEncoding( filePath );
		return encoding;
	}
	catch( error )
	{
		dialog.showErrorBox( 'Error', error.message );
	}
}

function handleMarkdown( fileContent )
{
	try
	{
		const html = parseMD( fileContent );
		return html;
	}
	catch( error )
	{
		dialog.showErrorBox( 'Error', error.message );
		app.quit();
	}
}

function handleInsertHTML( html )
{
	try
	{
		const newHTML = insertHTML( html );
		return newHTML;
	}
	catch( error )
	{
		dialog.showErrorBox( 'Error', error.message );
	}
}

// Helper functions

function handleGetFilePathError( error )
{
	dialog.showErrorBox( 'Error', error.message );
	app.quit();
}


// End of script
