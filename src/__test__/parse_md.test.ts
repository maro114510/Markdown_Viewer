
import { parseMD } from '../modules/parse_md';

describe( 'parseMd', () => {
	test( 'Normal', () => {
		const md = `# Title\n\n## Subtitle`
		const expectedHTML = '<h1>Title</h1>\n<h2>Subtitle</h2>\n';

		expect( parseMD( md ) ).toBe( expectedHTML );
	});

	test( 'should return empty string if no markdown is passed', () => {
		const markdown = '';
		const expectedHTML = '<p>__blank__</p>';

		expect( parseMD( markdown ) ).toBe( expectedHTML );
	});
});