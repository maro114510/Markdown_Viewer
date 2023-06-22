// ディレクトリ情報の例
const directory = {
	path: 'root',
	files: ['file1.txt', 'file2.txt'],
	directories: [
		{
			path: 'root/directory1',
			files: ['file3.txt'],
			directories: []
		},
		{
			path: 'root/directory2',
			files: [],
			directories: [
				{
					path: 'root/directory2/subdirectory1',
					files: ['file4.txt'],
					directories: [
						{
							path: 'root/directory2/subdirectory1/subsubdirectory1',
							files: ['file5.txt'],
							directories: []
						},
						{
							path: 'root/directory2/subdirectory1/subsubdirectory2',
							files: ['file6.txt'],
							directories: []
						}
					]
				}
			]
		}
	]
};

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
		const result = findDirectory( directory.directories[i], targetPath );
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
			let liElement = document.createElement( 'li' );
			liElement.classList.add( 'dropdown-item' );
			liElement.textContent = getBasename( file );
			liElement.classList.add( directory.path );
			selectElement.appendChild( liElement );
		});

		if( document.getElementById( parentId ) !== null && selectElement.childNodes.length > 0 )
		{
			document.getElementById( parentId ).appendChild( selectElement );
		}
	}
}

function getBasename( path )
{
	return path.replace( /^.*\//, '' );
}

initPage( directory );