// This is real renderer process

document.addEventListener( "DOMContentLoaded", function () {
	const ExportButton = document.getElementById( 'export_button' );
	ExportButton.addEventListener( 'click', function () {
		/**
		 * @desc: Send data to main process
		 * @param: channel: string
		 * @param: data: any
		 */
		const date = new Date();
		window.api.sendToMain( 'export_pdf', date );
	});
});

window.onload = function ()
{
	main();
	addAll();
	cleanPage();
};

async function main()
{
	const MAX_PAGES = 100;
	let pages = Array.from( document.querySelectorAll( ".page" ) );
	const pageHeight = pages[ 0 ].clientHeight;
	let pageCount = 0;

	for( let index = 0; index < pages.length; index++ )
	{
		const page = pages[ index ];
		let contentHeight = page.scrollHeight;

		if( pageHeight < contentHeight )
		{
			let memo = null;
			const overHeightElements = [];
			const childrenElements = Array.from( page.children );

			childrenElements.forEach( function ( element, index ) {
				if( pageHeight <= element.offsetTop + element.offsetHeight )
				{
					if( memo === null )
					{
						memo = index;
					}
					overHeightElements.push( element );
				}
			});

			if( childrenElements[ memo ] )
			{
				overHeightElements.unshift( childrenElements[ memo - 1 ] );
			}

			overHeightElements.forEach( function ( element ) {
				element.parentNode.removeChild( element );
			});

			const newPage = document.createElement( "div" );
			newPage.classList.add( "page" );
			overHeightElements.forEach( function ( element ) {
				newPage.appendChild( element );
			});
			page.parentNode.insertBefore( newPage, page.nextSibling );

			await new Promise( function ( resolve ) {
				setTimeout( resolve, 100 );
			});
		}
		pages = Array.from( document.querySelectorAll( ".page" ) );
		pageCount++;
	}
}


function addAll()
{
	addDate();
	appPageNumbers();
	addFileName();
}

// Add page numbers to all page class elements
function appPageNumbers()
{
	const pages = document.querySelectorAll( ".page" );
	pages.forEach( function ( page, index ) {
		const pageNumber = document.createElement( "div" );
		pageNumber.classList.add( "page-number" );
		pageNumber.innerHTML = index + 1;
		page.appendChild( pageNumber );
	});
}

// Add current date and time
function addDate()
{
	const date = new Date();
	const page = document.querySelectorAll( ".page" );
	page.forEach( function ( page ) {
		const dateElement = document.createElement( "div" );
		dateElement.classList.add( "print-date" );
		dateElement.innerHTML = date.toLocaleString();
		page.insertBefore( dateElement, page.firstChild );
	});
}

function addFileName()
{
	const page = document.querySelectorAll( ".page" );
	page.forEach( function ( page ) {
		const fileName = document.createElement( "div" );
		fileName.classList.add( "file-name" );
		fileName.innerHTML = document.title;
		page.insertBefore( fileName, page.firstChild );
	});
}

function cleanPage()
{
	const pages = document.querySelectorAll( ".page" );
	pages.forEach( function ( page ) {
		if( page.clientHeight === 0 )
		{
			page.parentNode.removeChild( page );
		}
	});
}


// End of script