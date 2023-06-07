// Desc: Test error module

//Import

const fs = require( "fs" );
const { dialog } = require( "electron" );
const { ErrorWrapper } = require( "../modules/error" );

//Mock

jest.mock( "fs" );

//ダイアログを表示する関数をモックする
jest.mock( "electron", () => ( {
	dialog: {
		showErrorBox: jest.fn()
	}
}));

//Test
describe( "ErrorWrapper", () => {
	let originalDate;

	beforeEach(() => {
		originalDate = Date;
		global.Date = jest.fn(() => new originalDate(
			'2023-06-06T00:00:00.000Z'
		));
		global.Date.toISOString = originalDate.prototype.toISOString;
	});

	afterEach(() => {
	global.Date = originalDate;
	});

	describe( "errorMain", () =>
		test( "should call dialog.showErrorBox", async () => {
			const error = new ErrorWrapper();
			error.name = "Error";
			error.message = "message";
			error.detail = "detail";
			error.fileName = "fileName";
			const mockShowErrorBox = jest.fn();
			dialog.showErrorBox = mockShowErrorBox;

			error.errorMain( error );

			expect( mockShowErrorBox ).toHaveBeenCalledWith(
				{
					title: "Error",
					content: "An error has occurred.",
					detail: "message\ndetail"
				}
			);
		})
	),

	describe( "errorLog", () =>
		test( "should call fs.appendFileSync", async () => {
			const error = new ErrorWrapper();
			error.name = "Error";
			error.message = "message";
			error.detail = "detail";
			error.fileName = "fileName";

			//fs.appendFileSyncをモック
			const mockAppendFileSync = jest.fn();
			fs.appendFileSync = mockAppendFileSync;

			error.errorLog( error );

			expect( mockAppendFileSync ).toHaveBeenCalledWith(
				"../log/error.log",
				"2023-06-06T00:00:00.000Z [Error] message:detail:fileName"
			);

			//モックを元に戻す;
			fs.appendFileSync.mockRestore();
		})
	)
});


// End of script