import { createEditor } from '../src/js/index';

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textarea');
    createEditor(textarea);
});
