// Desc: Wrapper of Error class
//@ts-check
'use strict';

const fs = require( 'fs' );
const { dialog } = require( 'electron' );

class ErrorWrapper extends Error
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
			message,
			stack,
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


export { ErrorWrapper };



// End of script