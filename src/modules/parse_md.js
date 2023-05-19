const { marked } = require( 'marked' );

function parseMD( str ) {
	try
	{
		const htmlString = marked( str );
		if( htmlString === '' )
		{
			htmlString = '<p>__blank__</p>';
		}

		return htmlString;
	}
	catch( error )
	{
		throw new Error( error.message );
	}
}

module.exports = { parseMD };

// End of script