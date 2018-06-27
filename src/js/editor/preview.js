let originalBodyOverflow = '';

function liveEditActive(editor) {
    return editor.el.classList.contains('smde--live-edit');
}

function fullscreenActive(editor) {
    return editor.codemirror.getOption('fullScreen');
}

function fullScreenOff(editor) {
    const cm = editor.codemirror;

    if (liveEditActive(editor)) {
        liveEditOff(editor);
    }

    cm.setOption('fullScreen', false);

    editor.el.classList.remove('smde--fullscreen');
    if (editor.toolbar) {
        editor.toolbar.classList.remove('fullscreen');
    }

    document.body.style.overflow = originalBodyOverflow;
}

function fullScreenOn(editor) {
    const cm = editor.codemirror;

    cm.setOption('fullScreen', true);

    editor.el.classList.add('smde--fullscreen');
    if (editor.toolbar) {
        editor.toolbar.classList.add('fullscreen');
    }

    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
}

function liveEditOn(editor) {
    const cm = editor.codemirror;
    const previewer = editor.sidePreviewer;

    if (!fullscreenActive(editor)) {
        fullScreenOn(editor);
    }

    editor.el.classList.add('smde--live-edit');
    previewer.classList.add('editor-preview-active-side');
    cm.getWrapperElement().classList.add('CodeMirror-sided');

    editor.__syncPreview();
    cm.on('update', editor.__syncPreview);
}

function liveEditOff(editor) {
    const cm = editor.codemirror;
    const previewer = editor.sidePreviewer;

    editor.el.classList.remove('smde--live-edit');
    previewer.classList.remove('editor-preview-active-side');
    cm.getWrapperElement().classList.remove('CodeMirror-sided');

    cm.off('update', editor.__syncPreview);
}

export function toggleFullScreen(editor) {
    if (fullscreenActive(editor)) {
        fullScreenOff(editor);
    } else {
        fullScreenOn(editor);
    }
}

export function toggleSideBySide(editor) {
    if (!editor.sidePreviewer) {
        return;
    }

    if (editor.el.classList.contains('smde--live-edit')) {
        liveEditOff(editor);
    } else {
        liveEditOn(editor);
    }
}

export function togglePreview(editor) {
    if (!editor.previewer) {
        return;
    }

    const previewer = editor.previewer;

    previewer.classList.toggle('editor-preview-active');

    if (previewer.classList.contains('editor-preview-active')) {
        previewer.innerHTML = editor.options.renderPreview(editor.value());
    }
}

export function addPreviewer(editor) {
    if (editor.previewer) {
        return;
    }

    const previewer = document.createElement('div');
    previewer.className = 'editor-preview';

    const cm = editor.codemirror;
    const wrapper = cm.getWrapperElement();
    wrapper.appendChild(previewer);
    editor.previewer = previewer;
}

export function addSidePreviewer(editor) {
    if (editor.sidePreviewer) {
        return;
    }

    const cm = editor.codemirror;

    const wrapper = cm.getWrapperElement();
    const preview = document.createElement('div');
    preview.className = 'editor-preview-side';
    wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);

    // Syncs scroll  editor -> preview
    cm.on('scroll', (v) => {
        const height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
        const ratio = parseFloat(v.getScrollInfo().top) / height;
        const move = (preview.scrollHeight - preview.clientHeight) * ratio;
        preview.scrollTop = move;
    });

    // Syncs scroll  preview -> editor
    preview.addEventListener('scroll', () => {
        const height = preview.scrollHeight - preview.clientHeight;
        const ratio = parseFloat(preview.scrollTop) / height;
        const move = (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight) * ratio;
        cm.scrollTo(0, move);
    });

    editor.sidePreviewer = preview;
    editor.__syncPreview = () => {
        preview.innerHTML = editor.options.renderPreview(editor.value());
    };
}
