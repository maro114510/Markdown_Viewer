const folderButton = document.getElementById( 'bar_folder' );
let isOpen = false;


folderButton.addEventListener( 'click', () => {
	isOpen = !isOpen;
	//子要素のimgを取得する
	const img = folderButton.querySelector( 'img' );

	//imgのsrcを変更する
	if( isOpen )
	{
		// HACK: きもすぎる記述方法なんとかしてください。
		img.src = 'https://storage.googleapis.com/zenn-user-upload/4307e723311f-20230608.png';
		img.alt = 'folder_open';
		img.width = 40;
		img.style = 'margin-top: 2px;';
		//中央揃えにする
		img.style = 'vertical-align: middle;';

		openFolder();
	}
	else
	{
		// HACK: 上記同様。関数として切り出すとかしてください。
		img.width = 36;
		img.src = 'https://storage.googleapis.com/zenn-user-upload/d952fdac3686-20230608.png';
		img.alt = 'folder_close';

		closeFolder();
	}
});

function openFolder()
{
	//HACK:ハードコードもやめてほしい
	const main_content = document.querySelector( '.main_content' );
	main_content.width = `calc( 100% - 200px )`;
	//margin_left = 260px;にする
	main_content.style = 'margin-left: 260px;';
	
	const directory = document.getElementById( 'directory' );
	directory.style = 'display: block;';
}

function closeFolder()
{
	//HACK:ハードコードもやめてほしい
	const main_content = document.querySelector( '.main_content' );
	main_content.width = `calc( 100% - 60px )`;
	main_content.style = 'margin-left: 60px;';

	const directory = document.getElementById( 'directory' );
	directory.style = 'display: none;';
}