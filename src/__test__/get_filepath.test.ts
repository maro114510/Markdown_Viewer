
const fs = require( 'fs' );
const { getFilePath } = require( '../modules/get_filepath' );

jest.mock( 'fs' );

describe( 'getFilePath', () => {
	let mockDialog: any;

	beforeEach( () => {
		mockDialog = {
			showOpenDialog: () => {
				return Promise.resolve({ canceled: false, filePaths: ['/path/to/file.md'] });
			}
		};
	});

	afterEach( () => {
		jest.restoreAllMocks();
	});

	test( 'getFilePath', async  () => {

		const filePath = await getFilePath( mockDialog );
		fs.access.mockImplementation( true );

		expect( filePath ).toBe( '/path/to/file.md' );
		expect( fs.access ).toHaveBeenCalledWith(
			"/path/to/file.md"
		);
	});

	test( 'getFilePath with invalid file extension', async () => {
		fs.access = jest.fn().mockRejectedValue(
			new Error( 'File path does not exist' )
		);
		await expect( getFilePath( mockDialog ) ).rejects.toThrow( 'File path does not exist' );
	});

	test( 'getFilePath with invalid file path', async () => {
		mockDialog.showOpenDialog = jest.fn().mockResolvedValue({ canceled: false, filePaths: ['/path/to/file.txt'] });
		await expect(
			getFilePath( mockDialog )
		).rejects.toThrow(
			'Invalid file extension. Only Markdown files are allowed.'
		);

		expect( mockDialog.showOpenDialog ).toHaveBeenCalled();
	});
});