/**
 * @param {string} text
 */
export function wordCount(text) {
    const pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    const matches = text.match(pattern);

    if (matches === null) {
        return 0;
    }

    return matches.reduce((acc, word) => {
        const wordCount = word.charCodeAt(0) >= 0x4E00
            ? word.length // CJK characters
            : 1;

        return acc + wordCount;
    }, 0);
}
