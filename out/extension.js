'use strict'

const vscode = require('vscode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let timeout = null

	/**
	 * @param {Array} array
	 */
	function createRegEx(array) {
		const numbers = new Array(10).fill(true)
		const characters = array.map(item => {
			return item.trim().split('-').map((/** @type {string} */ value) => {
				value = value.trim()
				const code = parseInt(value, 16)

				return (Number.isInteger(code) && !numbers[value]) ? String.fromCodePoint(code) : value
			}).join('-')
		}).join('')
		return new RegExp('[' + characters + ']', 'ug')
	}

	const defaultColor = new vscode.ThemeColor('editorUnicodeHighlight.border')
	const defaultBackgroundColor = new vscode.ThemeColor('editorUnicodeHighlight.background')
	const customConfiguration = vscode.workspace.getConfiguration('render-special-chars')
	const borderConfig = customConfiguration.get('border')
	const borderColor = customConfiguration.get('borderColor') || defaultColor
	const textColor = customConfiguration.get('color') || defaultColor
	const backgroundColor = customConfiguration.get('backgroundColor') || defaultBackgroundColor
	const include = createRegEx(customConfiguration.get('include'))
	const except = createRegEx(customConfiguration.get('except'))

	const decorationTypes = {}

	/**
	 * @param {String} char
	 */
	function getDecorationType(char) {
		let contentText = char.codePointAt(0).toString(16).toUpperCase()
		decorationTypes[contentText] = decorationTypes[contentText] || vscode.window.createTextEditorDecorationType({
			after: {
				contentText: contentText,
				color: textColor,
				border: borderConfig,
				borderColor: borderColor,
				backgroundColor: backgroundColor
			},
			rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
		})
		return decorationTypes[contentText]
	}

	/**
	 * @param {vscode.TextEditor} editor 
	 */
	function clearDecorations(editor) {
		Object.values(decorationTypes).forEach(decorationType => {
			editor.setDecorations(decorationType, [])
		})
	}

	/**
	 * @param {vscode.TextEditor} editor
	 * @param {{ [s: string]: any }} decorations
	 */
	function setDecorations(editor, decorations) {
		for (const [key, value] of Object.entries(decorations)) {
			editor.setDecorations(getDecorationType(key), value)
		}
	}

	/** 
	 * @param {vscode.TextEditor} editor 
	 */
	function updateDecorations(editor) {
		if (!editor) { return }

		const text = editor.document.getText()
		const decorations = {}

		let match
		while ((match = include.exec(text))) {
			if (match[0].match(except)) { continue }

			const pos = editor.document.positionAt(match.index)

			decorations[match[0]] = decorations[match[0]] || []
			decorations[match[0]].push({ range: new vscode.Range(pos, pos) })
		}
		clearDecorations(editor)
		setDecorations(editor, decorations)

		clearTimeout(timeout)
		timeout = null
	}

	/** 
	 * @param {vscode.TextEditor} editor
	 */
	function triggerUpdateDecorations(editor, throttle = false) {
		if (!throttle) {
			updateDecorations(editor)
			return
		}
		if (!timeout) {
			timeout = setTimeout(updateDecorations, 500, editor)
		}
		return
	}

	triggerUpdateDecorations(vscode.window.activeTextEditor)

	vscode.window.onDidChangeActiveTextEditor((/** @type {vscode.TextEditor} */ editor) => {
		triggerUpdateDecorations(editor)
	}, null, context.subscriptions)

	vscode.workspace.onDidChangeTextDocument((/** @type {vscode.TextDocumentChangeEvent} */ event) => {
		if (event.contentChanges.length > 0) {
			triggerUpdateDecorations(vscode.window.activeTextEditor, true)
		}
	}, null, context.subscriptions)
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
