export function isReadonly(editor) {
    const cm = editor.codemirror;
    const wrapper = cm.getWrapperElement();
    const preview = wrapper.lastChild;

    return /editor-preview-active/.test(preview.className);
}

/**
 * The state of CodeMirror at the given position.
 *
 * @param {CodeMirror} cm
 * @param {number} pos
 */
export function getState(cm, pos) {
    const cursor = pos || cm.getCursor('start');
    const token = cm.getTokenAt(cursor);

    if (!token.type) {
        return {};
    }

    const types = token.type.split(' ');

    const list = types.includes('variable-2');
    const orderedList = list && /^\s*\d+\.\s/.test(cm.getLine(cursor.line));

    const headings = types.filter(type => /^header(-[1-6])?$/.test(type))
        .reduce((acc, heading) => Object.assign({}, acc, { [heading.replace('header', 'heading')]: true }), {});

    return {
        bold: types.includes('strong'),
        italic: types.includes('em'),
        strikethrough: types.includes('strikethrough'),
        code: types.includes('comment'),
        link: types.includes('link'),
        image: types.includes('tag'),
        ordered_list: orderedList,
        unordered_list: list && !orderedList,
        ...headings
    };
}

export function replaceLine(line, text, cm) {
    cm.replaceRange(text, {
        line,
        ch: 0
    }, {
        line,
        ch: 99999999999999
    });
}

export function cleanBlock(editor) {
    if (editor.isReadonly) {
        return;
    }

    const cm = editor.codemirror;
    const firstLine = cm.getCursor('start').line;
    const lastLine = cm.getCursor('end').line;

    const lineNumbers = Array.from(new Array(lastLine - firstLine), (v, i) => i + firstLine);

    lineNumbers.forEach((line) => {
        const text = cm.getLine(line);
        const cleanedText = text.replace(/^[ ]*([# ]+|\*|-|[> ]+|[0-9]+(.|\)))[ ]*/, '');

        replaceLine(line, cleanedText, cm);
    });
}
