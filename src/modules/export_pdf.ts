// Desc: export PDF


async function ExportPDF( mainWindow: any )
{
	const filePath = await selectFilePath();
	const options = {
		margins: {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		},
		printBackground: true,
		pageSize: 'A4'
	};


	if( filePath )
	{
		try
		{
			await changeBar( mainWindow, true );
			mainWindow.webContents.printToPDF( options )
			.then( ( data: any ) => {
				fs.writeFile( filePath, data, ( error: Error ) => {
					if( error )
					{
						throw error;
					}
					else
					{
						console.log( 'PDF exported' );
					}
				});

			changeBar( mainWindow, false );
			});
		}
		catch( error )
		{
			console.log( error );
			throw error;
		}
	}
}


async function selectFilePath()
{
	// デフォルトのパスを指定しつつ出力するファイルのフルパスを指定する
	// 非同期にしないとオブジェクトを渡してしまう
	return new Promise( ( resolve, reject ) => {
		dialog.showSaveDialog(
			{
				title: 'Select output directory',
				defaultPath: 'output.pdf',
				filters: [
					{ name: 'PDF', extensions: ['pdf'] }
				]
			}
		)
		.then( ( result: any ) => {
			resolve( result.filePath );
		})
		.catch( ( error: Error ) => {
			reject(error);
		});
	});
}



async function changeBar( mainWindow: any, bool: boolean )
{
	if( bool )
	{
		new Promise( () => {
			mainWindow.webContents.executeJavaScript( 'document.getElementById( "fixed-bar" ).style.display = "none";' );
			mainWindow.webContents.executeJavaScript( 'document.getElementById( "directory" ).style.display = "none";' );
		});
	}
	else
	{
		mainWindow.webContents.executeJavaScript( 'document.getElementById( "fixed-bar" ).style.display = "block";' );
	}
}


module.exports = { ExportPDF };



// End of script