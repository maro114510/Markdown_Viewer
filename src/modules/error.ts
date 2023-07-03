// Desc: Wrapper of Error class

const { dialog } = require( 'electron' );

export class ErrorWrapper extends Error
{
	errorPath: string;
	constructor( errorPath: string )
	{
		super( ...arguments );

		Object.defineProperty( this, 'name', {
			value: this.constructor.name,
			writable: true,
			enumerable: false,
			configurable: true
		} );

		this.errorPath = errorPath;
	}

	/**
	 * main processでエラーが発生したときに呼び出す
	 * エラーログをファイルに出力し、エラーダイアログを表示する
	 */
	errorMain( error: Error )
	{
		this.errorLog( error );

		const message = error.message;
		const stack = error.stack;

		dialog.showErrorBox(
			{
				title: "Error",
				content: "An error has occurred.",
				detail: `${message}\n${stack}`
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
	errorLog( error: Error )
	{
		const name = error.name;
		const message = error.message;
		const stack = error.stack;

		//現在日付時刻とエラーの情報をすべてエラーログに出力する
		//YYYY-MM-DD HH:mm:ss [name] message
		const now = new Date();
		const log = `${now.toISOString()} [${name}] ${message}:${stack}\n`;

		//エラーログをファイルに出力する
		fs.appendFileSync( this.errorPath, log );
	}
}


module.exports = { ErrorWrapper };



// End of script