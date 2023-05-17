const { app, dialog } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require('./modules/get_filepath')
const { getFileEncoding } = require('./modules/detect_encoding')

// Main deal

app.on('ready', async () => {
	const filePath = await handleGetFilePath();
	const encoding = await getFileEncoding( filePath );
	console.log( encoding );
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

// functions

async function handleGetFilePath()
{
	let counter = 0;
	while (counter < 5)
	{
		try
		{
			const filePath = await getFilePath( dialog );
			return filePath;
		}
		catch( error )
		{
			dialog.showErrorBox('Error', error.message);
			if (counter === 4) {
				dialog.showErrorBox('Error', 'You have exceeded the maximum number of attempts.');
				app.quit();
			}
			counter++;
		}
	}
}

// Helper functions

function handleGetFilePathError( error )
{
	dialog.showErrorBox( 'Error', error.message );
	app.quit();
}


// End of script
