// Desc: Test for parse_md.js

// Imports
const { parseMD } = require( '../modules/parse_md' );
const { marked } = require( 'marked' );

// Mock the marked object
jest.mock( 'marked' );

describe( 'parseMd', () => {
	// 正常系
	test( 'should resolve with html string', async () => {
		// Mock the marked object with the expected behavior
		const markdown = '# Heading\n\nSome **bold** and *italic* text.';

		marked.mockReturnValue(
			'<h1>Heading</h1>\n<p>Some <strong>bold</strong> and <em>italic</em> text.</p>'
		);

		const htmlString = parseMD( markdown );

		expect( htmlString ).toBe(
			'<h1>Heading</h1>\n<p>Some <strong>bold</strong> and <em>italic</em> text.</p>'
		);

		marked.mockRestore();
	});

	test( 'should resolve with html string when markdown is empty', async () => {
		// Mock the marked object with the expected behavior
		const markdown = '';

		marked.mockReturnValue(
			''
		);

		const htmlString = parseMD( markdown );

		expect( htmlString ).toBe(
			'<p>__blank__</p>'
		);

		marked.mockRestore();
	});

	// 異常系
	test( 'should reject with an error when markdown is invalid', async () => {
		// Mock the marked object with the expected behavior
		const markdown = '# Heading\n\nSome **bold** and *italic* text.';

		marked.mockImplementation( () => {
			throw new Error( 'Error parsing markdown' );
		});

		expect( () => {
			parseMD( markdown );
		}).toThrow( 'Error parsing markdown' );

		marked.mockRestore();
	});
});



// End of file