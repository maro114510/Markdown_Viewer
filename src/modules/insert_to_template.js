// Desc: Insert html string to template html
const fs = require( 'fs' );
const { exec } = require( 'child_process' );

function insertHTML( html )
{
	const templatePath = './html/index.html';
	const outputPath = './html/output.html';
	const template = fs.readFileSync( templatePath, 'utf8' );

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

	exec( `open ${outputPath}` );

	return newHTML;
}


module.exports = { insertHTML };


// End of script