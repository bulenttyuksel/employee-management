import { LitElement, html, css } from 'lit-element';
import { t } from '../localization/i18n.js';

class ConfirmationDialog extends LitElement {
  static properties = {
    message: { type: String },
    isOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.message = '';
    this.isOpen = false;

    document.addEventListener('language-changed', () => this.requestUpdate());
  }

  static styles = css`
    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
    }
    .overlay.open {
      display: flex;
    }
    .dialog {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 350px;
      text-align: left;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color, #ff6600);
    }
    .close-button {
      background: none;
      border: none;
      font-size: 3rem;
      color: var(--primary-color, #ff6600);
      cursor: pointer;
      line-height: 1;
    }
    .message {
      margin-bottom: 1.5rem;
      font-size: 1rem;
      color: #555;
      line-height: 1.5;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    button {
      padding: 0.8rem 0;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    .proceed {
      background-color: var(--primary-color);
      color: white;
    }
    .proceed:hover {
      background-color: var(--primary-hover-color);
    }
    .cancel {
      background-color: transparent;
      border: 1px solid #585790;
      color: #585790;
    }
    .cancel:hover {
      background-color: #d8d7e5; 
    }
  `;

  open(message) {
    this.message = message;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  handleProceed() {
    this.dispatchEvent(new CustomEvent('confirmed'));
    this.close();
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('cancelled'));
    this.close();
  }

  render() {
    return html`
      <div class="overlay ${this.isOpen ? 'open' : ''}">
        <div class="dialog">
          <div class="header">
            <div class="title">${t('confirmationTitle')}</div>
            <button class="close-button" @click=${this.close}>&times;</button>
          </div>

          <div class="message">${this.message}</div>

          <div class="buttons">
            <button class="proceed" @click=${this.handleProceed}>${t('proceedButton')}</button>
            <button class="cancel" @click=${this.handleCancel}>${t('cancelButton')}</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
