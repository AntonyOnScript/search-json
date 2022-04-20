const vscode = require('vscode')
const fuse = require('fuse.js')

/**
 * @param {string} desiredWord Optional
 */
function findJsonKey(desiredWord) {
	let searchInputBox = vscode.window.createInputBox()
	searchInputBox.onDidAccept(() => {
		searchInputBox.hide()
		searchWord()
		desiredWord = searchInputBox.value
	})
	searchInputBox.show()
	
	function searchWord() {
		if(searchInputBox.value) desiredWord = searchInputBox.value
		const activeEditor = vscode.window.activeTextEditor
		const editorText = activeEditor.document.getText()
		const lineAmount = getAllIndexes(editorText, '\r\n')
		let lineContentAmount = []
		
		for(let i = 0; i < lineAmount.length; i++) {
			let currentIndex = lineAmount[i]
			let nextIndex = lineAmount[1 + i]

			let slicedEditor = editorText.slice(currentIndex, nextIndex)
			lineContentAmount.push(slicedEditor.replace('\r\n', ''))
		}

		lineContentAmount = new fuse(lineContentAmount, { includeScore: true })
		let search = lineContentAmount.search(desiredWord)[0]
		desiredWordIndex = activeEditor.document.lineAt(++search.refIndex).range

		search.score === 0? activeEditor.selection = new vscode.Selection(desiredWordIndex.start, desiredWordIndex.end): null
		
		if (!activeEditor) {
			return
		}
	}
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1
    while ((i = arr.indexOf(val, i+1)) != -1) {
        indexes.push(i)
    }
    return indexes
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('search-json.helloWorld', function () {
		vscode.window.showInformationMessage('Search json has been activated, i hope you enjoy it! @AntonyOnScript')
	})

	let searchJson = vscode.commands.registerCommand('search-json.searchJson', function() {	
		findJsonKey('paçoca')
	})

	context.subscriptions.push(searchJson)
	context.subscriptions.push(disposable)
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
