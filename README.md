Render Special Characters
=========================

This extension shows any characters with UTFx. 

## Features

![Screenshot](https://raw.githubusercontent.com/miku3920/vscode-render-special-chars/main/images/example.png)

## Extension Settings

This extension contributes the following settings:

* `render-special-chars.include`: Array of UTFx or character. This characters will be shown.

* `render-special-chars.except`: Array of UTFx or character. Characters will be shown with "include" except "except".

* `render-special-chars.border`: CSS string.

* `render-special-chars.borderColor`: HTML color code.

* `render-special-chars.color`: HTML color code.

* `render-special-chars.backgroundColor`: HTML color code.

Color is taken from `editorUnicodeHighlight.border` theme color.
BackgroundColor is taken from `editorUnicodeHighlight.background` theme color.

### Default Configuration

```json
"render-special-chars.include": [
   "0000-0008",
   "000B",
   "000C",
   "000E-001F",
   "007F-009F",
   "00A0-4DFF",
   "A000-10FFFF"
],
"render-special-chars.except": [
   "000A",
   "000D",
   "0020-007E",
   "4E00-9FFF"
],
"render-special-chars.border": "1px solid; border-radius: 2px;",
"render-special-chars.borderColor": null,
"render-special-chars.color": null,
"render-special-chars.backgroundColor": null,
```
