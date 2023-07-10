
const fs = require( "fs" );
const path = require( "path" );
const { getFileContent } = require( "../modules/get_file_content" );

describe( 'getFileContent', () => {
	test( 'should resolve with file content', async () => {
		// Mock the dialog object with the expected behavior
		const filePath = path.resolve( __dirname ) + '/sample_md/test.md';
		const encoding = 'utf8';
		const fileContent = returnFileContent();
		const content = await getFileContent( filePath, encoding );

		expect( content ).toBe( fileContent );
	});
});

// Helper function

function returnFileContent()
{
	const mdText = `# header1

## header2

### header3

#### header4

* list1
* list2

> quote

*italic*

**bold**

\`code\`

\`\`\`python
print("hello world")

def func():
	print("hello world")

class Class:
	def __init__(self):
		print("hello world")
\`\`\`

[link](https://google.com)

![image](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

| header1 | header2 |
| ------- | ------- |
| cell1   | cell2   |

- [ ] task1
- [x] task2
- [ ] task3
- [ ] mm
- [ ] task1
- [x] task2
- [ ] task3


> quote
> md

\`\`\`rust:main.rs
fn main() {
	println!("hello world");
}
\`\`\`

### どcけr

っh

---

<div style="page-break-after: always;"></div>

---

# header1

> quote
> quote

\`\`\`python
print("hello world")
\`\`\`

"morimori"

> quote1
> い
> い


#### mori

docker

\`\`\`dockerfile
FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \\
	curl \\
	git \\
	python3 \\
	python3-pip \\
	python3-dev \\
	python3-setuptools \\
	python3-wheel \\
	&& rm -rf /var/lib/apt/lists/*
\`\`\`

1. list1`;
	return mdText;
}