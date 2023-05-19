const { app, dialog } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require('./modules/get_filepath');
const { getFileEncoding } = require('./modules/detect_encoding');
const { getFileContent } = require('./modules/get_file_content');
const { parseMD } = require('./modules/parse_md');

// Main deal

app.on('ready', async () => {
	const filePath = await handleGetFilePath();
	const encoding = await handleGetFileEncoding( filePath );
	const fileContent = await getFileContent( filePath, encoding );
	const html = handleMarkdown( fileContent );
	console.log( html );
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
	{
		app.quit();
	}
})

// functions

async function handleGetFilePath()
{
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
			dialog.showErrorBox('Error', error.message);
			if( counter === 4 )
			{
				dialog.showErrorBox('Error', 'You have exceeded the maximum number of attempts.');
				app.quit();
			}
			counter++;
		}
	}
}

async function handleGetFileEncoding( filePath )
{
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

// Helper functions

function handleGetFilePathError( error )
{
	dialog.showErrorBox( 'Error', error.message );
	app.quit();
}


// End of script
