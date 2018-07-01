import _assign from 'lodash/assign';
import Markdown from 'markdown-it';
import SimpleMDE from './SimpleMDE';
import CodeMirror from './codemirror/index';
import { defaultStatuses, useStatusBar } from './editor/statusbar';
import { defaultToolbar, useToolbar } from './editor/toolbar';
import { addPreviewer, addSidePreviewer } from './editor/preview';
import { getKeyBindings } from './editor/keyBindings';

const defaultRenderer = Markdown();

const defaultOptions = {
    tabSize: 4,
    autofocus: true,
    renderPreview: str => defaultRenderer.render(str)
};

/**
 * @param {Element} el
 * @param {object} options
 */
export function createEditor(el, options = {}) {
    const mergedOptions = _assign({}, defaultOptions, options);
    const editor = new SimpleMDE(mergedOptions);

    const keyBindings = getKeyBindings(editor);

    const wrapper = document.createElement('div');
    wrapper.className = 'smde-wrapper';

    const parent = el.parentNode;
    const nextSibling = el.nextSibling;

    wrapper.appendChild(el);
    parent.insertBefore(wrapper, nextSibling);

    const codemirror = CodeMirror.fromTextArea(el, {
        mode: {
            name: 'markdown'
        },
        theme: 'default',
        tabSize: mergedOptions.tabSize,
        indentUnit: mergedOptions.tabSize,
        indentWithTabs: false,
        extraKeys: keyBindings,
        lineNumbers: false,
        autofocus: mergedOptions.autofocus,
        lineWrapping: true,
        placeholder: mergedOptions.placeholder || el.getAttribute('placeholder') || '',
        allowDropFileTypes: ['text/plain']
    });

    window.cm = codemirror;

    if (mergedOptions.forceSync === true) {
        codemirror.on('change', codemirror.save);
    }

    editor.el = wrapper;
    editor.textarea = el;
    editor.codemirror = codemirror;
    useStatusBar(defaultStatuses, editor);
    useToolbar(defaultToolbar, editor);
    addPreviewer(editor);
    addSidePreviewer(editor);
}
