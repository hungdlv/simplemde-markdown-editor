let savedOverflow = '';

export function toggleFullScreen(editor) {
    // Set fullscreen
    const cm = editor.codemirror;
    cm.setOption('fullScreen', !cm.getOption('fullScreen'));


    // Prevent scrolling on body during fullscreen active
    if (cm.getOption('fullScreen')) {
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = savedOverflow;
    }


    // Update toolbar class
    const wrap = cm.getWrapperElement();

    if (!/fullscreen/.test(wrap.previousSibling.className)) {
        wrap.previousSibling.className += ' fullscreen';
    } else {
        wrap.previousSibling.className = wrap.previousSibling.className.replace(/\s*fullscreen\b/, '');
    }


    // Update toolbar button
    const toolbarButton = editor.toolbarElements.fullscreen;

    if (!/active/.test(toolbarButton.className)) {
        toolbarButton.className += ' active';
    } else {
        toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, '');
    }


    // Hide side by side if needed
    const sidebyside = cm.getWrapperElement().nextSibling;
    if (/editor-preview-active-side/.test(sidebyside.className)) { toggleSideBySide(editor); }
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
        preview.innerHTML = editor.options.previewRender(editor.value(), preview);
    };

    if (!cm.sideBySideRenderingFunction) {
        cm.sideBySideRenderingFunction = sideBySideRenderingFunction;
    }

    if (useSideBySideListener) {
        preview.innerHTML = editor.options.previewRender(editor.value(), preview);
        cm.on('update', cm.sideBySideRenderingFunction);
    } else {
        cm.off('update', cm.sideBySideRenderingFunction);
    }

    // Refresh to fix selection being off (#309)
    cm.refresh();
}

export function togglePreview(editor) {
    const cm = editor.codemirror;
    const wrapper = cm.getWrapperElement();
    const toolbarEl = wrapper.previousSibling;
    const toolbar = editor.options.toolbar ? editor.toolbarElements.preview : false;
    let preview = wrapper.lastChild;
    if (!preview || !/editor-preview/.test(preview.className)) {
        preview = document.createElement('div');
        preview.className = 'editor-preview';
        wrapper.appendChild(preview);
    }
    if (/editor-preview-active/.test(preview.className)) {
        preview.className = preview.className.replace(
            /\s*editor-preview-active\s*/g, ''
        );
        if (toolbar) {
            toolbar.className = toolbar.className.replace(/\s*active\s*/g, '');
            toolbarEl.className = toolbarEl.className.replace(/\s*disabled-for-preview*/g, '');
        }
    } else {
        // When the preview button is clicked for the first time,
        // give some time for the transition from editor.css to fire and the view to slide from right to left,
        // instead of just appearing.
        setTimeout(() => {
            preview.className += ' editor-preview-active';
        }, 1);
        if (toolbar) {
            toolbar.className += ' active';
            toolbarEl.className += ' disabled-for-preview';
        }
    }
    preview.innerHTML = editor.options.previewRender(editor.value(), preview);

    // Turn off side by side if needed
    const sidebyside = cm.getWrapperElement().nextSibling;
    if (/editor-preview-active-side/.test(sidebyside.className)) { toggleSideBySide(editor); }
}

export function createSidePreview(editor) {
    const cm = editor.codemirror;

    const wrapper = cm.getWrapperElement();
    let preview = wrapper.nextSibling;

    if (!preview || !/editor-preview-side/.test(preview.className)) {
        preview = document.createElement('div');
        preview.className = 'editor-preview-side';
        wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);
    }

    let cScroll = false;
    let pScroll = false;

    // Syncs scroll  editor -> preview
    cm.on('scroll', (v) => {
        if (cScroll) {
            cScroll = false;
            return;
        }
        pScroll = true;
        const height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
        const ratio = parseFloat(v.getScrollInfo().top) / height;
        const move = (preview.scrollHeight - preview.clientHeight) * ratio;
        preview.scrollTop = move;
    });

    // Syncs scroll  preview -> editor
    preview.onscroll = () => {
        if (pScroll) {
            pScroll = false;
            return;
        }
        cScroll = true;
        const height = preview.scrollHeight - preview.clientHeight;
        const ratio = parseFloat(preview.scrollTop) / height;
        const move = (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight) * ratio;
        cm.scrollTo(0, move);
    };

    return preview;
}
