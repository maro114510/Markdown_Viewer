let directory = null;

document.addEventListener( "DOMContentLoaded", async function () {
	directory = await window.api.sendDirectoryToRenderer( directory );

	initPage( directory );
});

function initPage( directory )
{
	let selectElement = document.createElement( 'ul' );
	createDirectoryItem( directory, selectElement );
	document.getElementById( "directory-listing" ).appendChild( selectElement );
}

function createDirectoryItem( directory, parentElement )
{
	const liElement = document.createElement( 'li' );
	const aElement = document.createElement( 'a' );
	aElement.classList.add( 'dropdown-item-dir' );
	aElement.setAttribute( 'href', 'javascript:void(0);' );
	aElement.textContent = getBasename( directory.path );
	liElement.id = directory.path;
	liElement.appendChild( aElement );
	parentElement.appendChild( liElement );

	//dropdown-item-dirが押された時のイベントを設定(dropdown-item-dirは動的に生成されるため、documentでイベントを設定)
	aElement.addEventListener( 'click', function( e ) {
		let parentId = e.target.parentNode.id;
		let childElement = findDirectory( directory, parentId );
		createDropdownChild( childElement, parentId );
	});
}


function findDirectory( directory, targetPath )
{
	if( directory.path === targetPath )
	{
		return {
			path: directory.path,
			files: directory.files,
			directories: directory.directories
		};
	}

	for( let i = 0; i < directory.directories.length; i++ )
	{
		const result = findDirectory( directory.directories[ i ], targetPath );
		if (result)
		{
			return result;
		}
	}

	return null;
}

function createDropdownChild( directory, parentId )
{
	let selectElement = document.createElement( 'ul' );
	if( directory.directories !== undefined )
	{
		directory.directories.forEach( function( subdirectory ) {
			if( document.getElementById( subdirectory.path ) !== null )
			{
				return;
			}
			createDirectoryItem( subdirectory, selectElement );
		});
	}

	if( directory.files !== undefined )
	{
		directory.files.forEach( function( file ) {
			if( document.getElementsByClassName( directory.path ).length > 0 )
			{
				return;
			}
			createFileItem( selectElement, file );
		});

		if( document.getElementById( parentId ) !== null && selectElement.childNodes.length > 0 )
		{
			document.getElementById( parentId ).appendChild( selectElement );
		}
	}
}

function createFileItem( selectElement, file )
{
	let liElement = document.createElement( 'li' );
	let aElement = document.createElement( 'a' );
	aElement.setAttribute( 'href', 'javascript:void(0);' );
	aElement.textContent = getBasename( file );
	aElement.id = file;
	liElement.appendChild( aElement );
	selectElement.appendChild( liElement );

	aElement.addEventListener( 'click', function( e ) {
		let filePath = e.target.id;
		console.log( filePath );
		window.api.sendToMain( "choose_file", filePath );
	});
}

function getBasename( path )
{
	return path.replace( /^.*\//, '' );
}



// End of script