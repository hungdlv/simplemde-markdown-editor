import { wordCount } from '../utils/misc';

const words = {
    name: 'words',
    defaultValue: editor => wordCount(editor.value()),
    onUpdate: editor => wordCount(editor.value())
};

const lines = {
    name: 'lines',
    defaultValue: editor => editor.codemirror.lineCount(),
    onUpdate: editor => editor.codemirror.lineCount()
};

const cursor = {
    name: 'cursor',
    defaultValue: () => '0:0',
    onUpdate: (editor) => {
        const pos = editor.codemirror.getCursor();
        return `${pos.line}:${pos.ch}`;
    }
};

export const defaultStatuses = [words, lines, cursor];

/**
 * @param {Array} items
 * @param {SimpleMDE} editor
 */
export function useStatusBar(items, editor) {
    // Create element for the status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'editor-statusbar';

    // Create status bar items
    const spans = items.map((item) => {
        const el = document.createElement('span');
        el.className = item.name;

        if (typeof item.defaultValue === 'function') {
            el.innerHTML = item.defaultValue(editor);
        }

        if (typeof item.onUpdate === 'function') {
            editor.codemirror.on('update', () => {
                el.innerHTML = item.onUpdate(editor);
            });
        }

        return el;
    });

    // Append items to status bar
    spans.forEach((span) => {
        statusBar.appendChild(span);
    });

    // Insert status bar
    const cmWrapper = editor.codemirror.getWrapperElement();
    cmWrapper.parentNode.insertBefore(statusBar, cmWrapper.nextSibling);
}
