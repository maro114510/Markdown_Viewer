// Desc: export PDF

const fs = require( 'fs');

async function ExportPDF( mainWindow, dialog )
{
	const filePath = await selectFilePath( dialog );
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
			.then( data => {
				fs.writeFile( filePath, data, ( error ) => {
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


async function selectFilePath( dialog )
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
		.then( result => {
			resolve( result.filePath );
		})
		.catch( error => {
			reject(error);
		});
	});
}



async function changeBar( mainWindow, bool )
{
	//プロミスで非同期にして待たせる
	if( bool )
	{
		new Promise( ( resolve, reject ) => {
			//メインウインドウの`#bar`の`display`を`none`にする
			mainWindow.webContents.executeJavaScript( 'document.getElementById( "fixed-bar" ).style.display = "none";' );
			mainWindow.webContents.executeJavaScript( 'document.getElementById( "directory" ).style.display = "none";' );
		});
	}
	else
	{
		//メインウインドウの`#bar`の`display`を`block`にする
		mainWindow.webContents.executeJavaScript( 'document.getElementById( "fixed-bar" ).style.display = "block";' );
	}

}


module.exports = { ExportPDF };



// End of script