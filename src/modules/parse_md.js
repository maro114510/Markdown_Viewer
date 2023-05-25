// Desc: Parse markdown

const { marked } = require( 'marked' );

function parseMD( str ) {
	try
	{
		let htmlString = marked( str );
		if( htmlString === '' )
		{
			htmlString = '<p>__blank__</p>';
		}

		return htmlString;
	}
	catch( error )
	{
		throw new Error( 'Error parsing markdown', error.message );
	}
}

module.exports = { parseMD };



// End of script