// Desc: Parse markdown

const { marked } = require( 'marked' );
const { highlight, highlightAuto } = require('highlight.js');
const { getLanguage } = require('highlight.js');

function parseMD( str )
{
	settingHighlightOption();

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
		// throw new Error( 'Error parsing markdown', error.message );
		throw new Error( error.message );
	}
}

function settingHighlightOption()
{
	marked.setOptions({
		highlight: function( code, lang ) {
			let highlightedCode;
			if( lang && getLanguage( lang ) )
			{
				highlightedCode = highlight( lang, code ).value;
			}
			else
			{
				highlightedCode = highlightAuto( code ).value;
			}

			return `<pre><code class="hljs ${lang}">${highlightedCode}</code></pre>`
		}
	});
}



module.exports = { parseMD };



// End of script