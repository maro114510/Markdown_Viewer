// Desc: render markdown to html

const path = require( 'path' );
const { BrowserWindow } = require( 'electron' );

class RendererApp
{
	constructor( mainWindow )
	{
		console.log( "RendererApp" );
		this.mainWindow = mainWindow;
	}

	async init()
	{
		console.log( "RendererApp.init" );
	}

	async createWindow( outputPath )
	{
		const WIDTH = 1300;
		const HEIGHT = 800;

		this.mainWindow = new BrowserWindow({
			width: WIDTH,
			height: HEIGHT,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				sandbox: true,
			}
		});

		this.loadWindow( outputPath );

		this.mainWindow.on( 'closed', () => {
			mainWindow = null;
		}
		);
		
		this.mainWindow.webContents.on( 'did-finish-load', () => {
			const fileName = path.basename( outputPath );
			this.mainWindow.setTitle( fileName );
		}
		);
	}
	
	async loadWindow( outputPath )
	{
		this.mainWindow.loadURL(
			'file://' + outputPath
		);
	}
}

module.exports = { RendererApp };



// End of Script