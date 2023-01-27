Render Special Characters
=========================

This extension makes it easy to identify special characters by displaying them using the UTFx encoding standard.

## Features

![Screenshot](https://raw.githubusercontent.com/miku3920/vscode-render-special-chars/main/images/example.png)

## Extension Settings

The extension offers the following settings for customization:

* `render-special-chars.include`: An array of UTFx codes or characters that will be prominently displayed.

* `render-special-chars.except`: An array of characters specified in UTFx or as individual characters that will not be prominently displayed, regardless of whether they are included in the "include" array.

* `render-special-chars.border`: A CSS string that defines the border style for the highlighted characters.

* `render-special-chars.borderColor`: A color code for the border of highlighted characters.

* `render-special-chars.color`: A color code for the text of highlighted characters.

* `render-special-chars.backgroundColor`: A color code for the background of highlighted characters.

The text color, border color, and background color are all taken from the `editorUnicodeHighlight` theme colors by default. Specifically, the text color and border color is taken from the `editorUnicodeHighlight.border`, and the background color is taken from the `editorUnicodeHighlight.background`.

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
   "0009",       // TAB
   "000A",       // LF
   "000D",       // CR
   "0020-007E",  // Printable BASIC ASCII
   "3105-3129",  // Bopomofo (ㄅ~ㄦ)
   "4E00-9FFF",  // CJK Unified Ideographs
   "：；，、。？！〜（）〈〉《》【】「」『』" // Commonly used special characters
],
"render-special-chars.border": "1px solid; border-radius: 2px;",
"render-special-chars.borderColor": null,
"render-special-chars.color": null,
"render-special-chars.backgroundColor": null,
```
