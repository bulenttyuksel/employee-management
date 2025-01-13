import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import { deleteEmployee, setViewMode } from "../redux/actions.js";
import './confirmation-dialog.js';
import './pagination-controls.js';
import { t } from '../localization/i18n.js';

class EmployeeTable extends connect(store)(LitElement) {
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      background: #fff;
    }
    th, td {
      padding: 1rem; /* Increased padding for more height */
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    tr {
      min-height: 3rem; /* Set minimum row height */
    }
    th {
      background: #fff;
      font-weight: 600;
    }
    tr:hover {
      background: #f9f9f9;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
    }
    .actions button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: none;
      border: none;
      cursor: pointer;
      fill: var(--primary-color);
    }
    .actions button svg:hover {
      opacity: 0.8;
    }
    #employee-table thead th {
      color: var(--primary-color);
    }
    h1 {
      font-size: 1.8em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .display-options {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
    .display-options button {
      background: none;
      border: none;
      cursor: pointer;
      margin-left: 10px;
    }
    .display-options button svg {
      width: 24px;
      opacity: 0.9;
      fill: var(--primary-color);
      color: var(--primary-color);
    }
    .display-options button:hover svg {
      opacity: 0.8;
    }
    .title {
      color: var(--primary-color);
    }

    /* Grid styles */
    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .employee-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .employee-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    .employee-card h2 {
      font-size: 1.2rem;
      margin: 0;
      color: var(--primary-color);
    }
    .employee-card p {
      margin: 0.5rem 0;
      color: #555;
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      max-width: 100%;
    }
    .employee-actions {
      display: flex;
      gap: 0.5rem;
    }
    .employee-actions button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .employee-actions .edit {
      background-color: var(--primary-color);
      color: white;
    }
    .employee-actions .delete {
      background-color: #f44336;
      color: white;
    }

    @media (max-width: 768px) {
      table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        border: 1px solid #ddd;
      }
      th, td {
        min-width: 120px;
      }
    }

    @media (max-width: 768px) {
      .employee-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.5rem;
      }
    }
  `;


  static get properties() {
    return {
      employees: { type: Array },
      selectedEmployee: { type: Object },
      currentPage: { type: Number },
      employeesPerPage: { type: Number },
      viewMode: { type: String },
    };
  }

  constructor() {
    super();
    this.selectedEmployee = null;
    this.currentPage = 1;
    this.employeesPerPage = 12;
    this.viewMode = 'table';
  }

  connectedCallback() {
    super.connectedCallback();
    this.employees = store.getState().employees;
    document.addEventListener('language-changed', () => this.requestUpdate());
  }

  stateChanged(state) {
    this.employees = state.employees;
    this.viewMode = state.viewMode;
  }

  toggleTableView() {
    store.dispatch(setViewMode('table'));
  }

  toggleGridView() {
    store.dispatch(setViewMode('grid'));
  }

  handleDeleteClick(employee) {
    this.selectedEmployee = employee;
    const dialog = this.shadowRoot.querySelector('confirmation-dialog');
    dialog.open(
      t('deleteConfirmation').replace(
        '{name}',
        `${employee.firstName} ${employee.lastName}`
      )
    );
  }

  handleConfirmed() {
    this.deleteEmployee(this.selectedEmployee.id)
    this.selectedEmployee = null;

    const updatedEmployees = store.getState().employees;
    this.employees = updatedEmployees;

    if (this.paginatedEmployees.length === 0 && this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  handleCancelled() {
    this.selectedEmployee = null;
  }

  deleteEmployee(id) {
    store.dispatch(deleteEmployee(id));
  }

  get totalPages() {
    return Math.ceil(this.employees.length / this.employeesPerPage);
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.employeesPerPage;
    const end = start + this.employeesPerPage;
    return this.employees.slice(start, end);
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  renderGrid() {
    return html`
      <div class="employee-grid">
        ${this.paginatedEmployees.map(
      (emp) => html`
            <div class="employee-card">
              <h2>${emp.firstName} ${emp.lastName}</h2>
              <p><strong>${t('position')}:</strong> ${emp.position}</p>
              <p><strong>${t('department')}:</strong> ${emp.department}</p>
              <p><strong>${t('email')}:</strong> ${emp.email}</p>
              <p><strong>${t('phone')}:</strong> ${emp.phone}</p>
              <div class="employee-actions">
                <button class="edit" @click=${() => this.navigate(`/edit/${emp.id}`)}>
                  ${t('edit')}
                </button>
                <button class="delete" @click=${() => this.handleDeleteClick(emp)}>
                  ${t('delete')}
                </button>
              </div>
            </div>
          `
    )}
      </div>
    `;
  }

  renderTable() {
    return html`
      <table id="employee-table">
          <thead>
            <tr> 
              <th></th> 
              <th>${t('firstName')}</th>
              <th>${t('lastName')}</th>
              <th>${t('employmentDate')}</th>
              <th>${t('birthDate')}</th>
              <th>${t('phone')}</th>
              <th>${t('email')}</th>
              <th>${t('department')}</th>
              <th>${t('position')}</th>
              <th><span class="actions">${t('actions')}</span></th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(
      (emp) => html`
                <tr id=${emp.id}>
                  <td><input type="checkbox" /></td>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.employmentDate}</td>
                  <td>${emp.birthDate}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td>
                    <div class="actions">
                      <button title="Edit" @click=${() => this.navigate(`/edit/${emp.id}`)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/></svg></button>
                      <button title="Delete" @click=${() => this.handleDeleteClick(emp)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
                    </div>
                  </td>
                </tr>
              `
    )}
          </tbody>
        </table>
    `;
  }


  render() {
    return html`
        <h1 class="title">
          ${t('employeeList')}
          <span class="display-options">
            <button @click=${this.toggleTableView} aria-label="Table View">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
            </button>
            <button @click=${this.toggleGridView} aria-label="Grid View">
              <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24"><path d="M4.5,17.5H2a2,2,0,0,0-2,2V22a2,2,0,0,0,2,2H4.5a2,2,0,0,0,2-2V19.5A2,2,0,0,0,4.5,17.5Zm0,4.5H2V19.5H4.5Z"/><path d="M22,17.5H19.5a2,2,0,0,0-2,2V22a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V19.5A2,2,0,0,0,22,17.5ZM22,22H19.5V19.5H22Z"/><path d="M4.5,8.75H2a2,2,0,0,0-2,2v2.5a2,2,0,0,0,2,2H4.5a2,2,0,0,0,2-2v-2.5A2,2,0,0,0,4.5,8.75Zm0,4.5H2v-2.5H4.5Z"/><path d="M22,8.75H19.5a2,2,0,0,0-2,2v2.5a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2v-2.5A2,2,0,0,0,22,8.75Zm0,4.5H19.5v-2.5H22Z"/><path d="M4.5,0H2A2,2,0,0,0,0,2V4.5a2,2,0,0,0,2,2H4.5a2,2,0,0,0,2-2V2A2,2,0,0,0,4.5,0Zm0,4.5H2V2H4.5Z"/><path d="M13.25,17.5h-2.5a2,2,0,0,0-2,2V22a2,2,0,0,0,2,2h2.5a2,2,0,0,0,2-2V19.5A2,2,0,0,0,13.25,17.5Zm0,4.5h-2.5V19.5h2.5Z"/><path d="M13.25,8.75h-2.5a2,2,0,0,0-2,2v2.5a2,2,0,0,0,2,2h2.5a2,2,0,0,0,2-2v-2.5A2,2,0,0,0,13.25,8.75Zm0,4.5h-2.5v-2.5h2.5Z"/><path d="M13.25,0h-2.5a2,2,0,0,0-2,2V4.5a2,2,0,0,0,2,2h2.5a2,2,0,0,0,2-2V2A2,2,0,0,0,13.25,0Zm0,4.5h-2.5V2h2.5Z"/><path d="M22,0H19.5a2,2,0,0,0-2,2V4.5a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V2A2,2,0,0,0,22,0Zm0,4.5H19.5V2H22Z"/></svg>
            </button>
          </span>
        </h1>

        <main>
          ${this.viewMode === 'table' ? this.renderTable() : this.renderGrid()}
          <pagination-controls 
          .currentPage=${this.currentPage}
          .totalPages=${this.totalPages}
          @page-changed=${this.handlePageChange}
          ></pagination-controls>
        </main>

        <confirmation-dialog
          @confirmed=${this.handleConfirmed}
          @cancelled=${this.handleCancelled}
        ></confirmation-dialog>
      `;
  }
}

customElements.define('employee-table', EmployeeTable);