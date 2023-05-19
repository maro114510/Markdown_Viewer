const { marked } = require( 'marked' );

function parseMD( str ) {
	try
	{
		return marked( str );
	}
	catch( error )
	{
		throw new Error( error.message );
	}
}

module.exports = { parseMD };

// End of script