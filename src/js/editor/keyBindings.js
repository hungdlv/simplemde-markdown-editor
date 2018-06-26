import {
    toggleBold,
    toggleItalic
} from './features';

export const getKeyBindings = editor => ({
    Enter: 'newlineAndIndentContinueMarkdownList',
    Tab: 'tabAndIndentMarkdownList',
    'Shift-Tab': 'shiftTabAndUnindentMarkdownList',
    'Ctrl-B': toggleBold.bind(null, editor),
    'Ctrl-I': toggleItalic.bind(null, editor)
});
