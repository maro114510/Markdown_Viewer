// Desc: App entry point

const fs = require( 'fs' );
const path = require( 'path' );
const { dialog } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require( './modules/get_filepath' );
const { getFileEncoding } = require( './modules/detect_encoding' );
const { getFileContent } = require( './modules/get_file_content' );
const { parseMD } = require( './modules/parse_md' );
const { insertHTML } = require( './modules/insert_to_template' );
const { ExportPDF } = require( './modules/export_pdf' );

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
			dialog.showErrorBox(
				"Error\nIn handleGetFilePath()",
				error.message
			);
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
			dialog.showErrorBox(
				"Error\nIn handleGetFileEncoding()",
				error.message
			);
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
			dialog.showErrorBox(
				"Error\nIn handleGetFileContent()",
				error.message
			);
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
			dialog.showErrorBox(
				"Error\nIn handleMarkdown()",
				error.message
			);
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
			dialog.showErrorBox(
				"Error\nIn handleInsertHTML()",
				error.message
			);
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
			dialog.showErrorBox(
				"Error\nIn handleExportPDF()",
				error.message
			);
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
			dialog.showErrorBox(
				"Error\nIn handleWatchFileChanges()",
				error.message
			);
		}
	}

	handleCreateWindow()
	{
		console.log( "handleCreateWindow()" );

		this.rendererApp.createWindow( this.outputsPath[ 0 ] );
	}
}


// ####################################################################################################

module.exports = {
	MarkdownViewer
}



// End of script