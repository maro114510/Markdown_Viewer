const { app, dialog } = require('electron')

// Desc: Get file path from user
const { getFilePath } = require('./modules/get_filepath')

// Main deal

app.on('ready', async () => {
	await handleGetFilePath();
});

async function handleGetFilePath() {
	let counter = 0;
	while (counter < 5) {
		try {
			const filePath = await getFilePath( dialog );
			console.log(filePath);
			break;
		} catch (error) {
			dialog.showErrorBox('Error', error.message);
			if (counter === 4) {
				dialog.showErrorBox('Error', 'You have exceeded the maximum number of attempts.');
				app.quit();
			}
			counter++;
		}
	}
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

// End of script
