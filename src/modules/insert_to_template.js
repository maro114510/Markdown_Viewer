// Desc: Insert html string to template html

const fs = require( 'fs' );

function insertHTML( html, templatePath, outputPath )
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


module.exports = { insertHTML };



// End of script