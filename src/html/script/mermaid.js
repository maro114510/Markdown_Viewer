document.addEventListener( 'DOMContentLoaded', async () => {
	mermaid.initialize({
		securityLevel: 'antiscript',
		startOnLoad: false,
		theme: 'github',
	});

	await mermaid.run({
		querySelector: '.mermaid',
		suppressWarnings: true,
		suppressErrors: true,
	});
});


// End of script