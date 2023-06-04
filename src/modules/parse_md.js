// Desc: Parse markdown

const { marked } = require( 'marked' );
const { highlight, highlightAuto } = require( 'highlight.js' );
const { getLanguage } = require( 'highlight.js' );

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
		throw new Error(
			`Failed to parse markdown.\n${error.message}`
		)
	}
}

function settingHighlightOption()
{
	// highlight.jsが対応する言語を確認
	// 対応する言語があればそのハイライト、そうでなければデフォルトにハイライトを使用
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
		},
		mangle: false,
		headerIds: false
	});
}



module.exports = { parseMD };



// End of script