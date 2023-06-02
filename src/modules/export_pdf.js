// Desc: export PDF

const fs = require('fs');

async function ExportPDF( mainWindow, dialog )
{
	const filePath = await selectFilePath( dialog );

	const options = {
		landscape: false,
		printBackground: true,
		pageSize: 'A4',
		marginsType: 0,
	};

	if( filePath )
	{
		mainWindow.webContents.printToPDF( options )
			.then( data => {
				fs.writeFile( filePath, data, error => {
					if( error )
					{
						throw error;
					}
					// TODO: 成功のポップアップなどを実装
					console.log( 'Write PDF successfully.' );
				});
			})
			.catch( error => {
				console.log( error )
			});
	}
}

async function selectFilePath( dialog )
{
	// デフォルトのパスを指定しつつ出力するファイルのフルパスを指定する
	// 非同期にしないとオブジェクトを渡してしまう
	return new Promise( ( resolve, reject ) => {
		dialog
			.showSaveDialog
			(
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


module.exports = { ExportPDF };



// End of script