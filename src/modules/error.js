// Desc: Wrapper of Error class

const fs = require( 'fs' );
const { dialog } = require( 'electron' );

class ErrorWrapper extends Error
{
	constructor()
	{
		super( ...arguments );

		Object.defineProperty( this, 'name', {
			value: this.constructor.name,
			writable: true,
			enumerable: false,
			configurable: true
		} );

		this.errorPath = "./log/error.log"
	}

	/**
	 * main processでエラーが発生したときに呼び出す
	 * エラーログをファイルに出力し、エラーダイアログを表示する
	 */
	errorMain( error )
	{
		this.errorLog( error );

		const message = error.message;
		const detail = error.detail;

		dialog.showErrorBox(
			{
				title: "Error",
				content: "An error has occurred.",
				detail: `${message}\n${detail}`
			}
		);
	}

	/**
	 * ログファイルにエラーの情報を出力する
	 * ログのフォーマットは以下
	 * YYYY-MM-DD HH:mm:ss [name] message
	 * detail
	 * fileName
	 */
	errorLog( error )
	{
		const name = error.name;
		const message = error.message;
		const detail = error.detail;
		const fileName = error.fileName;

		//現在日付時刻とエラーの情報をすべてエラーログに出力する
		//YYYY-MM-DD HH:mm:ss [name] message
		const now = new Date();
		const log = `${now.toISOString()} [${name}] ${message}:${detail}:${fileName}\n`;

		//エラーログをファイルに出力する
		fs.appendFileSync( this.errorPath, log );
	}
}


module.exports = { ErrorWrapper };



// End of script