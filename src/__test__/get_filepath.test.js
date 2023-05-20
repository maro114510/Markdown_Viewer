// Tests: src/modules/get_filepath.js

// Imports
const fs = require( 'fs' ).promises;
const { getFilePath } = require( '../modules/get_filepath' );

// 正常系

describe( 'getFilePath', () => {
	test( 'should resolve with a valid file path', async () => {
		// Mock the dialog object with the expected behavior
		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue( {
				canceled: false,
				filePaths: [ '/path/to/valid/file.md' ]
			})
		};

		const filePath = await getFilePath( dialog );
		expect( filePath ).toBe( '/path/to/valid/file.md' );
	});
});

// 異常系

describe( 'getFilePath', () => {
	test( 'should reject with an error when file path does not exist', async () => {
		// Mock the dialog object with the expected behavior
		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue({
				canceled: false,
				filePaths: [ '/path/to/nonexistent/file.md' ]
			})
		};

		fs.access = jest.fn().mockRejectedValue(new Error('File path does not exist'));

		await expect(
			getFilePath( dialog )
		).rejects.toThrowError(
			'File path does not exist'
		);
	});

	test( 'should reject with an error when file extension is invalid', async () => {
		// Mock the dialog object with the expected behavior
		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue({
				canceled: false,
				filePaths: [ '/path/to/invalid/file.txt' ]
			})
		};

		await expect(
			getFilePath( dialog )
		).rejects.toThrowError(
			'Invalid file extension. Only Markdown files are allowed.'
		);
	});

	test( 'should reject with an error when dialog is canceled', async () => {
		// Mock the dialog object with the expected behavior
		const dialog = {
			showOpenDialog: jest.fn().mockResolvedValue({
				canceled: true,
				filePaths: []
			})
		};

		await expect(
			getFilePath( dialog )
		).rejects.toThrow();
	}, 10000 );

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