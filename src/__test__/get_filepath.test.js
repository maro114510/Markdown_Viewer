// Tests: src/modules/get_filepath.js

// Imports
const path = require( 'path' );
const fs = require( 'fs' ).promises;
const { getFilePath } = require( '../modules/get_filepath' );
const { error } = require('console');

// 正常系

describe( 'getFilePath', () => {
	
	test( 'should resolve with a valid file path', async () => {
		// Mock the dialog object with the expected behavior
		const filePath1 = path.resolve( __dirname ) + '/sample_md/test.md';

		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue( {
				canceled: false,
				filePaths: [ filePath1 ]
			})
		};

		const filePath = await getFilePath( dialog );
		expect( filePath ).toBe( filePath1 );
	});

// 異常系

	test('should reject with an error when file path does not exist', async () => {
		// Mock the dialog object with the expected behavior
		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue({
				canceled: false,
				filePaths: [ 'nonexistent/file.md' ]
			})
		};

		jest.spyOn( fs, 'access' ).mockRejectedValue( new Error( 'File path does not exist' ) );

		await expect(
			getFilePath( dialog )
		).rejects.toThrowError(
			'File path does not exist'
		);

		fs.access.mockRestore();
	});

	test( 'should reject with an error when file extension is invalid', async () => {
		// Mock the dialog object with the expected behavior
		const filePath2 = path.resolve(__dirname) + '/sample_md/test.txt';

		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue({
				canceled: false,
				filePaths: [ filePath2  ]
			})
		};

		await expect(
			getFilePath( dialog )
		).rejects.toThrowError(
			'Invalid file extension. Only Markdown files are allowed.'
		);
	});

	test( 'should reject with an error when an error occurs during the dialog process', async () => {
		// Mock the dialog object with the expected behavior
		const dialog = {
			showOpenDialog: jest.fn().mockRejectedValue( new Error( 'Dialog error' ) )
		};

		await expect(
			getFilePath( dialog )
		).rejects.toThrow(
			'Dialog error'
		);
	});
});


// End of script