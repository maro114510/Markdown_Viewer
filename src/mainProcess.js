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
const { getDirectory } = require( './modules/get_directory' );

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
		this.mainWindow = null;

		this.rendererApp = null;
		this.app = app;

		this.handleExportButton();

		this.Err = new ErrorWrapper();
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
		this.watchFilesPath.push( await this.handleGetFilePath() );
		const direc = this.handleDirectory();
		await this.sendDirectoryInfo( direc );
		const encoding = await this.handleGetFileEncoding( this.watchFilesPath[ 0 ] );
		const fileContent = await this.handleGetFileContent( this.watchFilesPath[ 0 ], encoding );
		const html = this.handleMarkdown( fileContent );
		this.handleInsertHTML( html );

		this.handleWatchFileChanges( this.watchFilesPath[ 0 ], encoding )
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
			this.Err.errorMain( error );
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
			this.Err.errorMain( error );
		}
	}

	async handleCreateWindow()
	{
		this.mainWindow = await this.rendererApp.createWindow( this.outputsPath[ 0 ], this.watchFilesPath[ 0 ] );
	}

	handleExportButton()
	{
		ipcMain.on( 'export_pdf', ( event, arg ) => {
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
			this.Err.errorMain( error );
		}
	}

	async sendDirectoryInfo( directory )
	{
		ipcMain.handle( 'get_directory', () => {
			return directory;
		});
	}
}


// ####################################################################################################

module.exports = {
	MarkdownViewer
}



// End of script