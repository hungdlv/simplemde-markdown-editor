// Browsers have different strategy for `localStorage` in Private Browsing Mode
// Safari for example exposes the API but all calls to `setItem` throw `QuotaExceededError`
//
// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
export function localstorageAvailable() {
    const mod = 'modernizr';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * @returns {object}
 */
function getFunctionKeys() {
    if (/Mac/.test(navigator.platform)) {
        return {
            Ctrl: '⌘',
            Alt: '⌥'
        };
    }

    return {
        Ctrl: 'Ctrl',
        Alt: 'Alt'
    };
}

export const functionKeys = getFunctionKeys();
