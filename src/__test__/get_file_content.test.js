// Desc: Test for get_file_content.js

// Imports
const fs = require( 'fs' );
const path = require( 'path' );
const { getFileContent } = require( '../modules/get_file_content' );


jest.mock( 'fs' );

describe( 'getFileContent', () => {
	test( 'should resolve with file content', async () => {
		// Mock the dialog object with the expected behavior
		const filePath = path.resolve( __dirname ) + '/sample_md/test.md';
		const encoding = 'utf8';
		const fileContent = returnFileContent();

		jest.spyOn( fs, 'readFile' ).mockImplementation( ( filePath, encoding, callback ) => {
			expect( filePath ).toBe( filePath );
			expect( encoding ).toBe( encoding );
			callback( null, fileContent );
		});

		const content = await getFileContent( filePath, encoding );

		expect( content ).toBe( fileContent );

		fs.readFile.mockRestore();
	});

	// 異常系
	test( 'should reject with an error when file path does not exist', async () => {
		// Mock the dialog object with the expected behavior
		const filePath = path.resolve( __dirname ) + '/sample_md/test.md';
		const encoding = 'utf8';

		jest.spyOn( fs, 'readFile' ).mockImplementation( ( filePath, encoding, callback ) => {
			expect( filePath ).toBe( filePath );
			expect( encoding ).toBe( encoding );
			callback( new Error( 'File path does not exist' ), null );
		});

		await expect(
			getFileContent( filePath, encoding )
		).rejects.toThrowError(
			'File path does not exist'
		);

		fs.readFile.mockRestore();
	});
});


// Helper function

function returnFileContent()
{
	const mdText = `
# header1

## header2

### header3

#### header4

* list1
	* list2

	> quote

	*italic*

	**bold**

	\`code\`

	\`\`\`python
	print("hello world")
	\`\`\`

	[link](https://google.com)

	![image](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

| header1 | header2 |
| ------- | ------- |
| cell1   | cell2   |

	- [ ] task1
	- [x] task2
	- [ ] task3

---

`;
	return mdText;
}



// End of File