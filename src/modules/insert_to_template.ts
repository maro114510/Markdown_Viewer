// Desc: Insert html string to template html

const fs = require( 'fs' );

export function insertHTML( html: string, templatePath: string, outputPath: string )
{
	const template = fs.readFileSync( templatePath, 'utf-8' );

	const pages = html.split(
		'<div style="page-break-after: always;"></div>'
	);

	const pagesHTML = pages.map( ( page ) =>
	{
		return `<div class="page">${page}</div>\n`;
	}).join( '' );

	// insert html into template
	const newHTML = template.replace(
		'<!-- HTML -->',
		pagesHTML
	);

	// write new html to file
	fs.writeFileSync( outputPath, newHTML );
}





// End of script