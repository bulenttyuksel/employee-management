import { LitElement, html, css } from 'lit-element';
import { setLanguage } from '../localization/i18n.js';

class LanguageSwitcher extends LitElement {
    static styles = css`
    img {
      width: 32px;
      height: auto;
      border: none;
      cursor: pointer;
    }
  `;

    constructor() {
        super();
        this.currentLanguage = localStorage.getItem('language') || 'en';
        document.addEventListener('language-changed', () => {
            this.currentLanguage = localStorage.getItem('language');
            this.requestUpdate();
        });
    }

    render() {
        const flag = this.currentLanguage === 'en' ? 'turkish-flag.png' : 'english-flag.png';
        const nextLanguage = this.currentLanguage === 'en' ? 'tr' : 'en';

        return html`
      <img
        src="/src/assets/${flag}"
        alt="Switch Language"
        @click=${() => setLanguage(nextLanguage)}
      />
    `;
    }
}

customElements.define('language-switcher', LanguageSwitcher);