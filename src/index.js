const { app, dialog, BrowserWindow } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require( './modules/get_filepath' );
const { getFileEncoding } = require( './modules/detect_encoding' );
const { getFileContent } = require( './modules/get_file_content' );
const { parseMD } = require( './modules/parse_md' );
const { insertHTML } = require( './modules/insert_to_template' );
const { ExportPDF } = require( './modules/export_pdf' );

// Main deal

app.on( 'ready', async () => {
	// アプリの準備ができたら、メインウィンドウを表示する
	handleMain();
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
		handleMain();
	}
});

// functions

// ####################################################################################################

async function handleMain()
{
	// パスの取得からHTMLの挿入までの処理をまとめている
	const filePath = await handleGetFilePath();
	const encoding = await handleGetFileEncoding( filePath );
	const fileContent = await getFileContent( filePath, encoding );
	const html = handleMarkdown( fileContent );

	const outputPath = handleInsertHTML( html );
	createWindow( outputPath );
}

// ####################################################################################################

function createWindow( outputPath )
{
	// A4の大きさを想定しているので、ウィンドウサイズは固定
	const WIDTH = 855;
	const HEIGHT = 600;

	let mainWindow = new BrowserWindow({
		width: WIDTH,
		height: HEIGHT,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: true,
			// preload: '/path/to/preload.js'
		}
	});

	// HACK: モジュールに切り出したほうがいいかもしれない
	mainWindow.loadURL(
		'file://' + __dirname + '/' + outputPath
	);

	// ウィンドウが閉じられたときの処理
	mainWindow.on( 'closed', () => {
		mainWindow = null;
	});

	// ウィンドウが読み込まれたときの処理
	mainWindow.webContents.on( 'did-finish-load', () => {
		// ウィンドウのタイトルを設定
		mainWindow.setTitle( 'Markdown Viewer' );

		// PDFに出力する
		ExportPDF( mainWindow, dialog );
	});

}

async function handleGetFilePath()
{
	// マークダウンの拡張子でないものを選択した場合、エラーを表示して再度ファイル選択を促す
	// BUGFIX: アプリを最初に起動したときにファイル選択ダイアログが複数回表示される
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
			dialog.showErrorBox( 'Error', error.message );
			if( counter === 4 )
			{
				dialog.showErrorBox(
					'Error', 'You have exceeded the maximum number of attempts.'
				);
				app.quit();
			}
			counter++;
		}
	}
}

async function handleGetFileEncoding( filePath )
{
	// ラッピングするときにエラーをキャッチできないので、ここでエラーをキャッチする
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
	// ラッピングするときにエラーをキャッチできないので、ここでエラーをキャッチする
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
	// ラッピングするときにエラーをキャッチできないので、ここでエラーをキャッチする
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

function handleExportPDF( mainWindow, dialog )
{
	// ラッピングするときにエラーをキャッチできないので、ここでエラーをキャッチする
	try
	{
		ExportPDF( mainWindow, dialog );
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