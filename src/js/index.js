import md from 'markdown-it';
import SimpleMDE from './SimpleMDE';
import CodeMirror from './codemirror/index';
import { defaultStatuses, useStatusBar } from './editor/statusbar';
import { defaultToolbar, useToolbar } from './editor/toolbar';
import { getKeyBindings } from './editor/keyBindings';

const defaultOptions = {
    previewRenderer: md
}

/**
 * @param {Element} el
 * @param {object} options
 */
export function createEditor(el, options = {}) {
    const editor = new SimpleMDE(options);

    const keyBindings = getKeyBindings(editor);

    const codemirror = CodeMirror.fromTextArea(el, {
        mode: {
            name: 'gfm',
            tokenTypeOverrides: {
                emoji: 'emoji'
            }
        },
        theme: 'default',
        tabSize: options.tabSize || 4,
        indentUnit: options.tabSize || 4,
        indentWithTabs: false,
        extraKeys: keyBindings,
        lineNumbers: false,
        autofocus: options.autofocus || true,
        lineWrapping: true,
        placeholder: options.placeholder || el.getAttribute('placeholder') || '',
        allowDropFileTypes: ['text/plain']
    });

    if (options.forceSync === true) {
        codemirror.on('change', codemirror.save);
    }

    editor.element = el;
    editor.codemirror = codemirror;
    useStatusBar(defaultStatuses, editor);
    useToolbar(defaultToolbar, editor);
}
