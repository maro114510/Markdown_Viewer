// This is real renderer process

// DOMの読み込み完了後に実行
document.addEventListener( "DOMContentLoaded", function () {
	const ExportButton = document.getElementById( 'export_button' );
	ExportButton.addEventListener( 'click', function () {
		// 以下の説明
		/**
		 * @desc: Send data to main process
		 * @param: channel: string
		 * @param: data: any
		 */
		const date = new Date();
		window.api.sendToMain( 'export_pdf', date );
	});
});

window.onload = function () {
	var buffer = [];

	let pages = document.querySelectorAll( ".page" );
	pages.forEach( function ( page, index ) {
		contentHeight = page.scrollHeight;
		pageHeight = page.clientHeight;

		//オーバーフロー時の処理
		if( pageHeight < contentHeight )
		{
			const overflowElements = getOverflowElements( page );

			overflowElements.forEach( function ( element ) {
				buffer.push( element );
				page.removeChild( element );
			});

			const newPage = document.createElement( "div" );
			newPage.classList.add( "page" );
			page.parentNode.insertBefore( newPage, page.nextSibling );

			buffer.forEach( function ( element ) {
				newPage.appendChild( element );
			});

			buffer = [];
		}
	});

	cleanPage();

	appPageNumber();
};

function getOverflowElements( page )
{
	let overfloawElements = Array.from( page.children ).filter( function ( element ) {
		return element.offsetTop + element.clientHeight > page.clientHeight;
	});
	return overfloawElements;	
}

async function cleanPage()
{
	const pages = document.querySelectorAll( ".page" );
	pages.forEach( function ( page, index ) {
		if( page.children.length === 0 )
		{
			page.parentNode.removeChild( page );
		}
	});
}

function appPageNumber()
{
	var pages = document.querySelectorAll( ".page" );
	pages.forEach( function ( page, index ) {
		var pageNumber = document.createElement( "div" );
		pageNumber.classList.add( "page-number" );
		pageNumber.innerHTML = index + 1;
		page.appendChild( pageNumber );
	});
}



// End of script