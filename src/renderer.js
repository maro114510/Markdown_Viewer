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
				devTools: true,
				preload: path.join( __dirname, "modules", "preload.js" ),
				javascript: true,
			}
		});

		this.loadWindow( outputPath );

		this.mainWindow.on( 'closed', () => {
			this.mainWindow = null;
		});

		this.mainWindow.webContents.openDevTools();
		this.mainWindow.webContents.on( 'did-finish-load', () => {
			const fileName = path.basename( outputPath );
			this.mainWindow.setTitle( fileName );
		}
		);

		//現在開いているウインドウを返す
		return this.mainWindow;
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