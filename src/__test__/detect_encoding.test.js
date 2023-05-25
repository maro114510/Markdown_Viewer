// Desc: Test for detect_encoding.js

// Imports
const fs = require( 'fs' );
const path = require( 'path' );
const { getFileEncoding } = require( '../modules/detect_encoding' );

describe( 'getFileEncoding', () => {
	const filePath = path.resolve( __dirname ) + '/sample_md/test.md';

	// 正常系
	test( 'should resolve with file encoding', async () => {
		// Mock the dialog object with the expected behavior
		const testData = 'test';
		const testEncoding = 'utf8';

		jest.spyOn( fs, 'readFile' ).mockImplementation( ( filePath, callback ) => {
			callback( null, testData );
		});

		fs.readFile.mockRestore();
	});

	// 異常系
	test( 'should reject with an error when file path does not exist', async () => {
		// Mock the dialog object with the expected behavior
		jest.spyOn( fs, 'readFile' ).mockImplementation( ( filePath, callback) => {
			// ファイルが読み込めなかったと仮定してエラーを渡す
			callback( new Error( 'File path does not exist' ), null );
		});

		await expect(
			getFileEncoding( filePath )
		).rejects.toThrowError(
			'File path does not exist'
		);

		fs.readFile.mockRestore();
	});
});


// End of script