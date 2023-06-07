// Desc: App entry point

const fs = require( 'fs' );
const path = require( 'path' );
const { dialog, ipcMain } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require( './modules/get_filepath' );
const { getFileEncoding } = require( './modules/detect_encoding' );
const { getFileContent } = require( './modules/get_file_content' );
const { parseMD } = require( './modules/parse_md' );
const { insertHTML } = require( './modules/insert_to_template' );
const { ExportPDF } = require( './modules/export_pdf' );
const { ErrorWrapper } = require( './modules/error' );

const { RendererApp } = require( './renderer' );

// MarkdownViewerClass

class MarkdownViewer
{
	constructor( app )
	{
		this.currentDir = "";
		this.templatePath = "";
		this.watchFilesPath = [];
		this.outputsPath = [];

		this.rendererApp = null;
		this.app = app;

		this.handleExportButton();

		this.Err = new ErrorWrapper();
	}

	async init()
	{
		//レンダラープロセスのインスタンスを作成
		this.rendererApp = new RendererApp( this.mainWindow );

		if( this.app.isPackaged )
		{
			this.currentDir = path.resolve( app.getAppPath(), '..' );
		}
		else
		{
			this.currentDir = __dirname;
		}

		this.templatePath = path.join( this.currentDir, "html", "index.html" );
		this.outputsPath.push(
			path.join( this.currentDir, "html", "output.html" )
		)
	}

	async handleLoad()
	{
		const fileContent = await this.handleGetFileContent( this.watchFilesPath[ 0 ], encoding );
		const html = this.handleMarkdown( fileContent );
		this.handleInsertHTML( html );

		this.handleCreateWindow();
	}

	async handleMain()
	{
		// パスの取得からHTMLの挿入までの処理
		this.watchFilesPath.push( await this.handleGetFilePath() );
		const encoding = await this.handleGetFileEncoding( this.watchFilesPath[ 0 ] );
		const fileContent = await this.handleGetFileContent( this.watchFilesPath[ 0 ], encoding );
		const html = this.handleMarkdown( fileContent );
		this.handleInsertHTML( html );
	}

	async handleGetFilePath()
	{
		try
		{
			const filePath = await getFilePath( dialog );
			return filePath;
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	async handleGetFileEncoding( filePath )
	{
		try
		{
			const encoding = await getFileEncoding( filePath );
			return encoding;
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	async handleGetFileContent( filePath, encoding )
	{
		try
		{
			const fileContent = await getFileContent( filePath, encoding );
			return fileContent;
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	handleMarkdown( fileContent )
	{
		try
		{
			const html = parseMD( fileContent );
			return html;
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	handleInsertHTML( html )
	{
		try
		{
			insertHTML(
				html,
				this.templatePath,
				this.outputsPath[ 0 ]
			);
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	handleExportPDF()
	{
		try
		{
			ExportPDF(
				this.mainWindow,
				dialog
			);
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	handleWatchFileChanges( filePath )
	{
		try
		{
			// ファイルの変更を監視する
			fs.watch(
				filePath,
				{ encoding: "utf-8" },
				( eventType ) => {
					if( eventType === "change" )
					{
						console.log( "File changed" );
						this.handleLoad();
					}
				}
			)
		}
		catch( error )
		{
			this.Err.errorMain( error );
		}
	}

	handleCreateWindow()
	{
		console.log( "handleCreateWindow()" );

		this.rendererApp.createWindow( this.outputsPath[ 0 ] );
	}

	handleExportButton()
	{
		console.log( "wait for export_pdf" );
		ipcMain.on( 'export_pdf', ( event, arg ) => {
			console.log( "export_pdf" );
			this.handleExportPDF();
		});
	}
}


// ####################################################################################################

module.exports = {
	MarkdownViewer
}



// End of script