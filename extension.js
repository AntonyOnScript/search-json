const vscode = require('vscode')
const fuse = require('fuse.js')
const breakLineRegex = /\r?\n|\r/g

String.prototype.reIndexOf = function (rx) {
	var match = rx.exec(this);
	if (match) {
		return match.index
	}

	return -1
}

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
		const lineAmount = getAllIndexes(editorText, breakLineRegex)
		let lineContentAmount = []
		
		for(let i = 0; i < lineAmount.length; i++) {
			let currentIndex = lineAmount[i]
			let nextIndex = lineAmount[1 + i]

			let slicedEditor = editorText.slice(currentIndex, nextIndex)
			lineContentAmount.push(slicedEditor.replace(breakLineRegex, ''))
		}

		lineContentAmount = new fuse(lineContentAmount, { includeScore: true })
		let search = lineContentAmount.search(desiredWord)
		desiredWordIndex = activeEditor.document.lineAt(++search[0].refIndex).range
		console.log(search)
		activeEditor.selection = new vscode.Selection(desiredWordIndex.start, desiredWordIndex.end)
		
		if (!activeEditor) {
			return
		}
	}
}

function getAllIndexes(str, val) {
    let indexes = [] 
	let i = -1
    while ((i = str.reIndexOf(val)) != -1) {
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
