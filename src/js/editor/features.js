import _flow from 'lodash/flow';
import _curry from 'lodash/curry';
import _includes from 'lodash/includes';
import _escapeRegExp from 'lodash/escapeRegExp';

import { getState, isReadonly } from '../utils/editor';

function toggleStyle(editor, style, alter) {
    if (isReadonly(editor)) {
        return;
    }

    const cm = editor.codemirror;
    const hasState = getState(cm)[style] === true;

    const cursorStart = cm.getCursor('start');
    const cursorEnd = cm.getCursor('end');

    const text = hasState
        ? cm.getLine(cursorStart.line)
        : cm.getSelection();

    const { text: alteredText, start, end } = alter(text, hasState, cursorStart, cursorEnd);

    if (hasState) {
        cm.replaceRange(alteredText, {
            line: cursorStart.line,
            ch: 0
        }, {
            line: cursorEnd.line,
            ch: 99999999999999
        });
    } else {
        cm.replaceSelection(alteredText);
    }

    cm.setSelection(start, end);
    cm.focus();
}

/**
 * @param {string} delimiter
 * @param {string} str
 */
const wrap = _curry((delimiter, str) => `${delimiter}${str}${delimiter}`);

/**
 * @param {Array} delimiters
 * @param {string} line
 * @param {number} selectionStart
 * @param {number} selectionEnd
 */
const unwrap = (delimiters, line, selectionStart, selectionEnd) => {
    const delimiterRegexp = delimiters.map(_escapeRegExp).join('|');

    const openingRegexp = new RegExp(`(${delimiterRegexp})(?![\\s\\S]*(${delimiterRegexp}))`);
    const closingRegexp = new RegExp(delimiterRegexp);

    const textBefore = line.slice(0, selectionStart);
    const textAfter = line.slice(selectionEnd);
    const text = line.slice(selectionStart, selectionEnd);

    return textBefore.replace(openingRegexp, '') + text + textAfter.replace(closingRegexp, '');
};

/**
 * @param {Array} delimiters
 * @param {string} str
 */
const removeDelimiter = _curry((delimiters, str) => {
    const regexpString = _escapeRegExp(delimiters.join('|'));
    const regexp = new RegExp(regexpString, 'g');

    return str.replace(regexp, '');
});

export function toggleBold(editor) {
    toggleStyle(editor, 'bold', (text, isBold, start, end) => {
        if (!isBold) {
            const alteredText = _flow(
                removeDelimiter(['**', '__']),
                wrap('**')
            )(text);

            return {
                text: alteredText,
                start: { ...start, ch: start.ch + 2 },
                end: { ...end, ch: end.ch + 2 }
            };
        }

        return {
            text: unwrap(['**', '__'], text, start.ch, end.ch),
            start: { ...start, ch: start.ch - 2 },
            end: { ...end, ch: end.ch - 2 }
        };
    });
}

export function toggleItalic(editor) {
    toggleStyle(editor, 'italic', (text, isItalic, start, end) => {
        if (!isItalic) {
            return {
                text: _flow(
                    removeDelimiter(['*', '_']),
                    wrap('*')
                )(text),
                start: { ...start, ch: start.ch + 1 },
                end: { ...end, ch: end.ch + 1 }
            };
        }

        return {
            text: unwrap(['*', '_'], text, start.ch, end.ch),
            start: { ...start, ch: start.ch - 1 },
            end: { ...end, ch: end.ch - 1 }
        };
    });
}

export function toggleStrikethrough(editor) {
    toggleStyle(editor, 'bold', (text, isStrikethrough, start, end) => {
        if (!isStrikethrough) {
            const alteredText = _flow(
                removeDelimiter(['~~']),
                wrap('~~')
            )(text);

            return {
                text: alteredText,
                start: { ...start, ch: start.ch + 2 },
                end: { ...end, ch: end.ch + 2 }
            };
        }

        return {
            text: unwrap(['**'], text, start.ch, end.ch),
            start: { ...start, ch: start.ch - 2 },
            end: { ...end, ch: end.ch - 2 }
        };
    });
}

// function _insertText(text, editor) {
//     if (editor.isReadonly()) {
//         return;
//     }


// }

// export function insertTable(editor) {

// }

export function insertLink(link, editor) {
    const codemirror = editor.codemirror;
    const selections = codemirror.getSelections();
    const replacements = selections.map(text => `[${text}](${link})`);

    const currentCursors = codemirror.listSelections();
    const nextCursors = currentCursors.map(range => ({
        anchor: { ...range.anchor, ch: range.anchor.ch + 1 },
        head: { ...range.head, ch: range.head.ch + 1 }
    }));

    codemirror.replaceSelections(replacements, 'start');
    codemirror.setSelections(nextCursors);
    codemirror.focus();
}

export function insertImage(link, editor) {
    const url = link;
    const cm = editor.codemirror;

    const selectionStart = cm.getCursor('from');
    const selectionEnd = cm.getCursor('to');

    const startToken = cm.getTokenAt(selectionStart);
    const endToken = cm.getTokenAt(selectionEnd);

    const cursorInUrlToken = _includes(startToken.type, 'string url')
        && _includes(endToken.type, 'string url');

    const text = cursorInUrlToken ? url : '![]($url)'.replace('$url', url);

    cm.replaceRange(text, selectionStart, selectionEnd);
    cm.focus();
}

/**
 * Undo action.
 */
export function undo(editor) {
    const cm = editor.codemirror;
    cm.undo();
    cm.focus();
}


/**
 * Redo action.
 */
export function redo(editor) {
    const cm = editor.codemirror;
    cm.redo();
    cm.focus();
}
