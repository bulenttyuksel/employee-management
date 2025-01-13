import '../../env.js';
import { LitElement, html, css } from "lit-element";
import './app-header.js';

class App extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      min-height: 100vh;
      box-sizing: border-box;
    }
  `;

  render() {
    return html`
      <app-header></app-header>
      <div id="router-outlet"></div>
    `;
  }

  firstUpdated() {
    import('../../config/router.js');
  }
}

customElements.define('app-root', App);