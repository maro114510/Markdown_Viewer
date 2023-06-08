const folderButton = document.getElementById( 'bar_folder' );
let isOpen = false;


folderButton.addEventListener( 'click', () => {
	isOpen = !isOpen;
	const img = folderButton.querySelector( 'img' );

	if( isOpen )
	{
		// HACK: きもすぎる記述方法なんとかしてください。
		img.src = 'https://storage.googleapis.com/zenn-user-upload/4307e723311f-20230608.png';
		img.alt = 'folder_open';
		img.width = 40;
		img.style = 'margin-top: 2px;';
		//中央揃えにする
		img.style = 'vertical-align: middle;';

		changeView( 200, isOpen );
	}
	else
	{
		// HACK: 上記同様。関数として切り出すとかしてください。
		img.width = 36;
		img.src = 'https://storage.googleapis.com/zenn-user-upload/d952fdac3686-20230608.png';
		img.alt = 'folder_close';

		changeView( 0, isOpen );
	}
});

function changeView( width, isOpen )
{
	const minus_count = 60 + width;
	const main_content = document.querySelector( '.main_content' );
	main_content.width = `calc( 100% - ${minus_count}px )`;
	main_content.style = `margin-left: ${minus_count}px;`;

	const directory = document.getElementById( 'directory' );

	if( isOpen )
	{
		directory.style = 'display: block;';
	}
	else
	{
		directory.style = 'display: none;';
	}
}



// End of script