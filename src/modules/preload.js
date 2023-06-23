// Desc: preload.js

const { contextBridge, ipcRenderer } = require( 'electron' );

contextBridge.exposeInMainWorld(
	"api", {
		/**
		 * @desc: Send data to main process
		 * @param: channel: string
		 * @param: data: any
		 * @return: void
		 * @example: api.sendToMain( "channel", data );
		 */
		sendToMain: ( channel, data ) => {
			ipcRenderer.send( channel, data );
		},
		sendDirectoryToRenderer: async ( directory ) => {
			const result = await ipcRenderer.invoke( "get_directory", directory );
			return result;
		}
	}
);



// End of script