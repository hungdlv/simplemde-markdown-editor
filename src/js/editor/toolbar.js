import {
    formatBold,
    formatItalic,
    formatStrikethrough,
    formatCode,
    formatBlockquote,
    formatMath,
    insertTable,
    undo,
    redo
} from './features';

import {
    togglePreview,
    toggleSideBySide,
    toggleFullScreen
} from './preview';

import { functionKeys } from '../utils/browser';

export const defaultToolbar = [
    {
        name: 'bold',
        action: formatBold,
        icon: 'fa fa-bold',
        title: 'Bold',
        shortcut: 'Ctrl-B'
    },
    {
        name: 'italic',
        action: formatItalic,
        icon: 'fa fa-italic',
        title: 'Italic',
        shortcut: 'Ctrl-I'
    },
    {
        name: 'strikethrough',
        action: formatStrikethrough,
        icon: 'fa fa-strikethrough',
        title: 'Strikethrough'
    },
    // {
    //     name: 'heading',
    //     action: toggleHeadingSmaller,
    //     icon: 'fa fa-header',
    //     title: 'Heading'
    // },
    // {
    //     name: 'heading-smaller',
    //     action: toggleHeadingSmaller,
    //     icon: 'fa fa-header fa-header-x fa-header-smaller',
    //     title: 'Smaller Heading'
    // },
    // {
    //     name: 'heading-bigger',
    //     action: toggleHeadingBigger,
    //     icon: 'fa fa-header fa-header-x fa-header-bigger',
    //     title: 'Bigger Heading'
    // },
    // {
    //     name: 'heading-1',
    //     action: toggleHeading1,
    //     icon: 'fa fa-header fa-header-x fa-header-1',
    //     title: 'Big Heading'
    // },
    // {
    //     name: 'heading-2',
    //     action: toggleHeading2,
    //     icon: 'fa fa-header fa-header-x fa-header-2',
    //     title: 'Medium Heading'
    // },
    // {
    //     name: 'heading-3',
    //     action: toggleHeading3,
    //     icon: 'fa fa-header fa-header-x fa-header-3',
    //     title: 'Small Heading'
    // },
    // {
    //     name: 'separator'
    // },
    'separator',
    {
        name: 'code',
        action: formatCode,
        icon: 'fa fa-code',
        title: 'Code'
    },
    {
        name: 'quote',
        action: formatBlockquote,
        icon: 'fa fa-quote-left',
        title: 'Quote'
    },
    {
        name: 'math',
        action: formatMath,
        icon: 'fa fa-calculator',
        title: 'Math formula'
    },
    // {
    //     name: 'unordered-list',
    //     action: toggleUnorderedList,
    //     icon: 'fa fa-list-ul',
    //     title: 'Generic List'
    // },
    // {
    //     name: 'ordered-list',
    //     action: toggleOrderedList,
    //     icon: 'fa fa-list-ol',
    //     title: 'Numbered List'
    // },
    // {
    //     name: 'separator'
    // },
    // {
    //     name: 'link',
    //     action: drawLink,
    //     icon: 'fa fa-link',
    //     title: 'Create Link'
    // },
    // {
    //     name: 'image',
    //     action: drawImage,
    //     icon: 'fa fa-picture-o',
    //     title: 'Insert Image'
    // },
    {
        name: 'table',
        action: insertTable,
        icon: 'fa fa-table',
        title: 'Insert Table'
    },
    // {
    //     name: 'horizontal-rule',
    //     action: drawHorizontalRule,
    //     icon: 'fa fa-minus',
    //     title: 'Insert Horizontal Line'
    // },
    'separator',
    {
        name: 'preview',
        action: togglePreview,
        icon: 'fa fa-eye no-disable',
        title: 'Toggle Preview'
    },
    {
        name: 'side-by-side',
        action: toggleSideBySide,
        icon: 'fa fa-columns no-disable no-mobile',
        title: 'Toggle Side by Side'
    },
    {
        name: 'fullscreen',
        action: toggleFullScreen,
        icon: 'fa fa-arrows-alt no-disable no-mobile',
        title: 'Toggle Fullscreen'
    },
    'separator',
    {
        name: 'undo',
        action: undo,
        icon: 'fa fa-undo no-disable',
        title: 'Undo'
    },
    {
        name: 'redo',
        action: redo,
        icon: 'fa fa-repeat no-disable',
        title: 'Redo'
    }
];

const createSeparator = () => {
    const el = document.createElement('i');
    el.className = 'separator';
    el.innerHTML = '|';
    return el;
};

function createToolbarButton(options, editor) {
    const button = document.createElement('button');

    const shortcutText = options.shortcut
        ? options.shortcut
            .replace('Ctrl', functionKeys.Ctrl)
            .replace('Alt', functionKeys.Alt)
        : null;

    const tooltip = shortcutText
        ? `${options.title} (${shortcutText})`
        : options.title;

    button.className = 'editor-toolbar__button';
    button.title = tooltip;
    button.tabIndex = -1;

    const icon = document.createElement('i');
    icon.className = options.icon;

    button.appendChild(icon);

    if (typeof options.action === 'function') {
        button.addEventListener('click', () => options.action(editor, button));
    }

    return button;
}

/**
 * @param {Array} items
 * @param {SimpleMDE} editor
 */
export function useToolbar(items, editor) {
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';

    const els = items.map((item) => {
        if (item === 'separator') {
            return createSeparator();
        }

        return createToolbarButton(item, editor);
    });

    els.forEach(toolbar.appendChild.bind(toolbar));

    // Insert status bar
    const cmWrapper = editor.codemirror.getWrapperElement();
    cmWrapper.parentNode.insertBefore(toolbar, cmWrapper);

    editor.toolbar = toolbar;
}
