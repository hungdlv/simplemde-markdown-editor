import { createEditor } from '../dist/simplemde.es';

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textarea');
    createEditor(textarea);
});
