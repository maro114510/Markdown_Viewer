const { app, BrowserWindow } = require( 'electron' )
const { ensureDir } = require( 'fs-extra' )

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	})

	win.loadFile( './html/index.html' )
}

app.whenReady().then(() => {
	createWindow()

	app.on( 'activate', () => {
		if ( BrowserWindow.getAllWindows().length === 0 ) {
			createWindow()
		}
	})
})

app.on( 'window-all-closed', () => {
	if ( process.platform !== 'darwin' ) {
		app.quit()
	}
})


// End of script