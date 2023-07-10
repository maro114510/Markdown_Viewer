
const fs = require('fs');
const { getFileContent } = require( '../modules/get_file_content' );

describe( 'detectEncoding', () => {
	describe( 'Normal', () => {
		it( 'should return the encoding of the file', async () => {
			const file = "path/to/file.txt";
			const encoding = "utf8";
			const expectedContent = "File content";

			fs.readFile = jest.fn((path, options, callback) => {
				callback(null, expectedContent);
			});

			const result = await getFileContent( file, encoding );

			expect( result ).toBe( expectedContent );
			expect( fs.readFile ).toHaveBeenCalledWith( file, encoding, expect.any( Function ) );
		});

		it( 'should return the encoding of the file', async () => {
			const file = "path/to/file.txt";
			const encoding = "utf8";
			const  expectedError = new Error( "File not found" );

			fs.readFile = jest.fn((path, options, callback) => {
				callback( expectedError, null );
			});

			await expect( getFileContent( file, encoding ) ).rejects.toThrow( expectedError );
			expect( fs.readFile ).toHaveBeenCalledWith( file, encoding, expect.any( Function ) );
		});
	});

	describe( 'Error', () => {
		it( 'should return the encoding of the file', async () => {
			const file = "path/to/file.txt";
			const encoding = "utf8";

			await expect( getFileContent( file, encoding ) ).rejects.toThrow( "File not found" );

		});
	});
});



// End of script