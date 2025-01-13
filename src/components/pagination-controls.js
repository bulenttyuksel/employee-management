import { LitElement, html, css } from "lit-element";

class PaginationControls extends LitElement {
  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
    }

    .pagination button {
      border: none;
      background: none;
      margin: 0 0.25rem;
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      text-align: center;
      border-radius: 50%;
      font-size: 1rem;
      line-height: 2rem;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination button:hover {
      opacity: 0.8;
    }

    .pagination .current {
      background-color: #ff6600;
      color: white;
      font-weight: bold;
    }

    .pagination span {
      margin: 0 0.25rem;
      font-size: 1rem;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      line-height: 2rem;
    }
  `;

  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
  };

  constructor() {
    super();
    this.currentPage = 1;
  }

  render() {
    const pagesToShow = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisiblePages = 6;

    if (total <= maxVisiblePages) {
      pagesToShow.push(...Array.from({ length: total }, (_, i) => i + 1));
    } else {
      pagesToShow.push(1);

      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);

      if (current === 1) end = 3;
      if (current === total) start = total - 2;

      if (start > 2) {
        pagesToShow.push('...');
      }

      for (let i = start; i <= end; i++) {
        pagesToShow.push(i);
      }

      if (end < total - 1) {
        pagesToShow.push('...');
      }

      pagesToShow.push(total);
    }

    return html`
      <div class="pagination">
        <button 
          @click=${() => this.changePage(this.currentPage - 1)} 
          ?disabled=${this.currentPage === 1}
        >
          &lt;
        </button>
  
        ${pagesToShow.map((page) =>
      page === '...'
        ? html`<span>...</span>`
        : html`
                <button
                  class=${this.currentPage === page ? 'current' : ''}
                  @click=${() => this.changePage(page)}
                >
                  ${page}
                </button>
              `
    )}
  
        <button 
          @click=${() => this.changePage(this.currentPage + 1)} 
          ?disabled=${this.currentPage === this.totalPages}
        >
          &gt;
        </button>
      </div>
    `;
  }

  changePage(page) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.dispatchEvent(new CustomEvent('page-changed', { detail: { page } }));
    }
  }
}

customElements.define('pagination-controls', PaginationControls);