let savedOverflow = '';

export function toggleFullScreen(editor) {
    // Set fullscreen
    const cm = editor.codemirror;
    const isActive = cm.getOption('fullScreen');
    cm.setOption('fullScreen', !isActive);

    // Prevent scrolling on body during fullscreen active
    if (isActive) {
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = savedOverflow;
    }

    editor.el.classList.toggle('smde--fullscreen');

    if (editor.toolbar) {
        editor.toolbar.classList.toggle('fullscreen');
    }
}

export function toggleSideBySide(editor) {
    const cm = editor.codemirror;
    const wrapper = cm.getWrapperElement();
    const preview = wrapper.nextSibling;
    const toolbarButton = editor.toolbarElements['side-by-side'];
    let useSideBySideListener = false;
    if (/editor-preview-active-side/.test(preview.className)) {
        preview.className = preview.className.replace(
            /\s*editor-preview-active-side\s*/g, ''
        );
        toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, '');
        wrapper.className = wrapper.className.replace(/\s*CodeMirror-sided\s*/g, ' ');
    } else {
        // When the preview button is clicked for the first time,
        // give some time for the transition from editor.css to fire and the view to slide from right to left,
        // instead of just appearing.
        setTimeout(() => {
            if (!cm.getOption('fullScreen')) { toggleFullScreen(editor); }
            preview.className += ' editor-preview-active-side';
        }, 1);
        toolbarButton.className += ' active';
        wrapper.className += ' CodeMirror-sided';
        useSideBySideListener = true;
    }

    // Hide normal preview if active
    const previewNormal = wrapper.lastChild;
    if (/editor-preview-active/.test(previewNormal.className)) {
        previewNormal.className = previewNormal.className.replace(
            /\s*editor-preview-active\s*/g, ''
        );
        const toolbar = editor.toolbarElements.preview;
        const toolbarEl = wrapper.previousSibling;
        toolbar.className = toolbar.className.replace(/\s*active\s*/g, '');
        toolbarEl.className = toolbarEl.className.replace(/\s*disabled-for-preview*/g, '');
    }

    const sideBySideRenderingFunction = () => {
        preview.innerHTML = editor.options.renderPreview(editor.value());
    };

    if (!cm.sideBySideRenderingFunction) {
        cm.sideBySideRenderingFunction = sideBySideRenderingFunction;
    }

    if (useSideBySideListener) {
        preview.innerHTML = editor.options.renderPreview(editor.value());
        cm.on('update', cm.sideBySideRenderingFunction);
    } else {
        cm.off('update', cm.sideBySideRenderingFunction);
    }

    // Refresh to fix selection being off (#309)
    cm.refresh();
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
}
