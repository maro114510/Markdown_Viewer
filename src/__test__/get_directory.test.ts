
const fs = require('fs');
const { getDirectory } = require('../modules/get_directory');

// Mock the fs module
jest.mock('fs');

describe('getDirectory', () => {
	test('returns the directory object', () => {
		// Mock the showOpenDialogSync function to return a directory path
		const dialogMock = {
			showOpenDialogSync: jest.fn().mockReturnValue(['/path/to/directory']),
		};

		// Mock the readdirSync function to return an array of files
		fs.readdirSync.mockReturnValue( [ 'file1.md', 'file2.md', 'file3.txt' ] );
		fs.statSync.mockReturnValue( { isDirectory: () => false } );
		fs.statSync.mockReturnValue( { isDirectory: () => false } );
		fs.statSync.mockReturnValue( { isDirectory: () => false } );

		const directory = getDirectory(dialogMock);

		// Verify that showOpenDialogSync was called
		expect( dialogMock.showOpenDialogSync ).toHaveBeenCalledWith({
			properties: [ 'openDirectory' ],
		});

		// Verify that readdirSync was called with the correct directory path
		expect( fs.readdirSync ).toHaveBeenCalledWith( '/path/to/directory' );

		// Verify the directory object returned by readDirectoryRecursively
		expect( directory ).toEqual({
			path: '/path/to/directory',
			files: [ '/path/to/directory/file1.md', '/path/to/directory/file2.md' ],
			directories: [],
		});
	});

	test( 'returns an empty directory object if no files are found', () => {
		const dialogMock = {
			showOpenDialogSync: jest.fn().mockReturnValue( [ '/path/to/empty-directory' ] ),
		};

		// Mock the readdirSync function to return an empty array
		fs.readdirSync.mockReturnValue( [] );

		const directory = getDirectory( dialogMock );

		// Verify the directory object returned by readDirectoryRecursively
		expect( directory ).toEqual({
			path: '/path/to/empty-directory',
			files: [],
			directories: [],
		});
	});
});
