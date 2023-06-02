// Desc: Main process of the app

// Modules
const fs = require( 'fs' );
const path = require( 'path' );
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
	//現在のディレクトリで`ls`コマンドを実行する
	const { stdout, stderr } = await exec( 'ls ーal' );
	//ダイアログで表示する
	dialog.showMessageBox( { message: stdout } );

	// アプリの準備ができたら、メインウィンドウを表示する
	let { filePath, outputPath } = await handleMain();
	createWindow( outputPath );

	// ファイルの変更を監視する
	// HACK: 複数ウインドウ時の対応
	// HACK: 記述量削減→初回ロードの戻り値などを再定義
	watchFileChanges(
		BrowserWindow.getAllWindows()[0],
		filePath,
		outputPath,
		loadWindow
	);
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
	return { filePath, outputPath };
}

// ####################################################################################################

function createWindow( outputPath )
{
	// A4の大きさを想定しているので、ウィンドウサイズは固定
	const WIDTH = 1300;
	const HEIGHT = 800;

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
		'file://' + outputPath
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
		handleExportPDF( mainWindow, dialog );
	});

}

async function handleGetFilePath()
{
	// マークダウンの拡張子でないものを選択した場合、エラーを表示して再度ファイル選択を促す
	try
	{
		const filePath = await getFilePath( dialog );
		return filePath;
	}
	catch( error )
	{
		handleGetFilePathError( error );
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
		dialog.showErrorBox(
			"In getFileEncoding()",
			error.message
		);
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
		dialog.showErrorBox(
			"In parseMD()",
			error.message
		);
		app.quit();
	}
}

function handleInsertHTML( html )
{
	//カレントディレクトリの絶対パスを取得
	const currentDir = app.isPackaged ? path.dirname( process.execPath ) : path.resolve( __dirname );
	const templatePath = currentDir + '/html/index.html';
	const outputPath = currentDir + '/html/output.html';

	try
	{
		return insertHTML(
			html,
			templatePath,
			outputPath
		);
	}
	catch( error )
	{
		dialog.showErrorBox(
			"In insertHTML()",
			error.message
		);
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

function watchFileChanges( mainWindow, filePath, outputPath, callback )
{
	fs.watch(
		filePath,
		{
			encoding: 'utf-8'
		},
		( eventType ) => {
			if( eventType === 'change' )
			{
				console.log( 'File changed.' );
				reloadWindow( filePath );
				callback( mainWindow, outputPath );
			}
		}
	)
}

async function reloadWindow( filePath )
{
	const encoding = await handleGetFileEncoding( filePath );
	const fileContent = await getFileContent( filePath, encoding );
	const html = handleMarkdown( fileContent );
	handleInsertHTML( html );
}

function loadWindow( mainWindow, outputPath )
{
	mainWindow.loadURL(
		'file://' + __dirname + '/' + outputPath
	);
}

// Helper functions

function handleGetFilePathError( error )
{
	dialog.showErrorBox( 'Error', error.message );
	app.quit();
}



// End of script