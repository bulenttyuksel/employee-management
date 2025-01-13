import { translations } from './translations.js';

let currentLanguage = localStorage.getItem('language') || 'en';

export function setLanguage(lang) {
    if (lang !== currentLanguage) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.dispatchEvent(new Event('language-changed'));
    }
}

export function t(key) {
    return translations[currentLanguage][key] || key;
}