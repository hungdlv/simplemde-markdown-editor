import {
    formatBold,
    formatItalic
} from './features';

import {
    togglePreview,
    toggleSideBySide,
    toggleFullScreen
} from './preview';

export const getKeyBindings = editor => ({
    Enter: 'newlineAndIndentContinueMarkdownList',
    Tab: 'tabAndIndentMarkdownList',
    'Shift-Tab': 'shiftTabAndUnindentMarkdownList',
    'Ctrl-B': () => formatBold(editor),
    'Ctrl-I': () => formatItalic(editor),
    'Ctrl-P': () => togglePreview(editor),
    F9: () => toggleSideBySide(editor),
    F11: () => toggleFullScreen(editor)
});
