Render Special Characters
=========================

This extension makes it easy to identify special characters by displaying them using the UTFx encoding standard.

## Features

![Screenshot](https://raw.githubusercontent.com/miku3920/vscode-render-special-chars/main/images/example.png)

## Installation

To install this extension:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for "Render Special Characters".
4. Click Install.

## Usage

Once installed, the extension will automatically highlight special characters based on the default configuration. You can customize the settings as needed by going to the settings page.

## Extension Settings

The extension offers the following settings for customization:

* `render-special-chars.include`: An array of UTFx codes or characters that will be prominently displayed.

* `render-special-chars.except`: An array of characters specified in UTFx or as individual characters that will not be prominently displayed, regardless of whether they are included in the "include" array.

* `render-special-chars.position`: Position of the decoration relative to the character (`before` or `after`). Default is `before`.

* `render-special-chars.border`: A CSS string that defines the border style for the highlighted characters.

* `render-special-chars.borderColor`: A color code for the border of highlighted characters.

* `render-special-chars.color`: A color code for the text of highlighted characters.

* `render-special-chars.backgroundColor`: A color code for the background of highlighted characters.

* `render-special-chars.excludedSchemes`: Array of URI schemes to exclude from rendering.

* `render-special-chars.updateDelay`: Delay time in milliseconds for updating decorations.

The text color, border color, and background color are all taken from the `editorUnicodeHighlight` theme colors by default. Specifically, the text color and border color are taken from the `editorUnicodeHighlight.border`, and the background color is taken from the `editorUnicodeHighlight.background`.

The `excludedSchemes` setting allows you to specify an array of URI schemes to exclude from rendering. Common schemes include:
- `"file"`: Files on disk.
- `"untitled"`: New, unsaved files.
- `"output"`: Output panel.
- `"debug"`: Debug console.
- `"git"`: Git resources.

### Default Configuration

```json
"render-special-chars.include": [
    "0000-0008",   // Control characters (NULL to BACKSPACE)
    "000B",        // Vertical Tab
    "000C",        // Form Feed
    "000E-001F",   // Control characters (SHIFT OUT to INFORMATION SEPARATOR ONE)
    "007F-009F",   // Control characters (DELETE to APPLICATION PROGRAM COMMAND)
    "00A0-4DFF",   // Latin-1 Supplement to Hangul Compatibility Jamo
    "A000-10FFFF"  // Yi Syllables to Plane 16 (Supplementary Private Use Area-B)
],
"render-special-chars.except": [
    "0009",       // TAB
    "000A",       // LF
    "000D",       // CR
    "0020-007E",  // Printable BASIC ASCII
    "3105-3129",  // Bopomofo (ㄅ~ㄦ)
    "4E00-9FFF",  // CJK Unified Ideographs
    "：；，、。？！〜（）〈〉《》【】「」『』" // Commonly used special characters
],
"render-special-chars.position": "before",
"render-special-chars.border": "1px solid; border-radius: 2px;",
"render-special-chars.borderColor": null,
"render-special-chars.color": null,
"render-special-chars.backgroundColor": null,
"render-special-chars.excludedSchemes": ["output", "debug", "git"],
"render-special-chars.updateDelay": 500
```

## Examples

### Highlighting Specific Characters

To highlight specific characters, you can modify the `include` and `except` settings in your settings.json file:

```json
// Example 1: Include a small range and exclude some characters within that range
"render-special-chars.include": [
    "0020-007E"  // Printable BASIC ASCII
],
"render-special-chars.except": [
    "0024",  // Dollar sign ($)
    "002A"   // Asterisk (*)
]

// Example 2: Include all characters and exclude some unwanted characters
"render-special-chars.include": [
    "0000-10FFFF" // All characters
],
"render-special-chars.except": [
    "0009",       // TAB
    "000A",       // LF
    "000D",       // CR
    "0020-007E",  // Printable BASIC ASCII
    "3000",       // Full-width space (　)
    "FF01-FF5E"   // Full-width ASCII variants
]
```

Note: The `except` list only excludes characters that are within the `include` range.

### Customizing Appearance

You can customize the appearance of the highlighted characters by setting the `border`, `borderColor`, `color`, and `backgroundColor`:

```json
"render-special-chars.border": "2px dotted",
"render-special-chars.borderColor": "#FF0000",
"render-special-chars.color": "#00FF00",
"render-special-chars.backgroundColor": "#0000FF"
```

## Contributing

If you would like to contribute to this extension, please follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them with clear and concise messages.
4. Submit a pull request to the main repository.

## Reporting Issues

If you encounter any issues or have suggestions for improvements, please report them on the [GitHub Issues](https://github.com/miku3920/vscode-render-special-chars/issues) page.
