// DOMの読み込み完了後に実行
document.addEventListener ("DOMContentLoaded", function () {
	// .page要素を取得
	var pages = document.querySelectorAll( ".page" );
	let buffer = [];

	// 各ページに対して処理を実行
	pages.forEach( function ( page, index ) {
		// .page要素の高さを取得
		let pageHeight = page.offsetHeight;
		// .page要素内のコンテンツの高さを取得
		let contentHeight = page.scrollHeight;

		// コンテンツがページから溢れているか判定
		if( pageHeight + 1 < contentHeight )
		{
			console.log(
				"Page " + ( index + 1 ) + "のコンテンツがページから溢れています。"
			);

			let overflowingElements = Array.from( page.children ).filter( function ( child ) {
				return child.offsetTop + child.offsetHeight > pageHeight;
			});

			// 溢れた要素をバッファリングして削除
			overflowingElements.forEach( function ( element ) {
				if( element.offsetTop > pageHeight )
				{
					element.parentNode.removeChild( element );
				}
				else
				{
					// コンテンツの大きさがページ高さを下回るまで繰り返す
					while( pageHeight < contentHeight )
					{
						buffer.push( element.lastChild );
						element.lastChild.remove();
						contentHeight = page.scrollHeight;
					}
				}
			});

			// 新規ページを作成
			var newPage = document.createElement( "div" );
			newPage.classList.add( "page" );

			// バッファリングした要素を新規で追加したページに追加
			buffer.forEach( function ( element ) {
				newPage.appendChild( element );
			});

			// 作成した新規ページを現在のページの後ろに追加
			page.parentNode.insertBefore( newPage, page.nextSibling );

			// ページ番号を右下に入れる
			var pageNumber = document.createElement( "div" );
			pageNumber.classList.add( "page-number" );
			pageNumber.textContent = index + 1;
			page.appendChild( pageNumber );

			// バッファを空にする
			buffer = [];
		}
	});
});


// End of script