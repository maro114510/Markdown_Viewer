
const fs = require( "fs" );
const { dialog } = require( "electron" );
const { ErrorWrapper } = require( "../modules/error" );

jest.mock( "fs" );

jest.mock( "electron", () => ({
	dialog: {
		showMessageBox: jest.fn( () => {} ),
		showErrorBox: jest.fn( () => {} )
	}
}));

class MockDate extends Date
{
	constructor()
	{
		super( "2023-06-06T00:00:00.000Z" );
	}
}

describe( 'error', () => {
	let originalDate: typeof Date;

	beforeEach(() => {
		originalDate = global.Date;
		global.Date = MockDate as any;
	});

	afterEach(() => {
		global.Date = originalDate;
	});

	describe( 'errorMain', () => {
		it( 'should return the encoding of the file', async () => {
			const error = new ErrorWrapper( "/path/to/error/error.log" );
			error.message = "message";
			error.stack = "detail";

			error.errorMain( error );

			expect( dialog.showErrorBox ).toHaveBeenCalledWith(
				"message",
				"detail",
			);
		});
	});

	describe( "errorLog", () =>
		test(" should call fs.appendFileSync", async () => {
			const logFilePath = "/path/to/log/error.log";
			const error = new ErrorWrapper( logFilePath );
			error.name = "Error";
			error.message = "message";
			error.stack = "detail";

			const mockAppendFileSync = jest.fn();
			fs.appendFileSync = mockAppendFileSync;

			error.errorLog( error );

			expect( mockAppendFileSync ).toHaveBeenCalledWith(
				logFilePath,
				"2023-06-06T00:00:00.000Z [Error] message:detail\n"
			);

			fs.appendFileSync.mockRestore();
		})
	);
});