'use strict'

const vscode = require('vscode')

/**
 * This method is called when this extension is activated.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  /**
   * Configuration management and update functions
   */

  /**
   * Create a regular expression from an array of character ranges.
   * @param {Array} charRanges
   * @returns {RegExp}
   */
  function createRegEx(charRanges) {
    const numbers = new Array(10).fill(true)

    const characters = charRanges.map((range) => {
      return range.trim().split('-').map((/** @type {string} */ value) => {
        const trimmedValue = value.trim()
        const code = parseInt(trimmedValue, 16)

        // Convert to character if it's a valid hexadecimal and not a number 0-9
        return (Number.isInteger(code) && !numbers[trimmedValue])
          ? String.fromCodePoint(code)
          : trimmedValue
      }).join('-')
    }).join('')

    return new RegExp(`[${characters}]`, 'ug')
  }

  // Default theme colors
  const defaultBorderColor = new vscode.ThemeColor('editorUnicodeHighlight.border')
  const defaultBackgroundColor = new vscode.ThemeColor('editorUnicodeHighlight.background')

  // Variables for custom configuration settings
  let customConfig, includeRegex, exceptRegex, offset, position, borderConfig,
    borderColor, textColor, backgroundColor, excludedSchemes, updateDelay

  // Store decoration types
  let decorationTypes = {}

  /**
   * Update the configuration settings.
   */
  function updateConfig() {
    customConfig = vscode.workspace.getConfiguration('render-special-chars')

    includeRegex = createRegEx(customConfig.get('include'))
    exceptRegex = createRegEx(customConfig.get('except'))

    offset = customConfig.get('position') === 'after' ? 1 : 0
    position = offset ? 'before' : 'after'

    borderConfig = customConfig.get('border')
    borderColor = customConfig.get('borderColor') || defaultBorderColor
    textColor = customConfig.get('color') || defaultBorderColor
    backgroundColor = customConfig.get('backgroundColor') || defaultBackgroundColor

    excludedSchemes = customConfig.get('excludedSchemes')
    updateDelay = customConfig.get('updateDelay')

    decorationTypes = {}
  }

  // Initial configuration update
  updateConfig()

  // Listen for configuration changes
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('render-special-chars')) {
      updateConfig()
    }
  }, null, context.subscriptions)

  /**
   * Decoration management functions
   */

  /**
   * Get or create a decoration type for a specific character.
   * @param {String} char
   * @returns {vscode.TextEditorDecorationType}
   */
  function getDecorationType(char) {
    const unicodeCode = char.codePointAt(0).toString(16).toUpperCase()

    if (!decorationTypes[unicodeCode]) {
      decorationTypes[unicodeCode] = vscode.window.createTextEditorDecorationType({
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        [position]: {
          contentText: unicodeCode,
          color: textColor,
          border: borderConfig,
          borderColor,
          backgroundColor,
        },
      })
    }

    return decorationTypes[unicodeCode]
  }

  /**
   * Clear all decorations in the editor.
   * @param {vscode.TextEditor} editor
   */
  function clearDecorations(editor) {
    Object.values(decorationTypes).forEach((decorationType) => {
      editor.setDecorations(decorationType, [])
    })
  }

  /**
   * Set decorations in the editor.
   * @param {vscode.TextEditor} editor
   * @param {{ [s: string]: any }} decorations
   */
  function setDecorations(editor, decorations) {
    Object.entries(decorations).forEach(([char, ranges]) => {
      editor.setDecorations(getDecorationType(char), ranges)
    })
  }

  /**
   * Update decorations in the editor.
   * @param {vscode.TextEditor} editor
   */
  function updateDecorations(editor) {
    if (!editor || excludedSchemes.includes(editor.document.uri.scheme)) {
      return
    }

    const text = editor.document.getText()
    const decorations = {}

    let match
    while ((match = includeRegex.exec(text))) {
      if (match[0].match(exceptRegex)) { continue }

      const pos = editor.document.positionAt(match.index + offset)

      decorations[match[0]] = decorations[match[0]] || []
      decorations[match[0]].push({ range: new vscode.Range(pos, pos) })
    }

    clearDecorations(editor)
    setDecorations(editor, decorations)
  }

  let updateTimeout = null

  /**
   * Trigger decoration updates with optional throttling.
   * @param {vscode.TextEditor} editor
   * @param {boolean} throttle
   */
  function triggerUpdateDecorations(editor, throttle = false) {
    const update = () => {
      updateDecorations(editor)
      clearTimeout(updateTimeout)
      updateTimeout = null
    }

    if (!throttle) {
      update()
      return
    }

    if (!updateTimeout) {
      updateTimeout = setTimeout(update, updateDelay)
    }
  }

  // Initialize decorations on activation
  triggerUpdateDecorations(vscode.window.activeTextEditor)

  // Listen for active text editor changes
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    triggerUpdateDecorations(editor)
  }, null, context.subscriptions)

  // Listen for document changes
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.contentChanges.length > 0) {
      triggerUpdateDecorations(vscode.window.activeTextEditor, true)
    }
  }, null, context.subscriptions)
}

/**
 * This method is called when this extension is deactivated.
 */
function deactivate() { }

module.exports = {
  activate,
  deactivate,
}
