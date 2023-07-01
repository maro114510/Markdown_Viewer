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
//const { ErrorWrapper } = require( './modules/error' );
const { getDirectory } = require( './modules/get_directory' );

const { RendererApp } = require( './renderer' );
const { title } = require('process');

// MarkdownViewerClass

class MarkdownViewer
{
	constructor( app )
	{
		this.currentDir = "";
		this.templatePath = "";
		this.watchFilesPath = [];
		this.outputsPath = [];
		this.mainWindow = null;

		this.rendererApp = null;
		this.app = app;

		this.handleExportButton();
		this.getChooseFile();
	}

	async init()
	{
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

		this.rendererApp = new RendererApp( this.mainWindow );
	}

	async handleLoad( encoding = "utf8" )
	{
		const fileContent = await this.handleGetFileContent( this.watchFilesPath[ 0 ], encoding );
		const html = this.handleMarkdown( fileContent );
		this.handleInsertHTML( html );

		this.mainWindow.webContents.reload();
	}

	async handleMain()
	{
		// from get file path to insert html
		const direc = this.handleDirectory();
		//デバッグ用
		await this.sendDirectoryInfo( direc );
		const fileContent = "";
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
			this.errorWrap( error );
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
			this.errorWrap( error );
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
			this.errorWrap( error );
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
			this.errorWrap( error );
		}
	}

	handleExportPDF()
	{
		try
		{
			if( this.mainWindow && this.mainWindow.webContents )
			{
				ExportPDF(
					this.mainWindow,
					dialog
				);
			}
			else
			{
				console.log( "mainWindow is not defined" );
			}
		}
		catch( error )
		{
			this.errorWrap( error );
		}
	}

	handleWatchFileChanges( filePath )
	{
		try
		{
			let isWatching = true;
			fs.watch( filePath, ( eventType ) => {
				if( eventType === "change" && isWatching )
				{
					isWatching = false;
					console.log( "File changed" );
					this.handleLoad();
					setTimeout( () => {
						isWatching = true;
					}, 3000 );
				}
			});
		}
		catch( error )
		{
			this.errorWrap( error );
		}
	}

	async handleCreateWindow()
	{
		this.mainWindow = await this.rendererApp.createWindow( this.outputsPath[ 0 ], this.watchFilesPath[ 0 ] );
	}

	handleExportButton()
	{
		ipcMain.on( 'export_pdf', () => {
			console.log( "export_pdf" );
			this.handleExportPDF();
		});
	}

	handleDirectory()
	{
		try
		{
			const directory = getDirectory();
			return directory;
		}
		catch( error )
		{
			this.errorWrap( error );;
		}
	}

	async sendDirectoryInfo( directory )
	{
		ipcMain.handle( 'get_directory', () => {
			return directory;
		});
	}

	getChooseFile()
	{
		ipcMain.on( 'choose_file', async ( event, arg ) => {
			console.log( arg );
			const filePath = arg;
			const encoding = await this.handleGetFileEncoding( filePath );
			const fileContent = await this.handleGetFileContent( filePath, encoding );
			const html = this.handleMarkdown( fileContent );
			this.handleInsertHTML( html );
			this.watchFilesPath.push( filePath );
			this.handleWatchFileChanges( filePath );

			this.rendererApp.loadWindow( this.outputsPath[ 0 ] );
		});
	}

	errorWrap( error )
	{
		console.log( error );
		dialog.showErrorBox(
			error
		);
	}
}


// ####################################################################################################

module.exports = {
	MarkdownViewer
}



// End of script